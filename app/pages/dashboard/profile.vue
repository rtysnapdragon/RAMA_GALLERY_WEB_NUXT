<template>
  <section class="page">
    <h1 class="title">Profile</h1>

    <div class="card">
      Profile Settings Here
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})
</script>
<style lang="scss" scoped>
.page {
  padding: 32px;
  color: #fff;
}

.title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 24px;
}

/* Premium dark card */
.card {
  max-width: 720px;
  padding: 24px;

  border-radius: 16px;

  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);

  backdrop-filter: blur(12px);

  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);

  transition: 0.3s ease;

  &:hover {
    border-color: rgba(99, 102, 241, 0.4);
    transform: translateY(-2px);
  }
}
</style>