import { defineStore } from 'pinia'

export interface User {
  id: number
  email: string
  username: string
  displayName: string
  avatar: string | null
  bio: string
  role: 'visitor' | 'artist' | 'collector' | 'admin'
  isVerified: boolean
  isProfileComplete: boolean
  followingCount: number
  followersCount: number
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    isLoading: false,
    error: null as string | null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token && !!state.user,
    isAdmin: (state) => state.user?.role === 'admin',
    isArtist: (state) => state.user?.role === 'artist' || state.user?.role === 'admin',
    displayName: (state) => state.user?.displayName ?? state.user?.username ?? 'Guest',
  },

  actions: {
    initFromStorage() {
      if (!import.meta.client) return
      const token = localStorage.getItem('rama_token')
      const userData = localStorage.getItem('rama_user')
      if (token && userData) {
        this.token = token
        try {
          this.user = JSON.parse(userData)
        } catch {
          this.logout()
        }
      }
    },

    async login(email: string, password: string) {
      this.isLoading = true
      this.error = null
      try {
        // Mock login for frontend-only mode
        await new Promise((r) => setTimeout(r, 800))
        const mockUser: User = {
          id: 1,
          email,
          username: email.split('@')[0],
          displayName: email.split('@')[0],
          avatar: `https://api.dicebear.com/7.x/personas/svg?seed=${email}`,
          bio: 'Art lover based in Phnom Penh.',
          role: 'artist',
          isVerified: true,
          isProfileComplete: true,
          followingCount: 12,
          followersCount: 340,
        }
        const mockToken = `mock_token_${Date.now()}`
        this.user = mockUser
        this.token = mockToken
        if (import.meta.client) {
          localStorage.setItem('rama_token', mockToken)
          localStorage.setItem('rama_user', JSON.stringify(mockUser))
        }
        return { success: true }
      } catch (e) {
        this.error = 'Login failed'
        return { success: false }
      } finally {
        this.isLoading = false
      }
    },

    async loginWithGoogle() {
      // In production: redirect to Django OAuth2 endpoint
      await this.login('artist@ramagallery.com', 'google')
    },

    async register(data: { email: string; password: string; username: string }) {
      this.isLoading = true
      this.error = null
      try {
        await new Promise((r) => setTimeout(r, 800))
        const mockUser: User = {
          id: Date.now(),
          email: data.email,
          username: data.username,
          displayName: data.username,
          avatar: `https://api.dicebear.com/7.x/personas/svg?seed=${data.username}`,
          bio: '',
          role: 'artist',
          isVerified: false,
          isProfileComplete: false,
          followingCount: 0,
          followersCount: 0,
        }
        const mockToken = `mock_token_${Date.now()}`
        this.user = mockUser
        this.token = mockToken
        if (import.meta.client) {
          localStorage.setItem('rama_token', mockToken)
          localStorage.setItem('rama_user', JSON.stringify(mockUser))
        }
        return { success: true, needsProfile: true }
      } catch (e) {
        this.error = 'Registration failed'
        return { success: false }
      } finally {
        this.isLoading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      if (import.meta.client) {
        localStorage.removeItem('rama_token')
        localStorage.removeItem('rama_user')
      }
    },
  },
})
