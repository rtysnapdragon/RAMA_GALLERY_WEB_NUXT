import { defineStore } from 'pinia'

export interface Notification {
  id: number
  type: 'like' | 'comment' | 'follow' | 'save' | 'system'
  message: string
  from?: string
  fromAvatar?: string
  artworkSlug?: string
  read: boolean
  createdAt: string
}

export const useUIStore = defineStore('ui', {
  state: () => ({
    isDark: false,
    notifPanelOpen: false,
    aiAssistantOpen: false,
    searchOpen: false,
    mobileMenuOpen: false,
    notifications: [
      {
        id: 1,
        type: 'like' as const,
        message: 'Sophea Khun liked your artwork "Mekong Memories"',
        fromAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=sophea',
        read: false,
        createdAt: '2025-06-15T10:23:00Z',
      },
      {
        id: 2,
        type: 'follow' as const,
        message: 'Dara Meng started following you',
        fromAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=dara',
        read: false,
        createdAt: '2025-06-15T09:11:00Z',
      },
      {
        id: 3,
        type: 'comment' as const,
        message: 'New comment on "Angkor at Dawn": "Breathtaking composition!"',
        fromAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=collector1',
        read: true,
        createdAt: '2025-06-14T16:45:00Z',
      },
      {
        id: 4,
        type: 'system' as const,
        message: 'Your artwork "Guardian Spirit" has been featured in the gallery.',
        read: true,
        createdAt: '2025-06-13T08:00:00Z',
      },
    ] as Notification[],
  }),

  getters: {
    unreadCount: (state) => state.notifications.filter((n) => !n.read).length,
  },

  actions: {
    initTheme() {
      if (!import.meta.client) return
      const saved = localStorage.getItem('rama_theme')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      this.isDark = saved ? saved === 'dark' : prefersDark
      this.applyTheme()
    },

    toggleTheme() {
      this.isDark = !this.isDark
      this.applyTheme()
      if (import.meta.client) {
        localStorage.setItem('rama_theme', this.isDark ? 'dark' : 'light')
      }
    },

    applyTheme() {
      if (!import.meta.client) return
      document.documentElement.classList.toggle('dark', this.isDark)
    },

    toggleNotifPanel() {
      this.notifPanelOpen = !this.notifPanelOpen
      if (this.notifPanelOpen) {
        this.aiAssistantOpen = false
        this.searchOpen = false
      }
    },

    toggleAIAssistant() {
      this.aiAssistantOpen = !this.aiAssistantOpen
      if (this.aiAssistantOpen) {
        this.notifPanelOpen = false
      }
    },

    toggleSearch() {
      this.searchOpen = !this.searchOpen
    },

    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen
    },

    markAllRead() {
      this.notifications.forEach((n) => (n.read = true))
    },

    markRead(id: number) {
      const n = this.notifications.find((n) => n.id === id)
      if (n) n.read = true
    },

    closeAll() {
      this.notifPanelOpen = false
      this.aiAssistantOpen = false
      this.searchOpen = false
      this.mobileMenuOpen = false
    },
  },
})
