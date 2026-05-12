<script setup lang="ts">
// components/common/RgArtworkCard.vue
import type { Artwork } from '~/composables/useGallery'

interface Props {
  artwork: Artwork
  index?: number
}

const props = withDefaults(defineProps<Props>(), { index: 0 })
const { formatPrice } = useGallery()
const { locale } = useI18n()
const { t } = useI18n()

const title = computed(() => locale.value === 'km' ? props.artwork.titleKm : props.artwork.title)
const medium = computed(() => locale.value === 'km' ? props.artwork.mediumKm : props.artwork.medium)
</script>

<template>
  <article class="artwork-card" :style="{ animationDelay: `${index * 90}ms` }">
    <div class="artwork-card__image-wrap">
      <img
        :src="artwork.image"
        :alt="title"
        loading="lazy"
        class="artwork-card__image"
      />
      <div class="artwork-card__overlay">
        <RgButton variant="outline" size="sm" class="artwork-card__cta">
          {{ t('gallery.inquire') }}
        </RgButton>
      </div>
      <span class="artwork-card__badge" :class="artwork.status">
        {{ t(`gallery.${artwork.status}`) }}
      </span>
    </div>
    <div class="artwork-card__info">
      <h3 class="artwork-card__title">{{ title }}</h3>
      <p class="artwork-card__meta">{{ medium }} · {{ artwork.year }}</p>
      <div class="artwork-card__footer">
        <span class="artwork-card__size">{{ artwork.size }}</span>
        <span class="artwork-card__price">
          {{ artwork.status === 'sold' ? '—' : formatPrice(artwork.price) }}
        </span>
      </div>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.artwork-card {
  @include card-base;
  background: var(--card-bg);
  animation: fadeUp 0.6s $ease-expo both;

  &__image-wrap {
    position: relative;
    overflow: hidden;
    aspect-ratio: 3/4;
    background: var(--bg-surface);
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform $duration-slow $ease-expo;
  }

  &:hover &__image { transform: scale(1.06); }

  &__overlay {
    position: absolute;
    inset: 0;
    background: rgba($color-ink, 0.45);
    @include flex-center;
    opacity: 0;
    transition: opacity $duration-base ease;
    .artwork-card:hover & { opacity: 1; }
    .rg-btn { border-color: rgba(255,255,255,0.7); color: #fff; }
  }

  &__badge {
    position: absolute;
    top: 12px;
    right: 12px;
    font-family: $font-body;
    font-size: 0.65rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 0.25rem 0.6rem;
    border-radius: 1px;

    &.available { background: var(--gold); color: $color-ink; }
    &.sold      { background: rgba($color-ink, 0.65); color: #fff; }
  }

  &__info { padding: 1.25rem; }

  &__title {
    font-family: $font-display;
    font-size: 1.25rem;
    font-weight: 400;
    margin-bottom: 0.35rem;
    color: var(--text);
  }

  &__meta {
    font-size: 0.78rem;
    color: var(--text-muted);
    margin-bottom: 0.75rem;
  }

  &__footer {
    @include flex-between;
    font-size: 0.78rem;
  }

  &__size  { color: var(--text-muted); }
  &__price { font-weight: 500; color: var(--gold); }
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
