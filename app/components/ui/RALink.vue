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
    :class="{ 'router-link-active': $route.path === localePath(to), 'router-link-exact-active': $route.path === localePath(to) }"
  >
    <slot name="label"></slot>
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