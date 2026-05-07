<template>
  <section class="section-wrap testimonials-section">
    <div class="container">
      <div class="section-header text-center">
        <h2 class="section-title">{{ $t('testimonial_title') }}</h2>
      </div>

      <div class="testimonials-grid">
        <div 
          v-for="item in testimonials" 
          :key="item.id"
          class="testimonial-card"
        >
          <div class="quote-icon"><i class="ri-double-quotes-l"></i></div>
          <p class="testimonial-quote">"{{ tBy(item.quote) }}"</p>
          
          <div class="testimonial-author">
            <img :src="item.avatar" :alt="item.name" class="author-avatar" loading="lazy" />
            <div class="author-info">
              <h4 class="author-name">{{ item.name }}</h4>
              <p class="author-role">{{ tBy(item.role) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useLocalData } from '~/composables/useLocalData'

defineProps<{
  testimonials: any[]
}>()

const { tBy } = useLocalData()
</script>

<style lang="scss" scoped>
.testimonials-section {
  padding: 6rem 0;
  background: var(--color-bg-secondary);
  border-top: 1px solid var(--color-border);
}

.text-center {
  text-align: center;
}

.section-header {
  margin-bottom: 4rem;
}

.section-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 2.5rem);
  color: var(--color-text-primary);
}

// .testimonials-grid {
//   display: grid;
//   grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
//   gap: 2rem;
// }

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(calc(25% - 1.5rem), 1fr)
  );
  gap: 2rem;
}

.testimonial-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
}

.quote-icon {
  font-size: 2rem;
  color: var(--color-gold);
  opacity: 0.5;
  margin-bottom: 1rem;
}
.testimonial-quote {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

// .testimonial-quote {
//   font-size: 1.125rem;
//   line-height: 1.6;
//   color: var(--color-text-primary);
//   flex: 1;
//   font-style: italic;
//   margin-bottom: 2rem;
// }

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 1rem;
  border-top: 1px solid var(--color-border);
  padding-top: 1.5rem;
}

.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  background: var(--color-bg-secondary);
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 700;
  color: var(--color-text-primary);
  font-size: 1rem;
}

.author-role {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .testimonials-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .testimonial-card {
    padding: 1.5rem;
    border-radius: 16px;
  }

  .quote-icon {
    font-size: 1.5rem;
    margin-bottom: 0.75rem;
  }

  .testimonial-quote {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
}
@media (max-width: 1200px) {
  .testimonials-grid {
    grid-template-columns: repeat(
      auto-fill,
      minmax(calc(33.333% - 1.5rem), 1fr)
    );
  }
}

@media (max-width: 768px) {
  .testimonials-grid {
    grid-template-columns: repeat(
      auto-fill,
      minmax(calc(50% - 1rem), 1fr)
    );
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .testimonials-grid {
    grid-template-columns: 1fr;
  }
}
</style>
