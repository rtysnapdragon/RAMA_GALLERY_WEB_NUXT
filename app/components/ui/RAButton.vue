<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading"
    :class="buttonClass"
    @click="handleClick"
  >
    <!-- loader -->
    <span v-if="loading" class="ra-spinner"></span>

    <!-- left icon -->
    <span v-if="icon && iconPosition === 'left'" class="ra-icon left">
      <i :class="icon" />
    </span>

    <!-- content -->
    <span class="ra-content whitespace-nowrap">
      <slot v-if="$slots.default" />
      <template v-else>{{ label }}</template>
    </span>

    <!-- right icon -->
    <span v-if="icon && iconPosition === 'right'" class="ra-icon right">
      <i :class="icon" />
    </span>
  </button>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'

const props = defineProps({
  label: { type: String, default: '' },

  variant: {
    type: String as PropType<
      'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
    >,
    default: 'primary'
  },

  size: {
    type: String as PropType<'sm' | 'md' | 'lg' | 'xl'>,
    default: 'md'
  },

  icon: { type: String, default: null },

  iconPosition: {
    type: String as PropType<'left' | 'right'>,
    default: 'left'
  },

  block: Boolean,
  loading: Boolean,
  disabled: Boolean,

  type: {
    type: String as PropType<'button' | 'submit' | 'reset'>,
    default: 'button'
  }
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClass = computed(() => [
  'ra-button',
  props.variant,
  props.size,
  {
    'is-block': props.block,
    'is-loading': props.loading,
    'is-disabled': props.disabled
  }
])

const handleClick = (e: MouseEvent) => {
  if (props.loading || props.disabled) return
  emit('click', e)
}
</script>

<style scoped lang="scss">
.ra-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  font-family: var(--font-sans);
  font-weight: 600;

  border-radius: 9999px;
  position: relative;
  cursor: pointer;

  transition: all 0.2s ease;
  user-select: none;

  /* prevent layout shift when loading */
  min-width: 80px;

  &.is-block {
    width: 100%;
  }

  /* sizes */
  &.sm { padding: 8px 14px; font-size: 13px; height: 36px; }
  &.md { padding: 12px 20px; font-size: 14px; height: 46px; }
  &.lg { padding: 14px 26px; font-size: 16px; height: 52px; }
  &.xl { padding: 16px 32px; font-size: 18px; height: 58px; }

  /* variants */
  &.primary {
    background: var(--color-gold);
    color: #111;
  }

  &.secondary {
    background: var(--bg-card);
    border: 1px solid var(--border);
  }

  &.outline {
    background: transparent;
    border: 2px solid var(--color-gold);
  }

  &.ghost {
    background: transparent;
  }

  &.danger {
    background: #ef4444;
    color: #fff;
  }

  /* states */
  &.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* loading overlay (no layout shift) */
  &.is-loading .ra-content,
  &.is-loading .ra-icon {
    opacity: 0;
  }

  .ra-spinner {
    position: absolute;
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .ra-icon {
    display: flex;
    align-items: center;
    font-size: 1.1em;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>