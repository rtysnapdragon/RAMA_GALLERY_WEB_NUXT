
// plugins/pinia.client.ts — Hydrate stores from localStorage on app start
export default defineNuxtPlugin(() => {
    const auth = useAuthStore()
    const ui = useUIStore()
    auth.initFromStorage()
    ui.initTheme()
})