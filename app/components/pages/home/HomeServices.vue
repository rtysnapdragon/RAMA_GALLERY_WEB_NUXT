<template>
  <section class="section-wrap services-section">
    <div class="container">
      <div class="section-header text-center">
        <h2 class="section-title">{{ $t('services') }}</h2>
        <p class="section-subtitle">Everything you need to succeed as a modern artist</p>
      </div>

      <div class="services-grid">
        <div 
          v-for="service in services" 
          :key="service.id"
          class="service-card"
        >
          <div class="service-icon">{{ service.icon }}</div>
          <h3 class="service-title">{{ tBy(service.title) }}</h3>
          <p class="service-desc">{{ tBy(service.description) }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useLocalData } from '~/composables/useLocalData'

defineProps<{
  services: any[]
}>()

const { tBy } = useLocalData()
</script>

<style lang="scss" scoped>
.services-section {
  padding: 6rem 0;
  position: relative;
}

.text-center {
  text-align: center;
  align-items: center;
  flex-direction: column;
}

.section-header {
  margin-bottom: 4rem;
}

.section-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 2.5rem);
  color: var(--color-text-primary);
  margin-bottom: 1rem;
}

.section-subtitle {
  color: var(--color-text-secondary);
  font-size: 1.125rem;
  max-width: 600px;
  margin: 0 auto;
}

.services-grid {
  display: grid;
  // grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  //   grid-template-columns: repeat(
  //   auto-fit,
  //   minmax(calc(180px - 0.5rem), 1fr)
  // );

    grid-template-columns: repeat(
    auto-fit,
    minmax(clamp(140px, 20vw, 200px), 1fr)
  );

  //   grid-template-columns: repeat(
  //   auto-fit,
  //   minmax(calc(100% / 5 - 1rem), 1fr)
  // );
  gap: 1rem;
}

.service-card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 14px;

  padding: 1rem;

  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  transition: 0.2s;
  // &:hover {
  //   transform: translateY(-5px);
  //   border-color: var(--color-gold);
  // }
}

.service-card:hover {
  transform: translateY(-3px);
  border-color: var(--color-gold);
}

.service-icon {
  font-size: 1.4rem;

  width: 40px;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 10px;

  background: rgba(200, 149, 28, 0.1);
  border: 1px solid rgba(200, 149, 28, 0.2);
}

.service-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 1rem;
}

.service-desc {
  font-size: 0.75rem;
  opacity: 0.7;
  line-height: 1.4;

  /* 🔥 prevent long text breaking layout */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

// @media (max-width: 768px) {
//   .services-grid {
//     grid-template-columns: 1fr;
//     gap: 1.5rem;
//   }

//   .service-card {
//     padding: 1.5rem;
//     border-radius: 16px;
//   }

//   .service-icon {
//     width: 48px;
//     height: 48px;
//     font-size: 2rem;
//     margin-bottom: 1rem;
//     border-radius: 12px;
//   }

//   .service-title {
//     font-size: 1.125rem;
//   }
// }
</style>
