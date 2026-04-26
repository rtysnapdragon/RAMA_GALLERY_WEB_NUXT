<template>
  <div class="events-page">
    <section class="page-hero">
      <div class="container">
        <p class="section-label animate-on-scroll">{{ tBy({ en: 'What\'s On', km: 'ព្រឹត្តិការណ៍' }) }}</p>
        <h1 class="page-title animate-on-scroll">{{ tBy({ en: 'Art Events', km: 'ព្រឹត្តិការណ៍សិល្បៈ' }) }}</h1>
        <p class="page-subtitle animate-on-scroll">{{ tBy({ en: 'Exhibitions, festivals, and gatherings celebrating Cambodian creativity', km: 'ការតាំងបង្ហាញ ពិធីបុណ្យ និងការជួបជុំ' }) }}</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <!-- Featured event -->
        <div class="featured-event animate-on-scroll" v-if="featuredEvent">
          <div class="featured-img">
            <RAImage :src="featuredEvent.image" aspect="wide" :watermark="false" />
            <div class="featured-category-tag">{{ featuredEvent.category }}</div>
          </div>
          <div class="featured-content">
            <p class="section-label">{{ tBy({ en: 'Featured Event', km: 'ព្រឹត្តិការណ៍ពិសេស' }) }}</p>
            <h2 class="featured-title">{{ featuredEvent.title }}</h2>
            <div class="event-meta-row">
              <div class="meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <span>{{ formatDate(featuredEvent.date) }}</span>
              </div>
              <div class="meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>{{ featuredEvent.location }}</span>
              </div>
            </div>
            <p class="featured-desc">{{ featuredEvent.description }}</p>
            <NuxtLink :to="`/events/${featuredEvent.slug}`" class="btn btn-primary">
              {{ tBy({ en: 'View Event', km: 'មើលព្រឹត្តិការណ៍' }) }}
            </NuxtLink>
          </div>
        </div>

        <!-- All events list -->
        <div class="events-divider">
          <p class="section-label">{{ tBy({ en: 'All Events', km: 'ព្រឹត្តិការណ៍ទាំងអស់' }) }}</p>
        </div>

        <div class="events-list">
          <NuxtLink
            v-for="(ev, i) in events"
            :key="ev.id"
            :to="`/events/${ev.slug}`"
            class="event-card card animate-on-scroll"
            :style="{ animationDelay: `${i * 0.1}s` }"
          >
            <div class="event-card-img">
              <RAImage :src="ev.image" aspect="landscape" :watermark="false" />
            </div>
            <div class="event-card-body">
              <span class="event-category-tag">{{ ev.category }}</span>
              <h3 class="event-title">{{ ev.title }}</h3>
              <div class="event-meta">
                <div class="meta-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <span>{{ formatDate(ev.date) }}</span>
                </div>
                <div class="meta-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span>{{ ev.location }}</span>
                </div>
              </div>
              <p class="event-desc">{{ ev.description }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import pagesData from '~/assets/json/pages.json'
useScrollAnimation()

const events = pagesData.events
const featuredEvent = computed(() => events.find(e => e.featured))

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
}

useSeoMeta({ title: 'Events — RamaGallery', description: 'Cambodian art events and exhibitions.' })
</script>

<style scoped lang="scss">
.page-hero { padding: 5rem 0 3rem; text-align: center; background: linear-gradient(to bottom, var(--color-bg-secondary), var(--color-bg)); border-bottom: 1px solid var(--color-border); }
.page-title { font-size: clamp(2rem, 5vw, 3.5rem); margin: 0.5rem 0; }
.page-subtitle { color: var(--color-text-secondary); max-width: 520px; margin: 0 auto; }

.featured-event {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 3rem;
  align-items: center;
  margin-bottom: 4rem;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;

  @media (max-width: 768px) { grid-template-columns: 1fr; }
}

.featured-img { position: relative; height: 100%; min-height: 280px; }
.featured-category-tag {
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.3rem 0.875rem;
  background: var(--color-gold);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border-radius: 2px;
  z-index: 5;
}

.featured-content {
  padding: 2rem 2rem 2rem 0;

  @media (max-width: 768px) { padding: 1.5rem; }
}

.featured-title { font-size: 1.8rem; margin: 0.5rem 0 1rem; line-height: 1.2; }
.event-meta-row { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; }
.meta-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--color-text-secondary); }
.featured-desc { color: var(--color-text-secondary); line-height: 1.7; margin-bottom: 1.5rem; font-size: 0.95rem; }

.events-divider { margin-bottom: 2rem; }
.events-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }

.event-card {
  display: block;
  text-decoration: none;
  overflow: hidden;
  transition: all var(--transition);

  &:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.12); }
}
.event-card-img { height: 200px; overflow: hidden; }
.event-card-body { padding: 1.25rem; }
.event-category-tag {
  display: inline-block;
  padding: 0.2rem 0.75rem;
  background: rgba(200, 149, 28, 0.1);
  color: var(--color-gold);
  border: 1px solid rgba(200, 149, 28, 0.2);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border-radius: 2px;
  margin-bottom: 0.75rem;
}
.event-title { font-family: var(--font-display); font-size: 1.2rem; color: var(--color-text-primary); margin-bottom: 0.75rem; }
.event-meta { display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 0.875rem; }
.event-desc { font-size: 0.85rem; color: var(--color-text-secondary); line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>
