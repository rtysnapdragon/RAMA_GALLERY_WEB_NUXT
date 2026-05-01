<template>
  <Transition name="viewer">
    <div
      v-if="modelValue"
      class="viewer"
      @click.self="close"
    >
      <!-- CLOSE -->
      <button class="viewer__close" @click="close">
        <i class="ri-close-line"></i>
      </button>

      <!-- CONTENT -->
      <div class="viewer__body">
        <slot name="content">
          <img v-if="src" :src="src" class="viewer__media" />
        </slot>
      </div>

      <!-- FOOTER -->
      <div v-if="$slots.footer" class="viewer__footer">
        <slot name="footer" />
      </div>

      <!-- HINT -->
      <div v-if="showHint" class="viewer__hint">
        ESC / click outside to close
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  modelValue: boolean
  src?: string
  showHint?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'close'): void
}>()

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

/* ESC support */
const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.modelValue) close()
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped lang="scss">
.viewer {
  position: fixed;
  inset: 0;
  z-index: 9999;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  background: rgba(0,0,0,.92);
  backdrop-filter: blur(16px);
}

/* CLOSE */
.viewer__close {
  position: absolute;
  top: 20px;
  right: 20px;

  width: 44px;
  height: 44px;

  border-radius: 12px;
  background: rgba(255,255,255,.08);
  color: white;

  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;
}

/* CONTENT */
.viewer__body {
  max-width: 92vw;
  max-height: 80vh;

  display: flex;
  justify-content: center;
  align-items: center;
}

.viewer__media {
  max-width: 100%;
  max-height: 100%;
  border-radius: 14px;
}

/* FOOTER */
.viewer__footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;

  padding: 20px;
}

/* HINT */
.viewer__hint {
  position: absolute;
  bottom: 12px;
  opacity: .4;
  font-size: 11px;
  color: white;
  letter-spacing: 2px;
}

/* TRANSITION */
.viewer-enter-active,
.viewer-leave-active {
  transition: opacity .25s ease;
}

.viewer-enter-from,
.viewer-leave-to {
  opacity: 0;
} 
</style>