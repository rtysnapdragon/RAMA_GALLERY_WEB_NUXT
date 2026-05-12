<script setup lang="ts">
// components/sections/AboutTeaser.vue
const { t } = useI18n()

const stats = computed(() => [
  { value: '18+', label: t('about.exhibitions_count') },
  { value: '12',  label: t('about.years') },
  { value: '94',  label: t('about.collections') },
])
</script>

<template>
  <section class="section about-teaser">
    <div class="container">
      <div class="about-teaser__grid">
        <!-- Image column -->
        <div class="about-teaser__image-col">
          <div class="about-teaser__image-wrap">
            <img
              src="https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&q=80"
              alt="Rama Sovannary in studio"
              loading="lazy"
            />
            <div class="about-teaser__image-accent" />
          </div>
          <div class="about-teaser__stats">
            <RgStatCounter
              v-for="stat in stats"
              :key="stat.label"
              :value="stat.value"
              :label="stat.label"
            />
          </div>
        </div>

        <!-- Text column -->
        <div class="about-teaser__text-col">
          <RgSectionHeader :title="t('about.title')" />
          <p class="about-teaser__name">{{ t('about.name') }}</p>
          <p class="about-teaser__bio">{{ t('about.bio_1') }}</p>
          <p class="about-teaser__bio">{{ t('about.bio_2') }}</p>
          <RgButton href="/about" variant="outline" size="md" class="about-teaser__cta">
            {{ t('hero.cta_about') }}
          </RgButton>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.about-teaser {
  background: var(--bg-surface);

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: clamp(3rem, 6vw, 6rem);
    align-items: center;

    @include lg { grid-template-columns: 1fr 1fr; }
  }

  &__image-col { display: flex; flex-direction: column; gap: 2.5rem; }

  &__image-wrap {
    position: relative;
    aspect-ratio: 4/5;
    overflow: hidden;
    border-radius: 2px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform $duration-slow $ease-expo;
      &:hover { transform: scale(1.04); }
    }
  }

  &__image-accent {
    position: absolute;
    bottom: -12px;
    right: -12px;
    width: 60%;
    height: 60%;
    border: 1px solid var(--gold);
    border-radius: 2px;
    pointer-events: none;
    z-index: -1;
    opacity: 0.4;
  }

  &__stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    border-top: 1px solid var(--border);
    padding-top: 2rem;
  }

  &__name {
    font-family: $font-display;
    font-size: 1.2rem;
    font-style: italic;
    color: var(--gold);
    margin-bottom: 1.5rem;
    margin-top: -1rem;
  }

  &__bio {
    @include body-text;
    color: var(--text-muted);
    margin-bottom: 1.25rem;
    max-width: 480px;
  }

  &__cta { margin-top: 1rem; }
}
</style>
