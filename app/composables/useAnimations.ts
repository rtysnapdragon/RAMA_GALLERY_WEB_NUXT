// composables/useAnimations.ts
// Reusable scroll-triggered reveal animations

export const useReveal = () => {
  const revealed = ref(false)
  let observer: IntersectionObserver | null = null

  const observe = (el: HTMLElement | null) => {
    if (!el || !import.meta.client) return
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          revealed.value = true
          observer?.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(el)
  }

  onUnmounted(() => observer?.disconnect())

  return { revealed, observe }
}

// Stagger delay helper
export const staggerDelay = (index: number, base = 80) => `${index * base}ms`
