<template>
  <section class="section-wrap featured-artists-section">
    <div class="container">
      <div class="section-header">
        <div>
          <h2 class="section-title">{{ $t('trending_title') }}</h2>
          <p class="section-subtitle">{{ $t('trending_subtitle') }}</p>
        </div>
        <NuxtLink :to="localePath('/artist')" class="btn btn-outline view-all-btn">
          {{ $t('view_all') }}
          <i class="ri-arrow-right-line"></i>
        </NuxtLink>
      </div>

      <div class="artists-grid">
        <div 
          v-for="artist in featuredArtists" 
          :key="artist.id"
          class="artist-card"
        >
          <div class="artist-cover-wrapper">
            <img :src="artist.cover" :alt="tBy(artist, 'name')" class="artist-cover" loading="lazy" />
          </div>
          
          <div class="artist-profile">
            <div class="avatar-wrapper">
              <img :src="artist.avatar" :alt="tBy(artist, 'name')" class="artist-avatar" loading="lazy" />
              <div v-if="artist.verified" class="verified-badge" title="Verified Artist">
                <i class="ri-verified-badge-fill"></i>
              </div>
            </div>
            
            <div class="artist-info">
              <NuxtLink :to="localePath(`/artist/${artist.slug}`)" class="artist-name">
                {{ tBy(artist, 'name') }}
              </NuxtLink>
              <p class="artist-specialty">{{ artist.specialty }}</p>
              
              <div class="artist-stats">
                <div class="stat">
                  <span class="stat-val">{{ formatNumber(artist.followers) }}</span>
                  <span class="stat-label">{{ $t('followers') }}</span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat">
                  <span class="stat-val">{{ formatNumber(artist.artworks_count) }}</span>
                  <span class="stat-label">{{ $t('artworks') }}</span>
                </div>
              </div>
              
              <div class="artist-actions">
                <button class="btn btn-primary btn-follow">{{ $t('follow') }}</button>
                <NuxtLink :to="localePath(`/artist/${artist.slug}`)" class="btn btn-outline btn-portfolio">
                  {{ $t('portfolio') }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLocalData } from '~/composables/useLocalData'

const props = defineProps<{
  artists: any[]
}>()

const { tBy } = useLocalData()

const featuredArtists = computed(() => {
  return props.artists.filter(a => a.featured).slice(0, 3)
})

const formatNumber = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}
</script>

<style lang="scss" scoped>
.featured-artists-section {
  padding: 4rem 0;
  background: var(--color-bg-secondary);
}

/* GRID */
.artists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
}

/* CARD */
.artist-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 14px;

  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  transition: 0.2s;
}

.artist-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0,0,0,.08);
}

/* COVER */
.artist-cover-wrapper {
  aspect-ratio: 16 / 6; /* 🔥 responsive instead of fixed height */
  overflow: hidden;
}

.artist-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* PROFILE */
.artist-profile {
  padding: 0 1rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -32px;
  text-align: center;
}

/* AVATAR */
.avatar-wrapper {
  position: relative;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  padding: 3px;
  background: var(--color-bg-card);
  margin-bottom: 0.6rem;
}

.artist-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

/* VERIFIED */
.verified-badge {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 18px;
  height: 18px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* TEXT */
.artist-name {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
}

.artist-specialty {
  font-size: 0.75rem;
  opacity: 0.6;
  margin-bottom: 0.75rem;
}

/* STATS */
.artist-stats {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
  width: 100%;
}

.stat-val {
  font-size: 0.9rem;
}

.stat-label {
  font-size: 0.65rem;
}

/* ACTIONS */
.artist-actions {
  display: flex;
  gap: 0.5rem;
  width: 100%;
}

.btn {
  flex: 1;
  font-size: 0.75rem;
  padding: 0.5rem;
  border-radius: 10px;
}
</style>
