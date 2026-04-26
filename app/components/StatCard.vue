<script setup>
defineProps({
  title: String,
  value: String,
  icon: String
})
</script>

<template>
<div class="rounded-3xl border border-white/10 p-6 bg-white/5">
  <div class="text-3xl mb-4">{{ icon }}</div>
  <p class="opacity-70">{{ title }}</p>
  <h3 class="text-3xl font-bold mt-2">{{ value }}</h3>
</div>
</template>