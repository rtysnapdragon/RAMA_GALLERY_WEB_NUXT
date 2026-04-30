// stores/ui.ts
import { defineStore } from 'pinia'

/*
FULL PRODUCTION VERSION

Features:
- realtime notifications
- route on click
- Django PascalCase API support
- token auth
- unread count
- optimistic updates
- polling fallback
- websocket ready
*/

export interface NotificationItem {
  Id: number
  Type: 'like' | 'comment' | 'follow' | 'save' | 'system'
  Message: string
  From?: string
  FromAvatar?: string
  Read: boolean
  CreatedAt: string

  /*
  Route when clicked
  Example:
  /gallery/mekong-memories
  /artists/sophea-khun
  /dashboard/notifications
  */
  Href?: string

  /*
  optional image
  */
  Cover?: string
}

interface UIState {
  isDark: boolean
  notifPanelOpen: boolean
  aiAssistantOpen: boolean
  searchOpen: boolean
  mobileMenuOpen: boolean

  notifications: NotificationItem[]

  notifSocket: WebSocket | null
  notifLoading: boolean
  notifToken: string | null
}

export const useUIStore = defineStore('ui', {
  state: (): UIState => ({
    isDark: false,
    notifPanelOpen: false,
    aiAssistantOpen: false,
    searchOpen: false,
    mobileMenuOpen: false,

    notifications: [],

    notifSocket: null,
    notifLoading: false,
    notifToken: null
  }),

  getters: {
    unreadCount: (state) =>
      state.notifications.filter(n => !n.Read).length
  },

  actions: {
    /* =======================
       THEME
    ======================= */

    initTheme() {
      if (!import.meta.client) return

      const saved = localStorage.getItem('rama_theme')
      const prefersDark =
        window.matchMedia('(prefers-color-scheme: dark)').matches

      this.isDark = saved
        ? saved === 'dark'
        : prefersDark

      this.applyTheme()
    },

    toggleTheme() {
      this.isDark = !this.isDark
      this.applyTheme()

      localStorage.setItem(
        'rama_theme',
        this.isDark ? 'dark' : 'light'
      )
    },

    applyTheme() {
      if (!import.meta.client) return

      document.documentElement.classList.toggle(
        'dark',
        this.isDark
      )
    },

    /* =======================
       PANELS
    ======================= */

    toggleNotifPanel() {
      this.notifPanelOpen = !this.notifPanelOpen
      this.aiAssistantOpen = false
      this.searchOpen = false
    },

    toggleAIAssistant() {
      this.aiAssistantOpen = !this.aiAssistantOpen
      this.notifPanelOpen = false
    },

    toggleSearch() {
      this.searchOpen = !this.searchOpen
    },

    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen
    },

    closeAll() {
      this.notifPanelOpen = false
      this.aiAssistantOpen = false
      this.searchOpen = false
      this.mobileMenuOpen = false
    },

    /* =======================
       TOKEN
    ======================= */

    setNotifToken(token: string) {
      this.notifToken = token
    },

    /* =======================
       FETCH FIRST LOAD
    ======================= */

    async fetchNotifications() {
      try {
        this.notifLoading = true

        const config = useRuntimeConfig()

        const data = await useWeb<NotificationItem[]>(
          `${config.public.apiBase}/Notifications`,
          {
            headers: {
              Authorization: `Bearer ${this.notifToken}`
            }
          }
        )

        this.notifications = data
      } catch (e) {
        console.error('fetchNotifications', e)
      } finally {
        this.notifLoading = false
      }
    },

    /* =======================
       CLICK ITEM
    ======================= */

    async openNotification(item: NotificationItem) {
      this.markRead(item.Id)

      if (item.Href) {
        await navigateTo(item.Href)
      }
    },

    /* =======================
       READ
    ======================= */

    async markRead(id: number) {
      const row = this.notifications.find(
        x => x.Id === id
      )

      if (row) row.Read = true

      try {
        const config = useRuntimeConfig()

        await useWeb(
          `${config.public.apiBase}/Notifications/${id}/Read`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${this.notifToken}`
            }
          }
        )
      } catch (e) {
        console.error(e)
      }
    },

    async markAllRead() {
      this.notifications.forEach(
        n => (n.Read = true)
      )

      try {
        const config = useRuntimeConfig()

        await useWeb(
          `${config.public.apiBase}/Notifications/ReadAll`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${this.notifToken}`
            }
          }
        )
      } catch (e) {
        console.error(e)
      }
    },

    /* =======================
       REALTIME WEBSOCKET
    ======================= */

    connectRealtime() {
      if (!import.meta.client) return
      if (!this.notifToken) return
      if (this.notifSocket) return

      const config = useRuntimeConfig()

      const ws = new WebSocket(
        `${config.public.wsBase}/ws/notifications/?token=${this.notifToken}`
      )

      ws.onopen = () => {
        console.log('notification connected')
      }

      ws.onmessage = (event) => {
        const payload =
          JSON.parse(event.data)

        /*
        Expected Django payload:

        {
          "Id":99,
          "Type":"like",
          "Message":"Someone liked your artwork",
          "Read":false,
          "CreatedAt":"2026-04-29T12:00:00Z",
          "Href":"/gallery/abc"
        }
        */

        this.notifications.unshift(payload)
      }

      ws.onclose = () => {
        this.notifSocket = null

        /* auto reconnect */
        setTimeout(() => {
          this.connectRealtime()
        }, 5000)
      }

      ws.onerror = () => {
        ws.close()
      }

      this.notifSocket = ws
    },

    disconnectRealtime() {
      if (this.notifSocket) {
        this.notifSocket.close()
        this.notifSocket = null
      }
    },

    /* =======================
       POLLING FALLBACK
    ======================= */

    startPolling() {
      setInterval(() => {
        this.fetchNotifications()
      }, 30000)
    },

    /* =======================
       FULL INIT
    ======================= */

    async init(token: string) {
      this.setNotifToken(token)

      await this.fetchNotifications()

      this.connectRealtime()
    }
  }
})