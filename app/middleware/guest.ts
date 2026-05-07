// export default defineNuxtRouteMiddleware(async () => {
//     const auth = useAuthStore()

//     if (!auth.initialized) {
//         await auth.init()
//     }

//     if (auth.user) {
//         return navigateTo(localePath('/dashboard'))
//     }
// })

// middleware/guest.ts — Redirect authenticated users away from auth pages
export default defineNuxtRouteMiddleware(() => {
    const auth = useAuthStore()
    if (import.meta.client && !auth.isLoggedIn) {
        auth.initFromStorage()
    }
    console.log("auth.isLoggedIn", auth.isLoggedIn)
    if (auth.isLoggedIn) {
        return navigateTo(localePath('/'))
    }
})