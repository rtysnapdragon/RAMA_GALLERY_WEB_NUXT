export const useThemeStore = defineStore('theme', () => {
    const mode = ref<'light' | 'dark'>('dark')

    const toggle = () => {
        mode.value = mode.value === 'dark' ? 'light' : 'dark'
        localStorage.setItem('theme', mode.value)
        document.documentElement.classList.toggle('dark', mode.value === 'dark')
    }

    const init = () => {
        const saved = localStorage.getItem('theme')
        if (saved) mode.value = saved as any
        document.documentElement.classList.toggle('dark', mode.value === 'dark')
    }

    return { mode, toggle, init }
})