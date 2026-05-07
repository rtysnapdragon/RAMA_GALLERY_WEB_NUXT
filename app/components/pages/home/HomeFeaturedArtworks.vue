<template>
  <section class="section-wrap featured-artworks-section">
    <div class="container">
      <div class="section-header">
        <div>
          <h2 class="section-title">{{ $t('featured_title') }}</h2>
          <p class="section-subtitle">{{ $t('featured_subtitle') }}</p>
        </div>

        <NuxtLink :to="localePath('/gallery')" class="view-all-btn">
          {{ $t('view_all') }}
          <i class="ri-arrow-right-line"></i>
        </NuxtLink>
      </div>

      <!-- GRID -->
      <div class="artworks-grid">
        <article
          v-for="artwork in featuredArtworks"
          :key="artwork.id"
          class="artwork-card"
        >
          <!-- IMAGE -->
          <div class="artwork-image-wrapper">
            <img
              :src="artwork.image"
              :alt="tBy(artwork, 'title')"
              class="artwork-image"
              loading="lazy"
            />

            <div class="artwork-overlay">
              <div class="overlay-actions">
                <button class="action-btn">
                  <i class="ri-heart-3-line"></i>
                </button>
                <button class="action-btn">
                  <i class="ri-bookmark-line"></i>
                </button>
              </div>

              <NuxtLink
                :to="localePath(`/artwork/${artwork.slug}`)"
                class="overlay-link"
              />
            </div>

            <div v-if="artwork.price" class="artwork-price">
              ${{ artwork.price }}
            </div>
          </div>

          <!-- INFO -->
          <div class="artwork-info">
            <h3 class="artwork-title">
              {{ tBy(artwork, 'title') }}
            </h3>

            <div class="artist-info">
              <img
                :src="artwork.artist.avatar"
                class="artist-avatar"
              />

              <NuxtLink
                :to="localePath(`/artist/${artwork.artist.slug}`)"
                class="artist-name"
              >
                {{ artwork.artist.name }}
              </NuxtLink>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>


<script setup lang="ts">
import { computed } from 'vue'
import { useLocalData } from '~/composables/useLocalData'

const props = defineProps<{
  artworks: any[]
}>()

const { tBy } = useLocalData()

const featuredArtworks = computed(() => {
  return props.artworks.filter(a => a.featured).slice(0, 4)
})
</script>

<style lang="scss" scoped>
.featured-artworks-section {
  padding: 4rem 0;
}

/* HEADER */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.section-title {
  font-size: clamp(1.6rem, 3vw, 2.2rem);
}

.section-subtitle {
  font-size: 0.95rem;
  opacity: 0.7;
}

/* GRID CORE */
.artworks-grid {
  display: grid;

  /* 🔥 THIS IS THE KEY */
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));

  gap: 1rem;
}

/* CARD */
.artwork-card {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

/* IMAGE */
.artwork-image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5; /* stable ratio */
  border-radius: 14px;
  overflow: hidden;
  background: var(--color-bg-secondary);
}

/* REMOVE THIS (IMPORTANT) */
/* width: 50% ❌ */

.artwork-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.artwork-image-wrapper:hover .artwork-image {
  transform: scale(1.05);
}

/* OVERLAY */
.artwork-overlay {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: 0.25s;
  background: linear-gradient(to top, rgba(0,0,0,.6), transparent);
}

.artwork-image-wrapper:hover .artwork-overlay {
  opacity: 1;
}

/* ACTIONS */
.overlay-actions {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.4rem;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255,255,255,.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

/* LINK */
.overlay-link {
  position: absolute;
  inset: 0;
}

/* PRICE */
.artwork-price {
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: rgba(0,0,0,.6);
  border-radius: 6px;
}

/* INFO */
.artwork-title {
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.2;
}

.artist-info {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.artist-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.artist-name {
  font-size: 0.75rem;
  opacity: 0.7;
}

/* MOBILE TUNING */
@media (max-width: 480px) {
  .artworks-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
}
</style>
