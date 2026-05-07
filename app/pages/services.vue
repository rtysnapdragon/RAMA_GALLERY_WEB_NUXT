<template>
  <div class="services-page">
    <section class="page-hero">
      <div class="container">
        <p class="section-label animate-on-scroll">{{ tBy({ en: 'What We Offer', km: 'អ្វីដែលយើងផ្តល់' }) }}</p>
        <h1 class="page-title animate-on-scroll">{{ tBy({ en: 'Services for Artists', km: 'សេវាកម្មសម្រាប់វិចិត្រករ' }) }}</h1>
        <p class="page-subtitle animate-on-scroll">{{ tBy({ en: 'Everything an artist needs to share, protect, and monetise their work in Cambodia and beyond', km: 'អ្វីៗទាំងអស់ដែលវិចិត្រករត្រូវការ' }) }}</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="services-grid">
          <div
            v-for="(svc, i) in services"
            :key="svc.id"
            class="service-card card animate-on-scroll"
            :style="{ animationDelay: `${i * 0.08}s` }"
          >
            <div class="service-icon">{{ svc.icon }}</div>
            <h3 class="service-title">{{ tBy(svc.title) }}</h3>
            <p class="service-desc">{{ tBy(svc.description) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing teaser -->
    <section class="section pricing-section">
      <div class="container">
        <div class="section-head animate-on-scroll" style="text-align:center">
          <p class="section-label">{{ tBy({ en: 'Plans', km: 'គំរោង' }) }}</p>
          <h2 class="section-title">{{ tBy({ en: 'Simple Pricing', km: 'តម្លៃ​សាមញ្ញ' }) }}</h2>
        </div>
        <div class="plans-grid">
          <div v-for="plan in plans" :key="plan.name" class="plan-card card animate-on-scroll" :class="{ popular: plan.popular }">
            <div v-if="plan.popular" class="popular-badge">{{ tBy({ en: 'Most Popular', km: 'ពេញនិយមបំផុត' }) }}</div>
            <h3 class="plan-name">{{ plan.name }}</h3>
            <div class="plan-price">
              <span class="price-amount">{{ plan.price }}</span>
              <span class="price-period">/ {{ plan.period }}</span>
            </div>
            <ul class="plan-features">
              <li v-for="f in plan.features" :key="f">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                {{ f }}
              </li>
            </ul>
            <NuxtLink :to="plan.popular ? '/register' : '/register'" class="btn" :class="plan.popular ? 'btn-primary' : 'btn-outline'" style="width:100%;justify-content:center">
              {{ tBy({ en: 'Get Started', km: 'ចាប់ផ្តើម' }) }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import pagesData from '~/assets/json/pages.json'
useScrollAnimation()

const services = pagesData.services

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    popular: false,
    features: ['5 artwork uploads', 'Basic profile', 'Gallery listing', 'Community access'],
  },
  {
    name: 'Artist',
    price: '$12',
    period: 'month',
    popular: true,
    features: ['Unlimited artworks', 'Custom domain', 'AI Studio (50 credits/mo)', 'Advanced analytics', 'Image protection', 'Priority support'],
  },
  {
    name: 'Studio',
    price: '$39',
    period: 'month',
    popular: false,
    features: ['Everything in Artist', 'AI Studio (unlimited)', 'Team members (3)', 'Exhibition features', 'White-label options', 'Dedicated curator'],
  },
]
usePageSeo(
  'Services — RamaGallery',
  'Artist branding, AI tools, portfolio design.'
)
</script>

<style scoped lang="scss">
.page-hero { padding: 5rem 0 3rem; text-align: center; background: linear-gradient(to bottom, var(--color-bg-secondary), var(--color-bg)); border-bottom: 1px solid var(--color-border); }
.page-title { font-size: clamp(2rem, 5vw, 3.5rem); margin: 0.5rem 0; }
.page-subtitle { color: var(--color-text-secondary); max-width: 560px; margin: 0 auto; }

.services-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
.service-card { padding: 2rem; transition: all var(--transition); &:hover { transform: translateY(-4px); border-color: var(--color-gold); } }
.service-icon { font-size: 2.5rem; margin-bottom: 1.25rem; }
.service-title { font-family: var(--font-display); font-size: 1.3rem; color: var(--color-text-primary); margin-bottom: 0.75rem; }
.service-desc { font-size: 0.9rem; color: var(--color-text-secondary); line-height: 1.7; }

.pricing-section { background: var(--color-bg-secondary); }
.section-head { margin-bottom: 3rem; }
.section-title { font-size: 2.5rem; margin-top: 0.5rem; }

.plans-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; @media (max-width: 800px) { grid-template-columns: 1fr; } }

.plan-card {
  padding: 2rem;
  position: relative;

  &.popular {
    border-color: var(--color-gold);
    background: var(--color-bg-card);
    box-shadow: 0 8px 32px rgba(200, 149, 28, 0.15);
    transform: scale(1.03);

    @media (max-width: 800px) { transform: none; }
  }
}

.popular-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-gold);
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.3rem 1rem;
  border-radius: 20px;
  white-space: nowrap;
}

.plan-name { font-family: var(--font-display); font-size: 1.3rem; color: var(--color-text-primary); margin-bottom: 1rem; }
.plan-price { display: flex; align-items: baseline; gap: 0.25rem; margin-bottom: 1.5rem; }
.price-amount { font-family: var(--font-display); font-size: 2.5rem; color: var(--color-text-primary); }
.price-period { font-size: 0.85rem; color: var(--color-text-muted); }

.plan-features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;

  li {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }
}
</style>
