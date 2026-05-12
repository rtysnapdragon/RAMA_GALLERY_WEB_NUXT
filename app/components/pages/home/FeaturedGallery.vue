<script setup lang="ts">
// components/sections/FeaturedGallery.vue
const { t } = useI18n()
const { featuredArtworks } = useGallery()
</script>

<template>
  <section class="section featured">
    <div class="container">
      <div class="featured__header">
        <RgSectionHeader
          :title="t('gallery.title')"
          :subtitle="t('gallery.subtitle')"
        />
        <RgButton href="/gallery" variant="ghost" icon="arrow-right-line" :icon-right="true">
          {{ t('gallery.view_all') }}
        </RgButton>
      </div>

      <div class="featured__grid">
        <RgArtworkCard
          v-for="(artwork, i) in featuredArtworks"
          :key="artwork.id"
          :artwork="artwork"
          :index="i"
          :class="{ 'featured__card--large': i === 0 }"
        />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.featured {
  &__header {
    @include flex-between;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-bottom: clamp(2rem, 4vw, 3.5rem);

    :deep(.rg-section-header) { margin-bottom: 0; }
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;

    @include md { grid-template-columns: repeat(2, 1fr); }
    @include lg {
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: auto auto;
    }
  }

  &__card--large {
    @include lg {
      grid-row: span 1;
    }
  }
}
</style>
