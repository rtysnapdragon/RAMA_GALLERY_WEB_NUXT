export const useNavbarScroll = () => {
    const store = useNavbarStore()

    let lastY = 0

    const onScroll = () => {
        const y = window.scrollY

        store.scrolled = y > 50

        if (y > lastY && y > 80) {
            store.visible = false
        } else {
            store.visible = true
        }

        if (y <= 10) {
            store.visible = true
        }

        lastY = y
    }

    onMounted(() => {
        window.addEventListener('scroll', onScroll, { passive: true })
    })

    onUnmounted(() => {
        window.removeEventListener('scroll', onScroll)
    })
}