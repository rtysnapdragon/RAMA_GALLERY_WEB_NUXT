<script setup lang="ts">
// components/sections/HeroSection.vue
const { t } = useI18n()
</script>

<template>
  <section class="hero">
    <!-- Background canvas -->
    <div class="hero__bg">
      <div class="hero__bg-img">
        <img
          src="https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=1600&q=80"
          alt="RamaGallery studio"
          fetchpriority="high"
        />
      </div>
      <div class="hero__bg-overlay" />
      <!-- Decorative grain -->
      <div class="hero__grain" />
    </div>

    <div class="container hero__inner">
      <div class="hero__content">
        <!-- Eyebrow -->
        <p class="hero__eyebrow">
          <span class="hero__eyebrow-line" />
          Phnom Penh · Cambodia
        </p>

        <!-- Main title -->
        <h1 class="hero__title">
          <em>{{ t('hero.tagline') }}</em>
        </h1>

        <!-- Intro -->
        <p class="hero__intro">
          {{ t('hero.intro') }}
          <strong>Rama Sovannary</strong>.
        </p>

        <!-- CTAs -->
        <div class="hero__ctas">
          <RgButton href="/gallery" variant="primary" size="lg" icon="arrow-right-line" :icon-right="true">
            {{ t('hero.cta_gallery') }}
          </RgButton>
          <RgButton href="/about" variant="outline" size="lg">
            {{ t('hero.cta_about') }}
          </RgButton>
        </div>
      </div>

      <!-- Floating scroll indicator -->
      <div class="hero__scroll">
        <span class="hero__scroll-line" />
        <span class="hero__scroll-text">Scroll</span>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: flex-end;
  padding-bottom: clamp(4rem, 8vw, 7rem);
  overflow: hidden;

  &__bg {
    position: absolute;
    inset: 0;
    z-index: 0;

    &-img {
      position: absolute;
      inset: 0;
      img { width: 100%; height: 100%; object-fit: cover; }
    }

    &-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        160deg,
        rgba($color-ink, 0.65) 0%,
        rgba($color-ink, 0.3) 50%,
        rgba($color-ink, 0.75) 100%
      );
    }
  }

  &__grain {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: 0.25;
    mix-blend-mode: overlay;
    pointer-events: none;
  }

  &__inner {
    position: relative;
    z-index: 0;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 2rem;
  }

  &__content {
    max-width: 680px;
    animation: fadeUp 1s $ease-expo 0.2s both;
  }

  &__eyebrow {
    @include flex-center(0.75rem);
    justify-content: flex-start;
    font-size: 0.72rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.6);
    margin-bottom: 1.75rem;
  }

  &__eyebrow-line {
    display: block;
    width: 32px;
    height: 1px;
    background: $color-gold;
    flex-shrink: 0;
  }

  &__title {
    font-family: $font-display;
    font-size: clamp(3.5rem, 9vw, 8rem);
    font-weight: 300;
    font-style: italic;
    line-height: 1;
    letter-spacing: -0.02em;
    color: #fff;
    margin-bottom: 1.75rem;
  }

  &__intro {
    @include body-text(1rem);
    color: rgba(255,255,255,0.72);
    max-width: 440px;
    margin-bottom: 2.5rem;

    strong { color: $color-gold; font-weight: 400; }
  }

  &__ctas {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  &__scroll {
    display: none;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    animation: fadeUp 1s $ease-expo 0.8s both;

    @include lg { display: flex; }
  }

  &__scroll-line {
    display: block;
    width: 1px;
    height: 60px;
    background: linear-gradient(to bottom, transparent, $color-gold);
    animation: scrollPulse 2s ease-in-out infinite;
  }

  &__scroll-text {
    writing-mode: vertical-rl;
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.4);
  }
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes scrollPulse {
  0%, 100% { opacity: 0.4; transform: scaleY(1); }
  50%       { opacity: 1;   transform: scaleY(1.1); }
}
</style>
