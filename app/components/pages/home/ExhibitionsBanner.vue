<script setup lang="ts">
// components/sections/ExhibitionsBanner.vue
const { t } = useI18n()

const exhibitions = [
  { title: 'Mekong Reveries', location: 'Bophana Center, Phnom Penh', dates: 'Mar – May 2025', status: 'upcoming' },
  { title: 'Golden Thread', location: 'Tyler Rollins Fine Art, New York', dates: 'Sep – Nov 2024', status: 'past' },
  { title: 'Khmer Light', location: 'Sundaram Tagore Gallery, Hong Kong', dates: 'Apr – Jun 2024', status: 'past' },
]
</script>

<template>
  <section class="section exhibitions-banner">
    <div class="container">
      <RgSectionHeader
        :title="t('exhibitions.title')"
        :subtitle="t('exhibitions.subtitle')"
      />
      <div class="exhibitions-banner__list">
        <article
          v-for="(ex, i) in exhibitions"
          :key="ex.title"
          class="exhibitions-banner__item"
          :style="{ animationDelay: `${i * 100}ms` }"
        >
          <div class="exhibitions-banner__meta">
            <span class="exhibitions-banner__status" :class="ex.status">
              <i :class="ex.status === 'upcoming' ? 'ri-checkbox-blank-circle-fill' : 'ri-checkbox-blank-circle-line'" />
              {{ t(`exhibitions.${ex.status}`) }}
            </span>
          </div>
          <div class="exhibitions-banner__content">
            <h3 class="exhibitions-banner__title">{{ ex.title }}</h3>
            <p class="exhibitions-banner__location">
              <i class="ri-map-pin-line" /> {{ ex.location }}
            </p>
          </div>
          <div class="exhibitions-banner__dates">
            <i class="ri-calendar-line" />
            <span>{{ ex.dates }}</span>
          </div>
        </article>
      </div>
      <div class="exhibitions-banner__cta">
        <RgButton href="/exhibitions" variant="outline" icon="arrow-right-line" :icon-right="true">
          {{ t('nav.exhibitions') }}
        </RgButton>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.exhibitions-banner {
  &__list {
    display: flex;
    flex-direction: column;
    border-top: 1px solid var(--border);
    margin-bottom: 2.5rem;
  }

  &__item {
    display: grid;
    grid-template-columns: 120px 1fr auto;
    align-items: center;
    gap: 2rem;
    padding-block: 1.75rem;
    border-bottom: 1px solid var(--border);
    transition: background $duration-base ease;
    animation: fadeUp 0.5s $ease-expo both;

    @include md { gap: 3rem; }

    &:hover { background: var(--bg-surface); padding-inline: 1rem; margin-inline: -1rem; }
  }

  &__status {
    @include flex-center(0.4rem);
    font-size: 0.68rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;

    &.upcoming { color: var(--gold); i { font-size: 0.5rem; } }
    &.past { color: var(--text-muted); i { font-size: 0.5rem; } }
  }

  &__title {
    font-family: $font-display;
    font-size: clamp(1.25rem, 2.5vw, 1.75rem);
    font-weight: 400;
    color: var(--text);
    margin-bottom: 0.35rem;
  }

  &__location {
    @include flex-center(0.4rem);
    justify-content: flex-start;
    font-size: 0.8rem;
    color: var(--text-muted);
    i { font-size: 0.85rem; }
  }

  &__dates {
    @include flex-center(0.5rem);
    font-size: 0.78rem;
    color: var(--text-muted);
    white-space: nowrap;
    i { font-size: 0.9rem; }
  }

  &__cta { display: flex; justify-content: flex-start; }
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
