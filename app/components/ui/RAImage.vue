<template>
  <div
    class="ra-image-wrapper"
    :style="{ aspectRatio: ratio }"
    @contextmenu.prevent
    @dragstart.prevent
    @selectstart.prevent
  >
    <!-- Skeleton -->
    <div v-if="!loaded" class="ra-placeholder skeleton" />

    <img
      :src="finalSrc"
      :alt="alt"
      :class="['ra-img', { loaded, cover }]"
      loading="lazy"
      draggable="false"
      @load="onLoad"
      @error="onError"
    />

    <!-- Protect -->
    <div class="protect-overlay" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  src?: string | null
  alt?: string
  ratio?: string
  cover?: boolean
  fallback?: string
}>()

const loaded = ref(false)
const hasError = ref(false)

/* --------------------------
DEFAULT FALLBACK
-------------------------- */
const defaultFallback = '/user_image_default.png'

/* --------------------------
FINAL SRC (safe)
-------------------------- */
const finalSrc = computed(() => {
  if (!props.src) return props.fallback || defaultFallback
  if (hasError.value) return props.fallback || defaultFallback
  return props.src
})

/* --------------------------
ERROR HANDLER
-------------------------- */
const onError = () => {
  if (!hasError.value) {
    hasError.value = true
    loaded.value = false
  }
}

/* --------------------------
LOAD HANDLER
-------------------------- */
const onLoad = () => {
  loaded.value = true
}

/* --------------------------
BLOCK SAVE SHORTCUT
-------------------------- */
onMounted(() => {
  const handler = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && ['s', 'u'].includes(e.key.toLowerCase())) {
      e.preventDefault()
    }
  }

  window.addEventListener('keydown', handler)
  onUnmounted(() => window.removeEventListener('keydown', handler))
})
</script>

<style scoped lang="scss">
.ra-image-wrapper {
  position: relative;
  overflow: hidden;
  display: block;
  width: 100%;
  background: var(--color-bg-secondary);
}

.ra-placeholder {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.ra-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;

  &.cover { object-fit: cover; }
  &.loaded { opacity: 1; }
}

.protect-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background: transparent;
}

// Watermark via pseudo
.ra-image-wrapper::after {
  content: 'RamaGallery';
  position: absolute;
  bottom: 10px;
  right: 12px;
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
  text-shadow: 0 1px 3px rgba(0,0,0,0.6);
  pointer-events: none;
  z-index: 3;
  font-family: var(--font-sans);
}
</style>
