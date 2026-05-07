// composables/useScroll.ts

export const useScroll = () => {
    const x = useState<number>('scroll-x', () => 0)
    const y = useState<number>('scroll-y', () => 0)
    const lastY = useState<number>('scroll-last-y', () => 0)

    const direction = useState<'up' | 'down'>('scroll-direction', () => 'up')


    /* navbar visible state */
    const visible = useState<boolean>('scroll-visible', () => true)

    /* avoid flicker on tiny moves */
    const threshold = 12

    let ticking = false

    const isTop = computed(() => y.value <= 20)
    const isDown = computed(() => direction.value === 'down')
    const isUp = computed(() => direction.value === 'up')

    const update = () => {
        if (!import.meta.client) return

        const currentY = window.scrollY || window.pageYOffset
        const currentX = window.scrollX || window.pageXOffset

        x.value = currentX
        y.value = currentY

        const diff = currentY - lastY.value

        /* always show near top */
        if (currentY <= 20) {
            visible.value = true
            direction.value = 'up'
            lastY.value = currentY
            ticking = false
            return
        }

        /* scroll down = hide */
        if (diff > threshold) {
            direction.value = 'down'
            visible.value = false
            lastY.value = currentY
        }

        /* scroll up = show */
        else if (diff < -threshold) {
            direction.value = 'up'
            visible.value = true
            lastY.value = currentY
        }

        ticking = false
    }

    const onScroll = () => {
        if (!ticking) {
            requestAnimationFrame(update)
            ticking = true
        }
    }

    const scrollToTop = (smooth = true) => {
        if (!import.meta.client) return

        window.scrollTo({
            top: 0,
            behavior: smooth ? 'smooth' : 'auto'
        })
    }

    onMounted(() => {
        if (!import.meta.client) return
        update()
        window.addEventListener('scroll', onScroll, { passive: true })
    })

    onUnmounted(() => {
        if (!import.meta.client) return
        window.removeEventListener('scroll', onScroll)
    })

    return {
        x,
        y,
        lastY,
        direction,
        visible,
        isTop,
        isUp,
        isDown,
        scrollToTop
    }
}