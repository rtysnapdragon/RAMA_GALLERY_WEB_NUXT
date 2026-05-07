// stores/notifications.ts
import { defineStore } from 'pinia'

interface ToastItem {
    id: number
    message: string
    type: string
}

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
    notifications?: string[],
    lastSoundTime?: number
    IsSelected: boolean
}
type FilterType =
    | 'all'
    | 'unread'
    | 'read'
    | 'likes'
    | 'comments'
    | 'system'
    | 'view'

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
    isFirstLoad: boolean,
    force: boolean,

    // For Debounce
    toasts: ToastItem[],
    buffer: NotificationItem[],
    flushTimer: ReturnType<typeof setTimeout> | null,
    badgePulse: boolean,
    audio: HTMLAudioElement | null,
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
        isFirstLoad: true, //#2: Separate "first load" vs "refresh"
        force: false,

        toasts: [] as ToastItem[],
        buffer: [] as NotificationItem[],
        flushTimer: null as any,
        badgePulse: false,
        lastSoundTime: 0,
        audio: null
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
        initSound() {
            if (!import.meta.client) return

            if (!this.audio) {
                this.audio = new Audio(
                    'https://notificationsounds.com/storage/sounds/file-sounds-1149-ting.mp3'
                )
                this.audio.volume = 0.5
            }
        },
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

        insertRealtime(payload: NotificationItem) {
            const exists = this.notifications.find((n) => n.Id === payload.Id)

            if (exists) return

            // prevent ghost reinsert
            if (payload?.IsDeleted) return

            this.notifications.unshift(payload)
        },
        /* =======================
            FETCH LIST
        ======================= */

        async fetchNotifications() {   // initial state
            if (!this.notifToken) {
                console.log('No notification token')
                return
            }
            // 🔥 prevent reloading if already have data Prevent unnecessary loading flicker that none auto websocket
            // if (!this.force && this.notifications.length > 0) {
            //     console.log('return this.force && this.notifications.length > 0: ', this.force && this.notifications.length > 0)
            //     return
            // }
            try {
                this.notifLoading = true
                console.log('this.notifToken: ', this.notifToken)

                const config = useRuntimeConfig()

                const { data, error } = await useWeb<NotificationItem[]>(
                    `api/notifications?take=100`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${this.notifToken}`
                        }
                    }
                )
                this.notifications = Array.isArray(data.value) ? data.value : []
                // this.notifications = data.value || []
            } catch (e: any) {
                console.log('fetchNotifications', e.value?.Message)
            } finally {
                this.notifLoading = false
                this.isFirstLoad = false
            }
        },

        /* =======================
           OPEN NOTIFICATION &  CLICK ITEM
        ======================= */

        async openNotification(item: NotificationItem) {
            if (!item.IsRead) {
                await this.markRead(item.Id)
            }

            const ui = useUIStore()
            ui.notifPanelOpen = false

            if (item.Href) {
                await navigateTo(localePath(item.Href))
            }
        },

        removeNotification(id: number) {
            this.notifications = this.notifications.filter(n => n.Id !== id)
        },

        async clearAll() {
            this.notifications = []

            try {
                const config = useRuntimeConfig()

                await useWeb(`${config.public.apiBase}api/notifications/clear`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${this.notifToken}`
                    }
                })
            } catch (e) {
                console.log(e)
            }
        },

        /* =======================
           MARK AS READ
        ======================= */
        async markAsRead(n: NotificationItem) {
            if (n.IsRead) return

            n.IsRead = true

            try {
                await this.markRead(n.Id)
            } catch (e) {
                n.IsRead = false
            }
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

                await useWeb(`api/notifications/read?Id=${id}`, {
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
            const hasUnread = this.notifications.some(n => !n.IsRead)
            if (!hasUnread) {
                console.log('All notifications already read — skip API')
                return
            }

            // optimistic update
            this.notifications.forEach(n => (n.IsRead = true))

            try {
                await useWeb(`api/notifications/read-all`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${this.notifToken}`
                    }
                }
                )
            } catch (e) {
                console.log('markAllRead error:', e)
            }
        },

        async deleteOne(id: number) {
            const old = [...this.notifications]

            // remove instantly (UI feels fast)
            this.notifications = this.notifications.filter(n => n.Id !== id)

            try {
                const config = useRuntimeConfig()

                await useWeb(`api/notifications/delete?Id=${id}`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${this.notifToken}`
                    },
                })
            } catch (e) {
                // rollback if failed
                this.notifications = old
                console.log('delete failed', e)
            }
        },

        /* =======================
           REALTIME WS REALTIME WEBSOCKET
        ======================= */

        connectRealtime() {   // live updates WebSocket (Realtime updates)
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
                this.notifSocket.readyState === WebSocket.OPEN
                // [WebSocket.OPEN, WebSocket.CONNECTING].includes(this.notifSocket.readyState)
            ) return

            const config = useRuntimeConfig()

            console.log('wsBase =============> : ', config.public.wsBase)

            const ws = new WebSocket(
                `${config.public.wsBase}ws/notifications/?token=${this.notifToken}`
            )

            ws.onopen = () => {
                console.log('Notification WS connected')
                this.reconnectAttempts = 0
            }

            ws.onmessage = (event) => {
                console.log('ws.onmessage =============>:', event.data)
                try {
                    const payload = JSON.parse(event.data)
                    this.insertRealtime(payload)

                    // 🔥 trigger toast
                    this.pushToast(payload)
                    this.handleIncoming(payload)
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
            this.pollingTimer = setInterval(() => {
                console.log("Polling fetch...")
                this.fetchNotifications()
            },
                30000
            )
            // setInterval(() => {
            //     this.fetchNotifications()
            // }, 30000)
        },

        stopPolling() { //(backup)
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
            if (this.initialized && this.notifToken === token) return

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
        },

        playSound1(type?: string) { //If you want different sounds per type:
            if (!import.meta.client) return

            const now = Date.now()
            if (now - this.lastSoundTime < 1500) return

            let src = 'https://notificationsounds.com/storage/sounds/file-sounds-1149-ting.mp3'

            if (type === 'comment') {
                src = 'https://notificationsounds.com/storage/sounds/file-sounds-1137-eventually.mp3'
            }

            if (!this.audio || this.audio.src !== src) {
                this.audio = new Audio(src)
                this.audio.volume = 0.5
            }

            this.audio.currentTime = 0
            this.audio.play().catch(() => { })

            this.lastSoundTime = now

            //usage
            // this.playSound(batch[0]?.Type)
        },
        playSound() {
            if (!import.meta.client) return

            const now = Date.now()

            // prevent spam (min 1.5s gap)
            if (now - this.lastSoundTime < 1500) return

            if (!this.audio) {
                this.initSound()
            }
            // const audio = new Audio('https://notificationsounds.com/storage/sounds/file-sounds-1150-pristine.mp3')
            // // https://notificationsounds.com/storage/sounds/file-sounds-1137-eventually.mp3

            // audio.volume = 0.6
            if (this.audio) {
                this.audio.currentTime = 0 // 🔥 rewind for fast replay
                this.audio.play().catch(() => { })
            }
            // audio.play().catch(() => {
            //     // ignore autoplay block
            // })

            this.lastSoundTime = now
        },
        triggerBadgePulse() {
            this.badgePulse = true

            setTimeout(() => {
                this.badgePulse = false
            }, 600)
        },

        pushToast(n: NotificationItem) {
            console.log('pushToast=============>:', n)
            const ui = useUIStore()

            // if (ui.notifPanelOpen) {
            //     return
            // }

            const toast = {
                id: Date.now(),
                message: n.Message,
                type: n.Type
            }

            this.toasts.push(toast)

            // auto remove after 4s
            setTimeout(() => {
                this.toasts = this.toasts.filter(t => t.id !== toast.id)
            }, 4000)
        },
        handleIncoming(payload: NotificationItem) {
            // dedupe (by Id)
            const exists =
                this.notifications.find(n => n.Id === payload.Id) ||
                this.buffer.find(n => n.Id === payload.Id)

            if (exists) return

            this.buffer.push(payload)

            // schedule batch flush
            if (!this.flushTimer) {
                this.flushTimer = setTimeout(() => {
                    this.flushBuffer()
                }, 500) // 👈 tune: 300–800ms
            }
        },
        flushBuffer() { //Flush buffer (CORE LOGIC)
            const batch = [...this.buffer]

            this.buffer = []
            clearTimeout(this.flushTimer)
            this.flushTimer = null

            if (!batch.length) return

            console.log("flushBuffer=============>: ", batch)

            // 1. Insert into list (latest first)
            batch.reverse().forEach(n => {
                this.notifications.unshift(n)
            })

            // 2. Group by type
            const grouped = this.groupNotifications(batch)

            // 3. UI feedback (controlled)
            const ui = useUIStore()

            if (!ui.notifPanelOpen) {
                this.pushBatchToast(grouped)
                this.playSound()
                this.triggerBadgePulse()
            }
        },
        groupNotifications(list: NotificationItem[]) { //Grouping logic (ANTI-SPAM CORE)
            const map: Record<string, NotificationItem[]> = {}

            for (const n of list) {
                if (!map[n.Type]) map[n.Type] = []
                map[n.Type].push(n)
            }

            return map
        },

        pushBatchToast(grouped: Record<string, NotificationItem[]>) { //Smart toast aggregation
            Object.entries(grouped).forEach(([type, items]) => {

                // single → normal toast
                if (items.length === 1) {
                    this.pushToast(items[0])
                    return
                }

                // multiple → aggregated message
                let message = ''

                if (type === 'like') {
                    message = `${items.length} new likes`
                } else if (type === 'comment') {
                    message = `${items.length} new comments`
                } else if (type === 'follow') {
                    message = `${items.length} new followers`
                } else {
                    message = `${items.length} new notifications`
                }

                this.toasts.push({
                    id: Date.now() + Math.random(),
                    message,
                    type
                })
                const id = Date.now() + Math.random()
                this.toasts.push({ id, message, type })
                setTimeout(() => {
                    // this.toasts = this.toasts.filter(t => t.message !== message)
                    this.toasts = this.toasts.filter(t => t.id !== id)
                }, 4000)
            })
        },

        handleRealtimeNotification(payload: any) {
            console.log('🔥 NEW NOTIFICATION:', payload)

            this.notifications.unshift(payload)

            const grouped = this.groupNotifications(this.notifications)

            this.pushBatchToast(grouped)

            this.setUnreadCount(this.notifications.filter(n => !n.IsRead).length)
        },
    }
})