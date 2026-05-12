<script setup lang="ts">
// components/common/RgButton.vue
// Reusable button component

interface Props {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: string
  iconRight?: boolean
  disabled?: boolean
  href?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  iconRight: false,
  disabled: false,
})

const tag = computed(() => props.href ? resolveComponent('NuxtLink') : 'button')
</script>

<template>
  <component
    :is="tag"
    :to="href"
    :disabled="disabled || loading"
    :class="['rg-btn', `rg-btn--${variant}`, `rg-btn--${size}`, { 'rg-btn--loading': loading }]"
    v-bind="$attrs"
  >
    <span v-if="icon && !iconRight" :class="['ri-' + icon, 'rg-btn__icon']" />
    <span v-if="loading" class="rg-btn__spinner">
      <i class="ri-loader-4-line" />
    </span>
    <span class="rg-btn__label">
      <slot />
    </span>
    <span v-if="icon && iconRight" :class="['ri-' + icon, 'rg-btn__icon']" />
  </component>
</template>

<style lang="scss" scoped>
.rg-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: $font-body;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all $duration-base $ease-expo;
  white-space: nowrap;
  position: relative;
  overflow: hidden;

  &--sm  { padding: 0.5rem 1.25rem; font-size: 0.7rem; }
  &--md  { padding: 0.75rem 2rem;   font-size: 0.75rem; }
  &--lg  { padding: 1rem 2.75rem;   font-size: 0.8rem; }

  // ── Primary ──
  &--primary {
    background: var(--gold);
    color: $color-ink;
    border-color: var(--gold);
    &:hover:not(:disabled) {
      background: transparent;
      color: var(--gold);
    }
  }

  // ── Outline ──
  &--outline {
    background: transparent;
    color: var(--text);
    border-color: var(--border);
    &:hover:not(:disabled) {
      border-color: var(--gold);
      color: var(--gold);
    }
  }

  // ── Ghost ──
  &--ghost {
    background: transparent;
    border-color: transparent;
    color: var(--text-muted);
    &:hover:not(:disabled) { color: var(--gold); }
  }

  &:disabled { opacity: 0.45; cursor: not-allowed; }

  &--loading .rg-btn__label { opacity: 0; }
  &__spinner {
    position: absolute;
    inset: 0;
    @include flex-center;
    i { animation: spin 0.7s linear infinite; }
  }
  &__icon { font-size: 1.1em; }
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>
