// stores/notifications.ts
import { defineStore } from 'pinia'

export interface NotificationItem {
    Id: number
    Type: 'like' | 'comment' | 'follow' | 'save' | 'system'
    Message: string
    From?: string
    FromAvatar?: string
    IsRead: boolean
    CreatedAt: string
    Href?: string
    Cover?: string,
    notifications?: string[]
}
type FilterType =
    | 'all'
    | 'unread'
    | 'read'
    | 'likes'
    | 'comments'
    | 'system'

interface NotificationState {
    notifications: NotificationItem[]
    notifSocket: WebSocket | null
    socket: any,
    notifLoading: boolean
    notifToken: string | null
    // filter: 'all' | 'unread' | 'read' | 'mentions' | 'system',
    filter: FilterType
    // reconnectTimer: any
    // pollingTimer: any
    reconnectTimer: ReturnType<typeof setTimeout> | null
    pollingTimer: ReturnType<typeof setInterval> | null

    initialized: boolean
    reconnectAttempts: number
    maxReconnectAttempts: number
}

export const useNotificationStore = defineStore('notifications', {
    state: (): NotificationState => ({
        notifications: [],
        notifSocket: null,
        notifLoading: false,
        notifToken: null,
        filter: 'all' as 'all' | 'unread' | 'read' | 'mentions' | 'system',
        // filter: 'all',
        reconnectTimer: null,
        pollingTimer: null,
        initialized: false,
        reconnectAttempts: 0,
        maxReconnectAttempts: 10,
    }),

    /* ----------------------------------
       GETTERS
    ---------------------------------- */
    getters: {
        // unreadCount: (state) =>
        //     state.notifications?.filter(n => !n.IsRead).length,
        unreadCount: (state) =>
            Array.isArray(state.notifications)
                ? state.notifications.filter(n => !n.IsRead).length
                : 0,

        readCount: (state) => state.notifications.filter(n => n.IsRead).length,

        allCount: (state) => state.notifications.length,

        typeCounts: (state) => {
            return {
                all: state.notifications.length,
                unread: state.notifications.filter(n => !n.IsRead).length,
                read: state.notifications.filter(n => n.IsRead).length,
                likes: state.notifications.filter(n => n.Type === 'like').length,
                comments: state.notifications.filter(n => n.Type === 'comment').length,
                system: state.notifications.filter(n => n.Type === 'system').length,
            }
        },
        filteredNotifications(state) {
            switch (state.filter) {
                case 'unread':
                    return state.notifications.filter(n => !n.IsRead)

                case 'read':
                    return state.notifications.filter(n => n.IsRead)

                case 'system':
                    return state.notifications.filter(n => n.Type === 'system')

                case 'likes':
                    return state.notifications.filter(n => n.Type === 'like')

                case 'comments':
                    return state.notifications.filter(n => n.Type === 'comment')

                default:
                    return state.notifications
            }
        }
    },

    /* ----------------------------------
       ACTIONS
    ---------------------------------- */
    actions: {
        /* ------------------------------
            FILTER
        ------------------------------ */
        setFilter(type: FilterType) {
            console.log(`Type this.filter ========> ${type}`)
            this.filter = type
        },

        /* ------------------------------
            TOKEN
        ------------------------------ */

        setToken(token: string) {
            this.notifToken = token
        },

        clearToken() {
            this.notifToken = null
        },

        /* ------------------------------
           HELPERS
        ------------------------------ */
        formatTime(date: string) {
            const d = new Date(date)
            const now = new Date()

            const diff = Math.floor(
                (now.getTime() -
                    d.getTime()) /
                1000
            )

            if (diff < 60)
                return 'Just now'

            if (diff < 3600)
                return `${Math.floor(
                    diff / 60
                )}m ago`

            if (diff < 86400)
                return `${Math.floor(
                    diff / 3600
                )}h ago`

            if (diff < 604800)
                return `${Math.floor(
                    diff / 86400
                )}d ago`

            return d.toLocaleDateString()
        },

        insertRealtime(
            payload: NotificationItem
        ) {
            const exists =
                this.notifications.find(
                    (n) =>
                        n.Id === payload.Id
                )

            if (exists) return

            this.notifications.unshift(
                payload
            )
        },
        /* =======================
            FETCH LIST
        ======================= */

        async fetchNotifications() {
            if (!this.notifToken) {
                console.log('No notification token')
                return
            }
            try {
                this.notifLoading = true
                console.log('this.notifToken: ', this.notifToken)

                const config = useRuntimeConfig()

                const { data, error } = await useWeb<NotificationItem[]>(
                    `${config.public.apiBase}api/notifications?take=100`,
                    {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${this.notifToken}`
                        }
                    }
                )
                console.log('data============>:', data)
                console.log('data.value============>:', data.value)
                this.notifications = data.value || []
            } catch (e: any) {
                console.log('fetchNotifications', e.value?.Message)
            } finally {
                this.notifLoading = false
            }
        },

        /* =======================
           OPEN NOTIFICATION
        ======================= */

        async openNotification(item: NotificationItem) {
            await this.markRead(item.Id)

            const ui = useUIStore()
            ui.notifPanelOpen = false

            if (item.Href)
                await navigateTo(localePath(item.Href))
        },

        /* =======================
           MARK READ
        ======================= */

        async markRead(id: number) {
            console.log('markRead=============>:', id)

            const row = this.notifications.find(n => n.Id === id)

            if (row) row.IsRead = true

            try {
                const config = useRuntimeConfig()

                await useWeb(
                    `${config.public.apiBase}api/notifications/read?Id=${id}`,
                    {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${this.notifToken}`
                        }
                    }
                )
            } catch (error) {
                console.log(
                    'markRead=============>:',
                    error
                )
            }
        },

        async markAllRead() {
            this.notifications.forEach(n => (n.IsRead = true))

            try {
                const config = useRuntimeConfig()

                await useWeb(
                    `${config.public.apiBase}api/notifications/read-all`,
                    {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${this.notifToken}`
                        }
                    }
                )
            } catch (e) {
                console.log(
                    'markAllRead ===============>:',
                    e
                )
            }
        },

        /* =======================
           REALTIME WS REALTIME WEBSOCKET
        ======================= */

        connectRealtime() {
            if (!import.meta.client) {
                console.log('Not in client')
                return
            }
            if (!this.notifToken) {
                console.log('No notification token')
                return
            }
            // if (this.notifSocket) return
            if (
                // this.socket &&
                this.notifSocket &&
                this.notifSocket.readyState ===
                WebSocket.OPEN
            ) return

            const config = useRuntimeConfig()

            console.log('wsBase =============> : ', config.public.wsBase)

            const ws = new WebSocket(
                `${config.public.wsBase}/ws/notifications/?token=${this.notifToken}`
            )

            ws.onopen = () => {
                console.log('Notification WS connected')
                this.reconnectAttempts = 0
            }

            ws.onmessage = (event) => {
                try {
                    const payload = JSON.parse(event.data)
                    this.insertRealtime(payload)

                } catch (error) {
                    console.log('onmessage error ====>', error)
                }
            }

            ws.onerror = () => ws.close()

            ws.onclose = () => {
                this.notifSocket = null
                if (!this.notifToken) return
                if (this.reconnectAttempts >= 5) {
                    console.log('WS reconnect stopped')
                    return
                }

                this.reconnectAttempts++

                this.reconnectTimer =
                    setTimeout(
                        () => {
                            this.connectRealtime()
                        },
                        3000
                    )
            }
            this.notifSocket = ws
        },

        disconnectRealtime() {
            if (this.reconnectTimer) {
                clearTimeout(this.reconnectTimer)
                this.reconnectTimer = null
            }

            if (this.notifSocket) {
                this.notifSocket.close()
                this.notifSocket = null
            }
        },

        /* =======================
           POLLING FALLBACK
        ======================= */

        startPolling() {
            if (this.pollingTimer) return
            this.pollingTimer =
                setInterval(
                    () => {
                        this.fetchNotifications()
                    },
                    30000
                )
            // setInterval(() => {
            //     this.fetchNotifications()
            // }, 30000)
        },

        stopPolling() {
            if (
                this.pollingTimer
            ) {
                clearInterval(
                    this.pollingTimer
                )

                this.pollingTimer =
                    null
            }
        },

        /* =======================
            CLEANUP
        ======================= */

        cleanup() {
            this.stopPolling()
            this.disconnectRealtime()
        },

        /* =======================
           INIT
        ======================= */
        async init(token: string) {
            if (
                this.initialized &&
                this.notifToken === token
            ) return

            this.setToken(token)

            await this.fetchNotifications()

            this.connectRealtime()

            this.startPolling()

            this.initialized = true
        },

        /* ------------------------------
           RESET ON LOGOUT
        ------------------------------ */
        reset() {
            this.disconnectRealtime()
            this.stopPolling()

            this.notifications = []

            this.notifToken = null

            this.filter = 'all'

            this.initialized = false
            this.reconnectAttempts = 0
        }
    }
})