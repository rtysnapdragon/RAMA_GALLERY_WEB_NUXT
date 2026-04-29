<template>
  <div class="artists-page">
    <section class="page-hero">
      <div class="container">
        <p class="section-label animate-on-scroll">{{ tBy({ en: 'Creators', km: 'អ្នកបង្កើត' }) }}</p>
        <h1 class="page-title animate-on-scroll">{{ tBy({ en: 'Meet the Artists', km: 'ជួបជាមួយវិចិត្រករ' }) }}</h1>
        <p class="page-subtitle animate-on-scroll">{{ tBy({ en: 'Cambodia\'s most talented creators sharing their vision with the world', km: 'វិចិត្រករដ៏有才能បំផុតរបស់កម្ពុជា' }) }}</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <!-- Search bar -->
        <div class="search-bar animate-on-scroll">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/></svg>
          <input v-model="searchQuery" type="text" class="search-input" :placeholder="tBy({ en: 'Search artists…', km: 'ស្វែងរកវិចិត្រករ…' })" />
        </div>

        <!-- Grid -->
        <div class="artists-grid">
          <NuxtLink
            v-for="(artist, i) in filteredArtists"
            :key="artist.id"
            :to="`/artist/${artist.slug}`"
            class="artist-card card animate-on-scroll"
            :style="{ animationDelay: `${i * 0.06}s` }"
          >
            <div class="artist-cover">
              <RAImage :src="artist.cover" aspect="wide" :watermark="false" />
            </div>
            <div class="artist-body">
              <div class="artist-avatar-wrap">
                <img :src="artist.avatar" :alt="artist.name" class="artist-avatar" />
                <div v-if="artist.verified" class="verified-dot" />
              </div>
              <h3 class="artist-name">{{ artist.name }}</h3>
              <p class="artist-specialty">{{ artist.specialty }}</p>
              <p class="artist-location">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {{ artist.location }}
              </p>
              <div class="artist-stats">
                <span>{{ artist.artworks_count }} {{ tBy({ en: 'works', km: 'ស្នាដៃ' }) }}</span>
                <span>{{ formatCount(artist.followers) }} {{ t('artist.followers') }}</span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <div v-if="filteredArtists.length === 0" class="empty-state">
          <p>{{ tBy({ en: 'No artists found', km: 'រកមិនឃើញវិចិត្រករ' }) }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import pagesData from '~/assets/json/pages.json'
const { t } = useI18n()
useScrollAnimation()

const searchQuery = ref('')

const filteredArtists = computed(() =>
  pagesData.artists.filter(a =>
    a.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    a.specialty.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)

const formatCount = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n

useSeoMeta({ title: 'Artists — RamaGallery', description: 'Discover Cambodia\'s finest artists.' })
</script>

<style scoped lang="scss">
.page-hero {
  padding: 5rem 0 3rem;
  text-align: center;
  background: linear-gradient(to bottom, var(--color-bg-secondary), var(--color-bg));
  border-bottom: 1px solid var(--color-border);
}
.page-title { font-size: clamp(2rem, 5vw, 3.5rem); margin: 0.5rem 0; }
.page-subtitle { color: var(--color-text-secondary); max-width: 500px; margin: 0 auto; }
.search-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  max-width: 480px;
  margin: 0 auto 3rem;
  padding: 0.875rem 1.25rem;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: var(--color-text-muted);

  &:focus-within {
    border-color: var(--color-gold);
  }
}
.search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: var(--color-text-primary);

  &::placeholder { color: var(--color-text-muted); }
}
.artists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}
.artist-card {
  text-decoration: none;
  overflow: hidden;
  display: block;
  transition: all var(--transition);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 48px rgba(0,0,0,0.12);
  }
}
.artist-cover { height: 140px; overflow: hidden; }
.artist-body { padding: 0 1.25rem 1.25rem; }
.artist-avatar-wrap {
  position: relative;
  display: inline-block;
  margin-top: -30px;
  margin-bottom: 0.75rem;
}
.artist-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--color-bg-card);
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
.verified-dot {
  position: absolute;
  bottom: 3px;
  right: 3px;
  width: 14px;
  height: 14px;
  background: var(--color-gold);
  border-radius: 50%;
  border: 2px solid var(--color-bg-card);
}
.artist-name { font-family: var(--font-display); font-size: 1.2rem; color: var(--color-text-primary); }
.artist-specialty {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-gold);
  margin: 0.25rem 0;
}
.artist-location {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin-bottom: 0.75rem;
}
.artist-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  border-top: 1px solid var(--color-border);
  padding-top: 0.75rem;
  margin-top: 0.75rem;
}
.empty-state { text-align: center; padding: 4rem; color: var(--color-text-muted); }
</style>
