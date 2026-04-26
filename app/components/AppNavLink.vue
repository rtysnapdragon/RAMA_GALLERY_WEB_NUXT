<script setup lang="ts">
defineProps<{
  to: string
  label: string
}>()
</script>

<template>
  <NuxtLink
    :to="to"
    class="nav-link"
  >
    {{ label }}
  </NuxtLink>
</template>