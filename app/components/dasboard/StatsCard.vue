<script setup lang="ts">
defineProps<{
  title: string
  value: number | string
}>()
</script>

<template>
  <BaseCard>
    <div class="stats-card">

      <h4>{{ title }}</h4>

      <h2>{{ value }}</h2>

    </div>
  </BaseCard>
</template>