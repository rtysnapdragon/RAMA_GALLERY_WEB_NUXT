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
          <i class="ri-search-line"></i>
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
                <div v-if="artist.verified" class="verified-badge" title="Verified Artist">
                  <i class="ri-verified-badge-fill"></i>
                </div>
              </div>
              <h3 class="artist-name">{{ artist.name }}</h3>
              <p class="artist-specialty">{{ artist.specialty }}</p>
              <p class="artist-location">
                <i class="ri-map-pin-line"></i>
                {{ artist.location }}
              </p>
              <div class="artist-stats">
                <span :data-val="artist.artworks_count">{{ tBy({ en: 'works', km: 'ស្នាដៃ' }) }}</span>
                <span :data-val="formatCount(artist.followers)">{{ t('artist.followers') }}</span>
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
useHead({
  link: [
    {
      rel: 'alternate',
      hreflang: 'en',
      href: 'https://ramagallery.angkordragon.space/en'
    },
    {
      rel: 'alternate',
      hreflang: 'km',
      href: 'https://ramagallery.angkordragon.space/km'
    },
    {
      rel: 'canonical',
      href: 'https://ramagallery.angkordragon.space/artists'
    }
  ]
})
useSeoMeta({ 
  title: 'Artists — RamaGallery', 
  description: 'Discover Cambodia\'s finest artists.',
  ogTitle: 'Artists — RamaGallery',
  ogDescription: 'Discover Cambodia\'s finest artists.',
  ogImage: '/og-image.jpg',
  ogUrl: 'https://ramagallery.com',
  ogType: 'website',
  twitterCard: 'summary_large_image',
 })
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
  padding: 1rem 1.5rem;
  background: var(--glass-bg, rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--color-border);
  border-radius: 99px;
  color: var(--color-text-muted);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  i {
    font-size: 1.2rem;
    color: var(--color-text-secondary);
  }

  &:focus-within {
    border-color: var(--color-gold);
    box-shadow: 0 4px 20px rgba(200, 149, 28, 0.1);
    i {
      color: var(--color-gold);
    }
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
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
    border-color: rgba(200, 149, 28, 0.3);
  }
}
.artist-cover { height: 140px; overflow: hidden; }
.artist-body { padding: 0 1.5rem 1.5rem; text-align: center; }
.artist-avatar-wrap {
  position: relative;
  display: inline-block;
  margin-top: -40px;
  margin-bottom: 1rem;
}
.artist-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--color-bg-card);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}
.verified-badge {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 22px;
  height: 22px;
  background: var(--color-bg-card);
  color: var(--color-gold);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}
.artist-name { font-family: var(--font-display); font-size: 1.25rem; font-weight: 700; color: var(--color-text-primary); transition: color 0.3s ease; }
.artist-card:hover .artist-name { color: var(--color-gold); }
.artist-specialty {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  margin: 0.5rem 0;
}
.artist-location {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin-bottom: 1.25rem;
}
.artist-stats {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
  border-top: 1px solid var(--color-border);
  padding-top: 1.25rem;
  margin-top: 1.25rem;

  span {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--color-text-secondary);
    font-size: 0.75rem;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.05em;

    &::before {
      content: attr(data-val);
      font-weight: 700;
      font-size: 1.125rem;
      color: var(--color-text-primary);
      margin-bottom: 0.25rem;
    }
  }
}
.empty-state { text-align: center; padding: 4rem; color: var(--color-text-muted); }
</style>
