/**
 * useScrollAnimation — IntersectionObserver for animate-on-scroll elements
 */

export function useScrollAnimation() {
  const observe = () => {
    if (!import.meta.client) return

    const els = document.querySelectorAll('.animate-on-scroll')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    els.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }

  onMounted(observe)
}
