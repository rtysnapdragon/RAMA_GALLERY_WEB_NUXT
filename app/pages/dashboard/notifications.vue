<template>
  <section class="page">
    <h1 class="title">Notifications</h1>

    <div class="list">
      <div v-for="i in 6" :key="i" class="card">
        <div class="card__content">
          <p class="card__title">
            New like on Artwork {{ i }}
          </p>

          <p class="card__meta">
            Just now
          </p>
        </div>
      </div>
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

/* list spacing */
.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* notification card */
.card {
  padding: 16px 18px;
  border-radius: 14px;

  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);

  backdrop-filter: blur(12px);

  transition: 0.25s ease;

  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(99, 102, 241, 0.4);
    background: rgba(255, 255, 255, 0.06);
  }

  &__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__title {
    font-size: 14px;
    font-weight: 500;
    color: #fff;
  }

  &__meta {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
  }
}
</style>