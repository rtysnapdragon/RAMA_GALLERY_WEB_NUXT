export default defineNuxtRouteMiddleware(async () => {
    const auth = useAuthStore()

    if (!auth.initialized) {
        await auth.init()
    }

    if (auth.user) {
        return navigateTo('/dashboard')
    }
})