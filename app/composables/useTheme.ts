// composables/useTheme.ts
// Reusable dark/light theme toggle with SSR-safe persistence

export type Theme = 'light' | 'dark'

export const useTheme = () => {
  const colorMode = useState<Theme>('theme', () => 'light')

  const isDark = computed(() => colorMode.value === 'dark')

  const setTheme = (theme: Theme) => {
    colorMode.value = theme
    if (import.meta.client) {
      document.documentElement.classList.toggle('dark', theme === 'dark')
      localStorage.setItem('rama-theme', theme)
    }
  }

  const toggleTheme = () => {
    setTheme(isDark.value ? 'light' : 'dark')
  }

  const initTheme = () => {
    if (import.meta.client) {
      const saved = localStorage.getItem('rama-theme') as Theme | null
      const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      const theme = saved ?? preferred
      setTheme(theme)
    }
  }

  return { colorMode, isDark, setTheme, toggleTheme, initTheme }
}
