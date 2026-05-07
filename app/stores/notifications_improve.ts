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
    Cover?: string
}

type FilterType = 'all' | 'unread' | 'read' | 'likes' | 'comments' | 'system'

interface NotificationState {
    notifications: NotificationItem[]
    notifSocket: WebSocket | null
    notifLoading: boolean
    notifToken: string | null
    filter: FilterType
    reconnectTimer: ReturnType<typeof setTimeout> | null
    pollingTimer: ReturnType<typeof setInterval> | null
    initialized: boolean
    reconnectAttempts: number
    maxReconnectAttempts: number
    isFirstLoad: boolean
    force: boolean
    toasts: ToastItem[]
    buffer: NotificationItem[]
    flushTimer: ReturnType<typeof setTimeout> | null
    badgePulse: boolean
    audio: HTMLAudioElement | null
    lastSoundTime: number
}

export const useNotificationStore_improve = defineStore('notifications', {
    state: (): NotificationState => ({
        notifications: [],
        notifSocket: null,
        notifLoading: false,
        notifToken: null,
        filter: 'all',
        reconnectTimer: null,
        pollingTimer: null,
        initialized: false,
        reconnectAttempts: 0,
        maxReconnectAttempts: 10,
        isFirstLoad: true,
        force: false,
        toasts: [],
        buffer: [],
        flushTimer: null,
        badgePulse: false,
        audio: null,
        lastSoundTime: 0,
    }),

    getters: {
        unreadCount: (state) =>
            Array.isArray(state.notifications)
                ? state.notifications.filter(n => !n.IsRead).length
                : 0,

        readCount: (state) => state.notifications.filter(n => n.IsRead).length,

        allCount: (state) => state.notifications.length,

        typeCounts: (state) => ({
            all: state.notifications.length,
            unread: state.notifications.filter(n => !n.IsRead).length,
            read: state.notifications.filter(n => n.IsRead).length,
            likes: state.notifications.filter(n => n.Type === 'like').length,
            comments: state.notifications.filter(n => n.Type === 'comment').length,
            system: state.notifications.filter(n => n.Type === 'system').length,
        }),

        filteredNotifications(state) {
            switch (state.filter) {
                case 'unread': return state.notifications.filter(n => !n.IsRead)
                case 'read': return state.notifications.filter(n => n.IsRead)
                case 'system': return state.notifications.filter(n => n.Type === 'system')
                case 'likes': return state.notifications.filter(n => n.Type === 'like')
                case 'comments': return state.notifications.filter(n => n.Type === 'comment')
                default: return state.notifications
            }
        },

        // ✅ NEW: whether WebSocket is currently alive
        isWsAlive(): boolean {
            return !!(this.notifSocket && this.notifSocket.readyState === WebSocket.OPEN)
        },
    },

    actions: {
        /* ── Sound ── */
        initSound() {
            if (!import.meta.client || this.audio) return
            this.audio = new Audio(
                'https://notificationsounds.com/storage/sounds/file-sounds-1149-ting.mp3'
            )
            this.audio.volume = 0.5
        },

        playSound() {
            if (!import.meta.client) return
            const now = Date.now()
            if (now - this.lastSoundTime < 1500) return
            if (!this.audio) this.initSound()
            if (this.audio) {
                this.audio.currentTime = 0
                this.audio.play().catch(() => { })
            }
            this.lastSoundTime = now
        },

        /* ── Filter ── */
        setFilter(type: FilterType) {
            this.filter = type
        },

        /* ── Token ── */
        setToken(token: string) {
            this.notifToken = token
        },
        clearToken() {
            this.notifToken = null
        },

        /* ── Time helper ── */
        formatTime(date: string) {
            const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
            if (diff < 60) return 'Just now'
            if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
            if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
            if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
            return new Date(date).toLocaleDateString()
        },

        /* ── Badge pulse ── */
        triggerBadgePulse() {
            this.badgePulse = true
            setTimeout(() => { this.badgePulse = false }, 600)
        },

        /* ════════════════════════════════════
           FETCH  (initial load + polling fallback)
        ════════════════════════════════════ */
        async fetchNotifications() {
            if (!this.notifToken) return

            // ✅ Skip poll when WebSocket is alive and data is already loaded
            if (this.isWsAlive && this.notifications.length > 0 && !this.force) {
                console.log('[notif] WS alive — skip poll')
                return
            }

            try {
                this.notifLoading = true
                const { data } = await useWeb<NotificationItem[]>(
                    'api/notifications?take=100',
                    {
                        method: 'GET',
                        headers: { Authorization: `Bearer ${this.notifToken}` },
                    }
                )
                this.notifications = Array.isArray(data.value) ? data.value : []
            } catch (e: any) {
                console.error('[notif] fetchNotifications:', e)
            } finally {
                this.notifLoading = false
                this.isFirstLoad = false
                this.force = false
            }
        },

        /* ════════════════════════════════════
           MARK READ
        ════════════════════════════════════ */
        async markRead(id: number) {
            const row = this.notifications.find(n => n.Id === id)
            if (row) row.IsRead = true

            try {
                await useWeb(`api/notifications/read?Id=${id}`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${this.notifToken}` },
                })
            } catch (e) {
                console.error('[notif] markRead:', e)
            }
        },

        async markAllRead() {
            if (!this.notifications.some(n => !n.IsRead)) return
            this.notifications.forEach(n => (n.IsRead = true))
            try {
                await useWeb('api/notifications/read-all', {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${this.notifToken}` },
                })
            } catch (e) {
                console.error('[notif] markAllRead:', e)
            }
        },

        /* ════════════════════════════════════
           OPEN / NAVIGATE
        ════════════════════════════════════ */
        async openNotification(item: NotificationItem) {
            if (!item.IsRead) await this.markRead(item.Id)
            const ui = useUIStore()
            ui.notifPanelOpen = false
            if (item.Href) await navigateTo(localePath(item.Href))
        },

        /* ════════════════════════════════════
           REALTIME — WebSocket
        ════════════════════════════════════ */
        connectRealtime() {
            if (!import.meta.client || !this.notifToken) return
            if (this.isWsAlive) return

            const config = useRuntimeConfig()
            const ws = new WebSocket(
                `${config.public.wsBase}ws/notifications/?token=${this.notifToken}`
            )

            ws.onopen = () => {
                console.log('[notif] WS connected')
                this.reconnectAttempts = 0
                // ✅ Stop polling now that WS is live
                this.stopPolling()
            }

            ws.onmessage = (event) => {
                try {
                    const payload: NotificationItem = JSON.parse(event.data)
                    // ✅ Single entry point — NO direct pushToast here
                    this.handleIncoming(payload)
                } catch (e) {
                    console.error('[notif] WS parse error:', e)
                }
            }

            ws.onerror = () => ws.close()

            ws.onclose = () => {
                this.notifSocket = null
                if (!this.notifToken) return
                if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                    console.warn('[notif] WS reconnect stopped — falling back to polling')
                    this.startPolling()
                    return
                }
                this.reconnectAttempts++
                // ✅ Start polling while WS is down
                this.startPolling()
                const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000)
                this.reconnectTimer = setTimeout(() => this.connectRealtime(), delay)
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

        /* ════════════════════════════════════
           POLLING FALLBACK
           Only runs when WS is NOT connected
        ════════════════════════════════════ */
        startPolling() {
            if (this.pollingTimer) return
            console.log('[notif] Polling started')
            this.pollingTimer = setInterval(() => {
                if (this.isWsAlive) {
                    // WS recovered — stop polling
                    this.stopPolling()
                    return
                }
                this.fetchNotifications()
            }, 30_000)
        },

        stopPolling() {
            if (this.pollingTimer) {
                clearInterval(this.pollingTimer)
                this.pollingTimer = null
                console.log('[notif] Polling stopped')
            }
        },

        /* ════════════════════════════════════
           INCOMING PIPELINE
           handleIncoming → buffer → flushBuffer
           (single path for ALL new events)
        ════════════════════════════════════ */
        handleIncoming(payload: NotificationItem) {
            // ✅ Dedup against both live list and pending buffer
            const alreadyExists =
                this.notifications.some(n => n.Id === payload.Id) ||
                this.buffer.some(n => n.Id === payload.Id)

            if (alreadyExists) return

            this.buffer.push(payload)

            if (!this.flushTimer) {
                this.flushTimer = setTimeout(() => this.flushBuffer(), 400)
            }
        },

        flushBuffer() {
            const batch = [...this.buffer]
            this.buffer = []
            if (this.flushTimer) {
                clearTimeout(this.flushTimer)
                this.flushTimer = null
            }
            if (!batch.length) return

                // 1. Insert into list (latest first)
                ;[...batch].reverse().forEach(n => this.notifications.unshift(n))

            // 2. UI feedback — only when panel is closed
            const ui = useUIStore()
            if (!ui.notifPanelOpen) {
                const grouped = this.groupByType(batch)
                this.pushBatchToast(grouped)
                this.playSound()
                this.triggerBadgePulse()
            }
        },

        groupByType(list: NotificationItem[]): Record<string, NotificationItem[]> {
            return list.reduce((acc, n) => {
                acc[n.Type] = acc[n.Type] ?? []
                acc[n.Type].push(n)
                return acc
            }, {} as Record<string, NotificationItem[]>)
        },

        /* ════════════════════════════════════
           TOAST
        ════════════════════════════════════ */
        pushToast(n: NotificationItem) {
            const toast: ToastItem = {
                id: Date.now() + Math.random(),
                message: n.Message,
                type: n.Type,
            }
            this.toasts.push(toast)
            setTimeout(() => {
                this.toasts = this.toasts.filter(t => t.id !== toast.id)
            }, 4_500)
        },

        // ✅ Fixed: was pushing the same toast twice before
        pushBatchToast(grouped: Record<string, NotificationItem[]>) {
            Object.entries(grouped).forEach(([type, items]) => {
                if (items.length === 1) {
                    this.pushToast(items[0])
                    return
                }

                const labels: Record<string, string> = {
                    like: `${items.length} new likes`,
                    comment: `${items.length} new comments`,
                    follow: `${items.length} new followers`,
                    save: `${items.length} saved your artwork`,
                }
                const message = labels[type] ?? `${items.length} new notifications`

                const toast: ToastItem = {
                    id: Date.now() + Math.random(),
                    message,
                    type,
                }
                this.toasts.push(toast)
                setTimeout(() => {
                    this.toasts = this.toasts.filter(t => t.id !== toast.id)
                }, 4_500)
            })
        },

        /* ════════════════════════════════════
           LIFECYCLE
        ════════════════════════════════════ */
        async init(token: string) {
            if (this.initialized && this.notifToken === token) return

            this.setToken(token)
            await this.fetchNotifications()

            this.connectRealtime()
            // ✅ Don't start polling here — connectRealtime handles it
            // Polling only starts if WS fails to connect (in ws.onclose)

            this.initialized = true
        },

        cleanup() {
            this.stopPolling()
            this.disconnectRealtime()
        },

        reset() {
            this.cleanup()
            this.notifications = []
            this.notifToken = null
            this.filter = 'all'
            this.initialized = false
            this.reconnectAttempts = 0
            this.isFirstLoad = true
            this.toasts = []
            this.buffer = []
        },
    },
})
