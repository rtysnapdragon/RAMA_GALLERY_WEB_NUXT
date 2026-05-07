<template>
  <Transition name="scroll-btn">
    <button
      v-if="show"
      class="scroll-top-btn"
      :class="{ down: atBottom }"
      :aria-label="atBottom ? 'Scroll to top' : 'Scroll up'"
      :data-tooltip="atBottom ? 'Back to top' : 'Scroll up'"
      @click="handleClick"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline :points="atBottom ? '18 15 12 9 6 15' : '18 15 12 9 6 15'" />
      </svg>
    </button>
  </Transition>
</template>

<script setup lang="ts">
const show = ref(false)
const atBottom = ref(false)

onMounted(() => {
  const onScroll = () => {
    const scrollY = window.scrollY
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    show.value = scrollY > 200
    atBottom.value = scrollY > maxScroll - 100
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', onScroll))
})

const handleClick = () => {
  window.scrollTo({ top: atBottom.value ? 0 : Math.max(0, window.scrollY - window.innerHeight), behavior: 'smooth' })
}
</script>

<style scoped lang="scss">
.scroll-top-btn {
  position: fixed;
  top: calc(var(--header-height) + 16px);
  right: 1.5rem;
  z-index: 90;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  color: var(--color-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition);

  &:hover {
    color: var(--color-gold);
    border-color: var(--color-gold);
    transform: translateY(-2px);
  }

  &.down svg {
    transform: rotate(180deg);
  }
}

.scroll-btn-enter-active,
.scroll-btn-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.scroll-btn-enter-from,
.scroll-btn-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
