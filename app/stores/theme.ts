import { defineStore } from 'pinia'

type ThemeMode = 'light' | 'dark' | 'system'

export const useThemeStore = defineStore('theme', {
    state: () => ({
        mode: 'system' as ThemeMode,
        isDark: false,
    }),

    getters: {
        current(state): ThemeMode {
            return state.mode
        },
    },

    actions: {
        init() {
            if (!import.meta.client) return

            const saved = localStorage.getItem('rama_theme') as ThemeMode | null

            if (saved) {
                this.mode = saved
            }

            this.apply()
        },

        set(mode: ThemeMode) {
            this.mode = mode

            if (import.meta.client) {
                localStorage.setItem('rama_theme', mode)
            }

            this.apply()
        },

        toggle() {
            // optional quick toggle (light <-> dark)
            this.set(this.isDark ? 'light' : 'dark')
        },

        apply() {
            if (!import.meta.client) return

            const root = document.documentElement

            const systemDark = window.matchMedia(
                '(prefers-color-scheme: dark)'
            ).matches

            this.isDark =
                this.mode === 'dark' ||
                (this.mode === 'system' && systemDark)

            root.classList.toggle('dark', this.isDark)
        },
    },
})