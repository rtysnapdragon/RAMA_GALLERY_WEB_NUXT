import { defineStore } from 'pinia'

export type NavbarMode = 'transparent' | 'glass' | 'hidden'

export const useNavbarStore = defineStore('navbar', {
  state: () => ({
    // Visibility
    isVisible: true,
    isAtTop: true,
    hasSolidBg: false,

    // Scroll tracking
    lastScrollY: 0,
    scrollDirection: 'up' as 'up' | 'down',
    scrollVelocity: 0,

    // Mobile
    mobileOpen: false,
    drawerAnimating: false,

    // Active submenu (for future mega-menu support)
    activeSubmenu: null as string | null,

    // Search
    searchOpen: false,
    searchQuery: '',
  }),

  getters: {
    navbarMode: (state): NavbarMode => {
      if (!state.isVisible) return 'hidden'
      if (state.hasSolidBg) return 'glass'
      return 'transparent'
    },

    shouldBlur: (state) => state.hasSolidBg,
    shouldShowShadow: (state) => state.hasSolidBg && state.isVisible,
  },

  actions: {
    setScrollState(scrollY: number, prevScrollY: number) {
      this.lastScrollY = scrollY
      this.scrollDirection = scrollY > prevScrollY ? 'down' : 'up'
      this.scrollVelocity = Math.abs(scrollY - prevScrollY)

      // At top: always show transparent
      this.isAtTop = scrollY < 8

      // Solid background threshold
      this.hasSolidBg = scrollY > 50

      // Hide on scroll down (only after 120px to avoid jitter at top)
      if (scrollY > 120 && this.scrollDirection === 'down' && this.scrollVelocity > 4) {
        this.isVisible = false
      }

      // Show on scroll up
      if (this.scrollDirection === 'up') {
        this.isVisible = true
      }

      // Always visible at top
      if (scrollY < 8) {
        this.isVisible = true
      }
    },

    openMobile() {
      this.mobileOpen = true
      this.drawerAnimating = true
      if (import.meta.client) {
        document.body.style.overflow = 'hidden'
      }
      setTimeout(() => { this.drawerAnimating = false }, 400)
    },

    closeMobile() {
      this.drawerAnimating = true
      setTimeout(() => {
        this.mobileOpen = false
        this.drawerAnimating = false
        if (import.meta.client) {
          document.body.style.overflow = ''
        }
      }, 320)
    },

    toggleMobile() {
      this.mobileOpen ? this.closeMobile() : this.openMobile()
    },

    setActiveSubmenu(key: string | null) {
      this.activeSubmenu = key
    },

    openSearch() {
      this.searchOpen = true
      this.closeMobile()
    },

    closeSearch() {
      this.searchOpen = false
      this.searchQuery = ''
    },

    reset() {
      this.mobileOpen = false
      this.activeSubmenu = null
      this.searchOpen = false
      if (import.meta.client) {
        document.body.style.overflow = ''
      }
    },
  },
})
