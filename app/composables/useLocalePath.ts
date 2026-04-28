// composables/useLocalePath.ts
// Overrides default usage style:
// const localePath = useLocalePath()

export const useLocalePath = () => {
    const nuxtLocalePath = useNuxtApp().$localePath
    const { locale, defaultLocale } = useI18n()

    const COOKIE_KEY = 'i18n_redirected'
    const LOCAL_KEY = 'i18n_redirected'
    console.log(" Cookie key --------> ", COOKIE_KEY)
    console.log(" Locale key --------> ", LOCAL_KEY)

    const getCookie = (name: string): string | null => {
        if (!import.meta.client) return null

        const match = document.cookie.match(
            new RegExp('(^| )' + name + '=([^;]+)')
        )

        return match ? decodeURIComponent(match[2]) : null
    }

    const getSavedLocale = () => {
        if (!import.meta.client) {
            return locale.value || defaultLocale
        }

        return (
            getCookie(COOKIE_KEY) ||
            localStorage.getItem(LOCAL_KEY) ||
            locale.value ||
            defaultLocale
        )
    }

    return (
        path: string = '/',
        forcedLocale?: string
    ) => {
        const targetLocale =
            forcedLocale || getSavedLocale()

        return nuxtLocalePath(path, targetLocale)
    }
}