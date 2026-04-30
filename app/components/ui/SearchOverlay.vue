<template>
  <Transition name="search">
    <div v-if="ui.searchOpen" class="search-overlay" @keydown.esc="ui.searchOpen = false">
      <div class="search-backdrop" @click="ui.searchOpen = false" />
      <div class="search-modal">
        <div class="search-input-wrap">
          <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
            <circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            ref="inputRef"
            v-model="query"
            type="text"
            class="search-input"
            placeholder="Search artworks, artists, blogs…"
            @input="onInput"
          />
          <button v-if="query" class="search-clear" @click="query = ''">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Results -->
        <div v-if="query.length > 1" class="search-results">
          <div v-if="results.artworks.length" class="result-group">
            <p class="result-label">Artworks</p>
            <NuxtLink
              v-for="a in results.artworks"
              :key="a.id"
              :to="`/artwork/${a.slug}`"
              class="result-item"
              @click="ui.searchOpen = false"
            >
              <div class="result-thumb">
                <img :src="a.image" :alt="a.title" />
              </div>
              <div>
                <p class="result-title">{{ a.title }}</p>
                <p class="result-sub">by {{ a.artist.name }}</p>
              </div>
            </NuxtLink>
          </div>

          <div v-if="results.artists.length" class="result-group">
            <p class="result-label">Artists</p>
            <NuxtLink
              v-for="ar in results.artists"
              :key="ar.id"
              :to="`/artists/${ar.slug}`"
              class="result-item"
              @click="ui.searchOpen = false"
            >
              <div class="result-thumb round">
                <img :src="ar.avatar" :alt="ar.name" />
              </div>
              <div>
                <p class="result-title">{{ ar.name }}</p>
                <p class="result-sub">{{ ar.specialty }}</p>
              </div>
            </NuxtLink>
          </div>

          <div v-if="!results.artworks.length && !results.artists.length" class="result-empty">
            {{$t('no_result_for')}}<strong>{{ query }}</strong>
          </div>
        </div>

        <div v-else class="search-hint">
          <p>Try: <span @click="query = 'apsara'">Apsara</span> · <span @click="query = 'digital'">Digital</span> · <span @click="query = 'Sophea'">Sophea</span></p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import pagesData from '~/assets/json/pages.json'

const ui = useUIStore()
const query = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

const results = computed(() => {
  const q = query.value.toLowerCase()
  return {
    artworks: pagesData.artworks.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.artist.name.toLowerCase().includes(q) ||
      a.category.includes(q) ||
      a.tags.some(t => t.includes(q))
    ).slice(0, 4),
    artists: pagesData.artists.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.specialty.toLowerCase().includes(q) ||
      a.location.toLowerCase().includes(q)
    ).slice(0, 3),
  }
})

const onInput = () => {}

watch(() => ui.searchOpen, (val) => {
  if (val) {
    nextTick(() => inputRef.value?.focus())
    query.value = ''
  }
})
</script>

<style scoped lang="scss">
.search-overlay {
  position: fixed;
  inset: 0;
  z-index: 300;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 6rem;
}

.search-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
}

.search-modal {
  position: relative;
  z-index: 1;
  width: min(640px, calc(100vw - 2rem));
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(0,0,0,0.2);
}

.search-input-wrap {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--color-border);
}

.search-icon { color: var(--color-text-muted); flex-shrink: 0; }

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-family: var(--font-sans);
  font-size: 1rem;
  color: var(--color-text-primary);

  &::placeholder { color: var(--color-text-muted); }
}

.search-clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-bg-secondary);
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;

  &:hover { color: var(--color-text-primary); }
}

.search-results { padding: 0.75rem 0; max-height: 400px; overflow-y: auto; }

.result-group { padding: 0 0.75rem 0.75rem; }

.result-label {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  padding: 0.5rem 0.5rem 0.25rem;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.625rem 0.5rem;
  border-radius: 6px;
  text-decoration: none;
  transition: background var(--transition);

  &:hover { background: var(--color-bg-secondary); }
}

.result-thumb {
  width: 42px;
  height: 42px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--color-bg-secondary);

  img { width: 100%; height: 100%; object-fit: cover; }
  &.round { border-radius: 50%; }
}

.result-title { font-size: 0.875rem; font-weight: 500; color: var(--color-text-primary); margin-bottom: 0.125rem; }
.result-sub { font-size: 0.75rem; color: var(--color-text-muted); }

.result-empty {
  padding: 2rem;
  text-align: center;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.search-hint {
  padding: 1.25rem;
  font-size: 0.875rem;
  color: var(--color-text-muted);

  span {
    color: var(--color-gold);
    cursor: pointer;
    &:hover { text-decoration: underline; }
  }
}

.search-enter-active, .search-leave-active { transition: opacity 0.2s ease; }
.search-enter-from, .search-leave-to { opacity: 0; }
</style>
