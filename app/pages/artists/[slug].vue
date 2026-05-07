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
                <div v-if="artist.verified" class="verified-badge" title="Verified Artist">
                  <i class="ri-verified-badge-fill"></i>
                </div>
              </div>
              <div>
                <h1 class="artist-name">{{ artist.name }}</h1>
                <p class="artist-name-km" v-if="locale === 'km'">{{ artist.name_km }}</p>
                <p class="artist-specialty">{{ artist.specialty }}</p>
                <p class="artist-location">
                  <i class="ri-map-pin-line"></i>
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
              <div class="social-row" v-if="artist.social">
                <a v-if="artist.social.email" :href="`mailto:${artist.social.email}`" class="social-chip" target="_blank">
                  <i class="ri-mail-send-line"></i> Email
                </a>
                <a v-if="artist.social.phone" :href="`tel:${artist.social.phone}`" class="social-chip">
                  <i class="ri-phone-line"></i> Phone
                </a>
                <a v-if="artist.social.telegram" :href="`https://t.me/${artist.social.telegram}`" class="social-chip" target="_blank">
                  <i class="ri-telegram-line"></i> Telegram
                </a>
                <a v-if="artist.social.instagram" :href="`https://instagram.com/${artist.social.instagram}`" class="social-chip" target="_blank">
                  <i class="ri-instagram-line"></i> Instagram
                </a>
                <a v-if="artist.social.facebook" :href="`https://facebook.com/${artist.social.facebook}`" class="social-chip" target="_blank">
                  <i class="ri-facebook-circle-line"></i> Facebook
                </a>
                <a v-if="artist.social.twitter" :href="`https://twitter.com/${artist.social.twitter}`" class="social-chip" target="_blank">
                  <i class="ri-twitter-x-line"></i> Twitter
                </a>
                <a v-if="artist.social.website" :href="`https://${artist.social.website}`" class="social-chip" target="_blank">
                  <i class="ri-global-line"></i> Website
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
const slug = route.params.slug

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
  title: `${slug} Artist Profile`,
  description: `Discover artworks and biography of ${slug}.`
  // description: () => artist.value?.bio ?? '',
})
// useSeoMeta({
//   title: () => artist.value ? `${artist.value.name} — RamaGallery` : 'Artist',
//   description: () => artist.value?.bio ?? '',
// })
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
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  border: 6px solid var(--color-bg);
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
}

.verified-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  background: var(--color-bg);
  color: var(--color-gold);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
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
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.6rem;
  max-width: 400px;
}

.social-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 1rem;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 99px;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  i {
    font-size: 1rem;
    color: var(--color-text-primary);
  }

  &:hover {
    border-color: var(--color-gold);
    color: var(--color-gold);
    background: rgba(200, 149, 28, 0.05);
    transform: translateY(-2px);
    
    i {
      color: var(--color-gold);
    }
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

.artwork-card { 
  display: block; 
  text-decoration: none; 
  overflow: hidden; 
  border-radius: 16px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  transition: transform 0.4s ease, box-shadow 0.4s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.12);
  }
}
.artwork-meta {
  padding: 1.25rem;
  .artwork-title {
    font-family: var(--font-display);
    font-size: 1.125rem;
    color: var(--color-text-primary);
    margin-bottom: 0.5rem;
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