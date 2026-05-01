/* plugins/notifications.client.ts */

export default defineNuxtPlugin(async () => {
    const auth = useAuthStore()
    const notification = useNotificationStore()

    /* ------------------------------------------
    wait auth restore from cookie
    ------------------------------------------ */
    auth.initFromStorage()

    /* ------------------------------------------
    if logged in => start notification sync
    ------------------------------------------ */
    if (auth.token) {
        await notification.init(auth.token)
    }

    /* ------------------------------------------
    global auto detect login/logout token changes
    ------------------------------------------ */
    watch(
        () => auth.token,
        async (token, oldToken) => {
            /* login / refresh token */
            if (token && token !== oldToken) {
                await notification.init(token)
                return
            }

            /* logout */
            if (!token) {
                notification.reset()
            }
        },
        {
            immediate: true
        }
    )

    /* ------------------------------------------
    tab focus = refresh latest notifications
    ------------------------------------------ */
    window.addEventListener('focus', () => {
        if (auth.token) {
            notification.fetchNotifications()
        }
    })

    /* ------------------------------------------
    internet back online = reconnect
    ------------------------------------------ */
    window.addEventListener('online', () => {
        if (auth.token) {
            notification.connectRealtime()
            notification.fetchNotifications()
        }
    })

    /* ------------------------------------------
    page leave cleanup
    ------------------------------------------ */
    window.addEventListener('beforeunload', () => {
        notification.cleanup()
    })
})