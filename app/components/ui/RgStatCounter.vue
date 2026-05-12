<script setup lang="ts">
// components/common/RgStatCounter.vue
interface Props {
  value: string | number
  label: string
}
defineProps<Props>()
</script>

<template>
  <div class="rg-stat">
    <span class="rg-stat__value">{{ value }}</span>
    <span class="rg-stat__label">{{ label }}</span>
  </div>
</template>

<style lang="scss" scoped>
.rg-stat {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;

  &__value {
    font-family: $font-display;
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 300;
    line-height: 1;
    color: var(--gold);
  }

  &__label {
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-muted);
  }
}
</style>
