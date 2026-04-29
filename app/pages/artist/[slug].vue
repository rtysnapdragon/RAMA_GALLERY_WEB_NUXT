<template>
  <div class="artist-page">
    <div v-if="!artist" class="not-found">
      <h2>Artist not found</h2>
      <NuxtLink to="/artists" class="btn btn-primary">Browse Artists</NuxtLink>
    </div>

    <template v-else>
      <!-- Cover -->
      <div class="artist-cover">
        <RAImage :src="artist.cover" aspect="wide" :watermark="false" class="cover-img" />
        <div class="cover-overlay" />
      </div>

      <!-- Profile header -->
      <div class="artist-header">
        <div class="container">
          <div class="artist-header-inner">
            <div class="artist-info">
              <div class="artist-avatar-wrap">
                <img :src="artist.avatar" :alt="artist.name" class="artist-avatar" />
                <div v-if="artist.verified" class="verified-badge" data-tooltip="Verified Artist">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
              </div>
              <div>
                <h1 class="artist-name">{{ artist.name }}</h1>
                <p class="artist-name-km" v-if="locale === 'km'">{{ artist.name_km }}</p>
                <p class="artist-specialty">{{ artist.specialty }}</p>
                <p class="artist-location">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {{ artist.location }}
                </p>
              </div>
            </div>

            <div class="artist-actions">
              <div class="artist-stats">
                <div class="stat">
                  <span class="stat-val">{{ artist.artworks_count }}</span>
                  <span class="stat-label">{{ t('artist.portfolio') }}</span>
                </div>
                <div class="stat">
                  <span class="stat-val">{{ formatCount(artist.followers) }}</span>
                  <span class="stat-label">{{ t('artist.followers') }}</span>
                </div>
              </div>
              <button
                class="btn"
                :class="isFollowing ? 'btn-outline' : 'btn-primary'"
                @click="handleFollow"
              >
                {{ isFollowing ? t('artist.following') : t('artist.follow') }}
              </button>
              <div class="social-row">
                <a v-if="artist.social.instagram" :href="`https://instagram.com/${artist.social.instagram}`" class="social-chip" target="_blank">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/></svg>
                  Instagram
                </a>
                <a v-if="artist.social.website" :href="`https://${artist.social.website}`" class="social-chip" target="_blank">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  Website
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bio -->
      <section class="section bio-section">
        <div class="container bio-inner">
          <div>
            <p class="section-label">{{ t('artist.about') }}</p>
            <p class="bio-text">{{ artist.bio }}</p>
          </div>
          <div class="divider-gold" />
        </div>
      </section>

      <!-- Portfolio grid -->
      <section class="section">
        <div class="container">
          <div class="section-head animate-on-scroll">
            <p class="section-label">{{ t('artist.portfolio') }}</p>
            <h2 class="section-title">{{ tBy({ en: 'Artworks', km: 'ស្នាដៃ' }) }}</h2>
          </div>
          <div class="masonry-grid">
            <div
              v-for="(aw, i) in artistArtworks"
              :key="aw.id"
              class="masonry-item animate-on-scroll"
              :style="{ animationDelay: `${i * 0.08}s` }"
            >
              <NuxtLink :to="`/artwork/${aw.slug}`" class="artwork-card card">
                <RAImage :src="aw.image" :alt="aw.title" aspect="auto" />
                <div class="artwork-meta">
                  <h3 class="artwork-title">{{ aw.title }}</h3>
                  <div class="artwork-stats">
                    <span>♥ {{ aw.likes }}</span>
                    <span>{{ aw.year }}</span>
                  </div>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import pagesData from '~/assets/json/pages.json'
const { t, locale } = useI18n()
const route = useRoute()
const auth = useAuthStore()

useScrollAnimation()

const artist = computed(() => pagesData.artists.find(a => a.slug === route.params.slug))
const artistArtworks = computed(() => pagesData.artworks.filter(aw => aw.artist.slug === route.params.slug))
const isFollowing = ref(false)

const formatCount = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n

const handleFollow = () => {
  if (!auth.isLoggedIn) { navigateTo('/login'); return }
  isFollowing.value = !isFollowing.value
}

useSeoMeta({
  title: () => artist.value ? `${artist.value.name} — RamaGallery` : 'Artist',
  description: () => artist.value?.bio ?? '',
})
</script>

<style scoped lang="scss">
.artist-cover {
  position: relative;
  height: 340px;
  overflow: hidden;

  .cover-img { height: 100%; }
  .cover-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, var(--color-bg) 0%, transparent 60%);
  }
}

.artist-header {
  background: var(--color-bg);
  padding: 0 0 2rem;
}

.artist-header-inner {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
  padding-top: 1.5rem;
}

.artist-info {
  display: flex;
  align-items: flex-end;
  gap: 1.5rem;
}

.artist-avatar-wrap {
  position: relative;
  margin-top: -60px;
}

.artist-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--color-bg);
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}

.verified-badge {
  position: absolute;
  bottom: 6px;
  right: 6px;
  width: 22px;
  height: 22px;
  background: var(--color-gold);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--color-bg);
}

.artist-name {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 400;
  color: var(--color-text-primary);
  line-height: 1.1;
}

.artist-name-km {
  font-family: var(--font-khmer);
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

.artist-specialty {
  color: var(--color-gold);
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin: 0.25rem 0;
}

.artist-location {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.artist-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1rem;
}

.artist-stats {
  display: flex;
  gap: 2rem;
}

.stat {
  text-align: center;
  .stat-val {
    display: block;
    font-family: var(--font-display);
    font-size: 1.5rem;
    color: var(--color-text-primary);
  }
  .stat-label {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-text-muted);
  }
}

.social-row {
  display: flex;
  gap: 0.5rem;
}

.social-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.35rem 0.875rem;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: all var(--transition);

  &:hover {
    border-color: var(--color-gold);
    color: var(--color-gold);
  }
}

.bio-section { padding-bottom: 0; }
.bio-inner { max-width: 720px; }
.bio-text {
  font-size: 1.05rem;
  color: var(--color-text-secondary);
  line-height: 1.8;
  margin-top: 0.75rem;
}

.artwork-card { display: block; text-decoration: none; overflow: hidden; }
.artwork-meta {
  padding: 0.875rem;
  .artwork-title {
    font-family: var(--font-display);
    font-size: 1rem;
    color: var(--color-text-primary);
    margin-bottom: 0.375rem;
  }
}

.artwork-stats {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.section-head { margin-bottom: 2.5rem; }
.section-title { font-size: 2rem; margin-top: 0.5rem; }
.not-found { text-align: center; padding: 8rem 2rem; }
</style>