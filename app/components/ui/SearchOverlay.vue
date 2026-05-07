<template>
  <Transition name="search">
    <div v-if="ui.searchOpen" class="search-overlay" @keydown="handleKeydown">
      <div class="search-backdrop" @click="ui.searchOpen = false" />
      
      <div class="search-modal" @click.stop>
        <!-- Search Header -->
        <div class="search-header">
          <div class="search-input-wrap">
            <i class="ri-search-line search-icon"></i>
            <input
              ref="inputRef"
              v-model="query"
              type="text"
              class="search-input"
              :placeholder="$t('search_placeholder') || 'Search artworks, artists, events...'"
              @input="onInput"
              autocomplete="off"
            />
            <div class="search-actions">
              <button v-if="query" class="search-clear" @click="clearSearch">
                <i class="ri-close-line"></i>
              </button>
              <kbd class="search-kbd">ESC</kbd>
            </div>
          </div>
        </div>

        <!-- Search Body -->
        <div class="search-body custom-scrollbar">
          <!-- Quick Suggestions / Recent (Empty Query) -->
          <div v-if="!query" class="search-empty-state">
            <div class="suggestion-group">
              <p class="group-label">{{ $t('popular_searches') || 'Popular Searches' }}</p>
              <div class="suggestion-chips">
                <button 
                  v-for="s in suggestions" 
                  :key="s" 
                  class="suggestion-chip"
                  @click="query = s"
                >
                  {{ s }}
                </button>
              </div>
            </div>
            
            <div class="quick-links">
              <p class="group-label">{{ $t('quick_links') || 'Quick Links' }}</p>
              <div class="link-grid">
                <NuxtLink to="/gallery" class="quick-link" @click="ui.searchOpen = false">
                  <i class="ri-gallery-line"></i>
                  <span>{{ $t('explore_gallery') || 'Explore Gallery' }}</span>
                </NuxtLink>
                <NuxtLink to="/artists" class="quick-link" @click="ui.searchOpen = false">
                  <i class="ri-user-star-line"></i>
                  <span>{{ $t('find_artists') || 'Find Artists' }}</span>
                </NuxtLink>
                <NuxtLink to="/events" class="quick-link" @click="ui.searchOpen = false">
                  <i class="ri-calendar-event-line"></i>
                  <span>{{ $t('upcoming_events') || 'Upcoming Events' }}</span>
                </NuxtLink>
                <NuxtLink to="/services" class="quick-link" @click="ui.searchOpen = false">
                  <i class="ri-service-line"></i>
                  <span>{{ $t('our_services') || 'Our Services' }}</span>
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Results List -->
          <div v-else-if="hasResults" class="search-results-list">
            <template v-for="(group, type) in filteredResults" :key="type">
              <div v-if="group.length" class="result-section">
                <h3 class="result-section-label">{{ type }}</h3>
                <div class="result-items">
                  <div
                    v-for="(item, index) in group"
                    :key="item.id"
                    class="result-item-wrapper"
                    :class="{ active: isSelected(type, index) }"
                    @mouseenter="setSelectedIndex(type, index)"
                  >
                    <NuxtLink
                      :to="item.link"
                      class="result-item"
                      @click="ui.searchOpen = false"
                    >
                      <div class="result-preview">
                        <img v-if="item.image" :src="item.image" :alt="item.title" loading="lazy" />
                        <div v-else class="result-icon-fallback">
                          <i :class="item.icon"></i>
                        </div>
                      </div>
                      <div class="result-info">
                        <div class="result-title-row">
                          <span class="result-title">{{ item.title }}</span>
                          <span v-if="item.badge" class="result-badge">{{ item.badge }}</span>
                        </div>
                        <p class="result-subtitle">{{ item.subtitle }}</p>
                      </div>
                      <i class="ri-arrow-right-s-line result-chevron"></i>
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <!-- No Results -->
          <div v-else class="search-no-results">
            <div class="no-results-icon">
              <i class="ri-search-eye-line"></i>
            </div>
            <h3>{{ $t('no_results_found') || 'No results found' }}</h3>
            <p>{{ $t('try_different_keyword') || 'Try adjusting your search or category' }}</p>
            <NuxtLink :to="localePath('/gallery')" class="btn btn-outline nr-cta" @click="close">
              {{ tBy({en: 'Browse all artworks', km: 'មើលស្នាដៃទាំងអស់'}) }}
            </NuxtLink>
          </div>
        </div>

        <!-- Footer -->
        <div class="search-footer">
          <div class="search-commands">
            <div class="command">
              <kbd><i class="ri-arrow-up-down-line"></i></kbd>
              <span>{{ $t('to_navigate') || 'to navigate' }}</span>
            </div>
            <div class="command">
              <kbd>ENTER</kbd>
              <span>{{ $t('to_select') || 'to select' }}</span>
            </div>
            <div class="command">
              <kbd>ESC</kbd>
              <span>{{ $t('to_close') || 'to close' }}</span>
            </div>
          </div>
          <div class="search-powered">
            Powered by Rama AI
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import pagesData from '~/assets/json/pages.json'

const ui = useUIStore()
const { locale } = useI18n()
const query = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const selectedType = ref('')
const selectedIdx = ref(0)

const suggestions = ['Apsara', 'Digital', 'Angkor', 'Contemporary', 'Sophea', 'Silk']

// Normalize search text (English + Khmer)
const match = (text: any, q: string) => {
  if (!text) return false
  if (typeof text === 'object') {
    return Object.values(text).some(v => String(v).toLowerCase().includes(q))
  }
  return String(text).toLowerCase().includes(q)
}

const filteredResults = computed(() => {
  const q = query.value.toLowerCase().trim()
  if (!q) return {}

  const results: Record<string, any[]> = {
    Artworks: [],
    Artists: [],
    Events: [],
    Services: [],
    Teams: []
  }

  // 1. Artworks
  results.Artworks = pagesData.artworks
    .filter(a => match(a.title, q) || match(a.title_km, q) || match(a.artist.name, q) || a.tags?.some(t => match(t, q)))
    .map(a => ({
      id: `artwork-${a.id}`,
      title: locale.value === 'km' ? a.title_km : a.title,
      subtitle: `by ${a.artist.name} • ${a.category}`,
      image: a.image,
      link: `/gallery/${a.slug}`,
      badge: a.year
    }))
    .slice(0, 5)

  // 2. Artists
  results.Artists = pagesData.artists
    .filter(a => match(a.name, q) || match(a.name_km, q) || match(a.specialty, q))
    .map(a => ({
      id: `artist-${a.id}`,
      title: locale.value === 'km' ? a.name_km : a.name,
      subtitle: a.specialty,
      image: a.avatar,
      link: `/artists/${a.slug}`,
      badge: a.location
    }))
    .slice(0, 4)

  // 3. Events
  results.Events = pagesData.events
    .filter(e => match(e.title, q) || match(e.title_km, q) || match(e.location, q))
    .map(e => ({
      id: `event-${e.id}`,
      title: locale.value === 'km' ? e.title_km : e.title,
      subtitle: e.location,
      image: e.image,
      link: `/events`, 
      badge: 'Event'
    }))
    .slice(0, 3)

  // 4. Services
  results.Services = (pagesData.services as any[])
    .filter(s => match(s.title, q) || match(s.description, q))
    .map(s => ({
      id: `service-${s.id}`,
      title: locale.value === 'km' ? s.title.km : s.title.en,
      subtitle: locale.value === 'km' ? s.description.km : s.description.en,
      icon: 'ri-service-line',
      link: `/services`,
      badge: 'Service'
    }))
    .slice(0, 3)

  // 5. Teams
  results.Teams = (pagesData.teams as any[])
    .filter(t => match(t.name, q) || match(t.role, q))
    .map(t => ({
      id: `team-${t.id}`,
      title: t.name,
      subtitle: locale.value === 'km' ? t.role.km : t.role.en,
      image: t.avatar,
      link: `/teams`,
      badge: 'Team'
    }))
    .slice(0, 3)

  return results
})

const hasResults = computed(() => Object.values(filteredResults.value).some(arr => arr.length > 0))

const clearSearch = () => {
  query.value = ''
  selectedIdx.value = 0
}

const onInput = () => {
  selectedIdx.value = 0
  const firstType = Object.keys(filteredResults.value).find(k => filteredResults.value[k].length > 0)
  selectedType.value = firstType || ''
}

const setSelectedIndex = (type: string, index: number) => {
  selectedType.value = type
  selectedIdx.value = index
}

const isSelected = (type: string, index: number) => {
  return selectedType.value === type && selectedIdx.value === index
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    ui.searchOpen = false
    return
  }

  const flatResults: { type: string, index: number, link: string }[] = []
  Object.entries(filteredResults.value).forEach(([type, items]) => {
    items.forEach((item, idx) => {
      flatResults.push({ type, index: idx, link: item.link })
    })
  })

  if (!flatResults.length) return

  const currentFlatIdx = flatResults.findIndex(r => r.type === selectedType.value && r.index === selectedIdx.value)

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    const next = (currentFlatIdx + 1) % flatResults.length
    selectedType.value = flatResults[next].type
    selectedIdx.value = flatResults[next].index
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    const prev = (currentFlatIdx - 1 + flatResults.length) % flatResults.length
    selectedType.value = flatResults[prev].type
    selectedIdx.value = flatResults[prev].index
  } else if (e.key === 'Enter') {
    const current = flatResults[currentFlatIdx]
    if (current) {
      navigateTo(current.link)
      ui.searchOpen = false
    }
  }
}

watch(() => ui.searchOpen, (val) => {
  if (val) {
    nextTick(() => inputRef.value?.focus())
    query.value = ''
    selectedIdx.value = 0
    selectedType.value = ''
  }
})
</script>

<style scoped lang="scss">
.search-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 4rem 1rem;
  
  @media (max-width: 640px) {
    padding: 1rem;
  }
}

.search-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
}

.search-modal {
  position: relative;
  z-index: 10;
  width: min(680px, 100%);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 
    0 0 0 1px rgba(0,0,0,0.05),
    0 20px 50px -12px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 8rem);
  animation: modal-appear 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modal-appear {
  from { opacity: 0; transform: scale(0.95) translateY(-10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.search-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.search-input-wrap {
  display: flex;
  align-items: center;
  gap: 1rem;
  
  .search-icon {
    font-size: 1.5rem;
    color: var(--color-gold);
  }
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-family: var(--font-sans);
  font-size: 1.125rem;
  color: var(--color-text-primary);
  font-weight: 500;

  &::placeholder {
    color: var(--color-text-muted);
    font-weight: 400;
  }
}

.search-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
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
  transition: all 0.2s;

  &:hover {
    background: var(--color-border);
    color: var(--color-text-primary);
  }
}

.search-kbd {
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text-muted);
  font-family: inherit;
  font-weight: 600;
}

.search-body {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
}

/* Empty State & Suggestions */
.search-empty-state {
  padding: 0 1.5rem 1.5rem;
  
  .suggestion-group {
    margin-bottom: 2rem;
  }
  
  .group-label {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-muted);
    margin-bottom: 1rem;
  }
  
  .suggestion-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .suggestion-chip {
    padding: 0.5rem 1rem;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 100px;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      border-color: var(--color-gold);
      color: var(--color-gold);
      background: rgba(255, 215, 0, 0.05); // color-gold fallback
    }
  }
}

.link-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.quick-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s;
  
  i {
    font-size: 1.25rem;
    color: var(--color-gold);
  }
  
  span {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--color-text-primary);
  }
  
  &:hover {
    border-color: var(--color-gold);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
}

/* Results */
.result-section {
  margin-bottom: 1.5rem;
  
  &:last-child { margin-bottom: 0; }
}

.result-section-label {
  padding: 0 1.5rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-gold);
  letter-spacing: 0.05em;
}

.result-item-wrapper {
  padding: 0 0.75rem;
  
  &.active {
    .result-item {
      background: var(--color-bg-secondary);
      border-color: var(--color-gold);
      
      .result-chevron {
        opacity: 1;
        transform: translateX(0);
      }
    }
  }
}

.result-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 12px;
  text-decoration: none;
  border: 1px solid transparent;
  transition: all 0.2s;
  
  &:hover {
    background: var(--color-bg-secondary);
  }
}

.result-preview {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--color-bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  i {
    font-size: 1.25rem;
    color: var(--color-text-muted);
  }
}

.result-info {
  flex: 1;
  min-width: 0;
}

.result-title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.125rem;
}

.result-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-badge {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.125rem 0.375rem;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: var(--color-text-muted);
  white-space: nowrap;
}

.result-subtitle {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-chevron {
  color: var(--color-gold);
  font-size: 1.25rem;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.2s;
}

/* No Results */
.search-no-results {
  padding: 4rem 2rem;
  text-align: center;
  
  .no-results-icon {
    font-size: 3rem;
    color: var(--color-text-muted);
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 0.9rem;
    color: var(--color-text-muted);
  }
}

/* Footer */
.search-footer {
  padding: 0.75rem 1.5rem;
  background: var(--color-bg-secondary);
  border-top: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.search-commands {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  
  .command {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.7rem;
    color: var(--color-text-muted);
    
    kbd {
      padding: 0.125rem 0.375rem;
      background: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-radius: 4px;
      font-weight: 700;
      color: var(--color-text-primary);
    }
  }
}

.search-powered {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--color-text-muted);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

/* Scrollbar */
.custom-scrollbar {
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--color-border);
    border-radius: 10px;
    
    &:hover {
      background: var(--color-text-muted);
    }
  }
}

/* Transition */
.search-enter-active, .search-leave-active {
  transition: all 0.3s ease;
  .search-backdrop { transition: opacity 0.3s ease; }
  .search-modal { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
}

.search-enter-from, .search-leave-to {
  .search-backdrop { opacity: 0; }
  .search-modal { opacity: 0; transform: scale(0.95) translateY(-10px); }
}
</style>
