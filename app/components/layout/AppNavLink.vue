<script setup lang="ts">
defineProps<{
  to: string
  label: string
}>()
</script>

<template>
  <NuxtLink
    :to="localePath(to)"
    class="nav-link"
  >
    {{ label }}
  </NuxtLink>
</template>

<style lang="scss" scoped>

.nav-link {
  color: var(--text);
  text-decoration: none;
  transition: 0.25s ease;

  &.router-link-active,
  &:hover {
    color: var(--primary);
  }
}
</style>