<template>
  <div class="base-card">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.base-card {
  background: var(--card-bg);

  border-radius: 16px;

  padding: 20px;

  box-shadow: 0 4px 20px rgba(0,0,0,.08);
}
</style>