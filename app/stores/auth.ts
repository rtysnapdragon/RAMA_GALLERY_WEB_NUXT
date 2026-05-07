import { defineStore } from 'pinia'
import axios from 'axios'

export interface User {
  Id: number
  Email: string
  Username: string
  DisplayName: string
  Avatar: string | null
  Bio: string
  Role: 'visitor' | 'artist' | 'collector' | 'admin'
  IsVerified: boolean
  IsProfileComplete: boolean
  FollowingCount: number
  FollowersCount: number
}

interface LoginResponse {
  AccessToken: string
  RefreshToken?: string
  User: User
}


export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    refreshToken: null as string | null,
    isLoading: false,
    error: null as string | null,
    initialized: false,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token && !!state.user,
    isAdmin: (state) => state.user?.Role === 'admin',
    isArtist: (state) => state.user?.Role === 'artist' || state.user?.Role === 'admin',
    displayName: (state) => state.user?.DisplayName ?? state.user?.Username ?? 'Guest',
    avatar: (state) => state.user?.Avatar || '/images/default-avatar.png',
    email: (state) => state.user?.Email || '',
    role: (state) => state.user?.Role || 'visitor',
  },

  actions: {
    /* ------------------------------------------
     INIT FROM COOKIE
    ------------------------------------------ */
    initFromStorage() {
      if (!import.meta.client) return

      const access = useCookie<string | null>('rama_access_token')
      const refresh = useCookie<string | null>('rama_refresh_token')
      const userCookie = useCookie<any>('rama_user')

      this.token = access.value || null
      this.refreshToken = refresh.value || null

      if (userCookie.value) {
        try {
          this.user =
            typeof userCookie.value === 'string'
              ? JSON.parse(userCookie.value)
              : userCookie.value
        } catch {
          this.logout(false)
        }
      }

      this.initialized = true
    },
    /* ------------------------------------------
        SAVE SESSION
       ------------------------------------------ */
    saveSession(data: LoginResponse) {
      const access = useCookie('rama_access_token', {
        sameSite: 'lax',
        path: '/',
      })

      const refresh = useCookie('rama_refresh_token', {
        sameSite: 'lax',
        path: '/',
      })

      const userCookie = useCookie('rama_user', {
        sameSite: 'lax',
        path: '/',
      })

      access.value = data.AccessToken
      refresh.value = data.RefreshToken || null
      userCookie.value = JSON.stringify(data.User)

      this.token = data.AccessToken
      this.refreshToken = data.RefreshToken || null
      this.user = data.User
    },

    async register(payload: { Name: string, Email: string, Username: string, Password: string }) {
      this.isLoading = true
      this.error = null

      try {
        console.log("STEP 1: start register")

        const config = useRuntimeConfig()
        console.log("STEP 2: config", config.public.apiBase)

        console.log("STEP 3: sending request...")

        const { data } = await axios.post(
          `${config.public.apiBase}api/auth/register`,
          payload
        )

        this.saveSession(data)

        await navigateTo(localePath('/'))
        return true
      } catch (err: any) {
        console.error("REGISTER ERROR:", err)

        this.error =
          err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err.message ||
          'Registration failed'
        return false
      } finally {
        this.isLoading = false
      }
    },

    async login(payload: { UsernameOrEmail: string, Password: string }) {
      this.isLoading = true
      this.error = null

      try {
        const config = useRuntimeConfig()

        const { data } = await axios.post(
          `${config.public.apiBase}api/auth/login`,
          {
            Identifier: payload.UsernameOrEmail,
            Password: payload.Password,
          }
        )
        this.saveSession(data)

        await navigateTo(localePath('/'))
        return true
      } catch (err: any) {
        this.error =
          err?.response?.data?.detail ||
          err?.response?.data?.message ||
          'Login failed'
        return false
      } finally {
        this.isLoading = false
      }
    },

    /* ------------------------------------------
     LOGOUT
    ------------------------------------------ */
    async logout(redirect = true) {
      this.user = null
      this.token = null
      this.refreshToken = null

      useCookie('rama_access_token').value = null
      useCookie('rama_refresh_token').value = null
      useCookie('rama_user').value = null

      const notification = useNotificationStore()
      notification.reset()

      if (redirect && import.meta.client) {
        await navigateTo(localePath('/login'))
      }
    },


    async login1(email: string, password: string) {
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

    /* ------------------------------------------
     GOOGLE LOGIN
    ------------------------------------------ */
    loginWithGoogle() {
      const config = useRuntimeConfig()

      window.location.href =
        `${config.public.apiBase}/api/auth/google/login`
    },


    /* ------------------------------------------
     FETCH PROFILE
    ------------------------------------------ */
    async fetchMe() {
      if (!this.token) return

      try {
        const config = useRuntimeConfig()

        const { data } = await axios.get<User>(
          `${config.public.apiBase}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        )

        this.user = data

        const userCookie = useCookie('rama_user')
        userCookie.value = JSON.stringify(data)
      } catch {
        await this.logout(false)
      }
    },



    /* ------------------------------------------
     REFRESH TOKEN
    ------------------------------------------ */
    async refreshAccessToken() {
      if (!this.refreshToken) return false

      try {
        const config = useRuntimeConfig()

        const { data } = await axios.post(
          `${config.public.apiBase}/api/auth/refresh`,
          {
            RefreshToken: this.refreshToken,
          }
        )

        this.token = data.AccessToken
        useCookie('rama_access_token').value =
          data.AccessToken

        return true
      } catch {
        await this.logout(false)
        return false
      }
    },

    async register1(data: { email: string; password: string; username: string }) {
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

    logout1() {
      this.user = null
      this.token = null
      if (import.meta.client) {
        localStorage.removeItem('rama_token')
        localStorage.removeItem('rama_user')
      }
    },
  },
})


/*-------------
Also reset other stores:
useUIStore().closeAll()
useCartStore().reset()
useNotificationStore().reset()
----------------*/