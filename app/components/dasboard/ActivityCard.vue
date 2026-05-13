<script setup lang="ts">
defineProps<{
  items: any[]
}>()
</script>

<template>
  <BaseCard>

    <div
      v-for="item in items"
      :key="item.MESSAGE"
      class="activity-item"
    >
      {{ item.MESSAGE }}
    </div>

  </BaseCard>
</template>