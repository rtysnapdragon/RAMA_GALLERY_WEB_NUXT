// export default defineNuxtRouteMiddleware(() => {
//     const auth = useAuthStore()

//     if (!auth.user) {
//         return navigateTo(localePath('/login'))
//     }
// })

// middleware/auth.ts — Redirect to login if not authenticated
export default defineNuxtRouteMiddleware((to) => {
    const auth = useAuthStore()
    // Re-hydrate from localStorage on each navigation
    if (import.meta.client && !auth.isLoggedIn) {
        auth.initFromStorage()
        console.log("auth.isLoggedIn", auth.isLoggedIn)
    }
    if (!auth.isLoggedIn) {
        console.log("auth.isLoggedIn", auth.isLoggedIn)
        return navigateTo(localePath(`/login?redirect=${encodeURIComponent(to.fullPath)}`))
    }
})