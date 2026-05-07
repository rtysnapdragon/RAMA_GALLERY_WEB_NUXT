<template>
  <Teleport to="body">
    <Transition name="search-fade">
      <div
        v-if="ui.searchOpen"
        class="search-root"
        role="dialog"
        aria-modal="true"
        :aria-label="$t('search_placeholder')"
        @keydown.esc="close"
        @keydown.up.prevent="moveCursor(-1)"
        @keydown.down.prevent="moveCursor(1)"
        @keydown.enter.prevent="confirmCursor"
      >
        <!-- Backdrop -->
        <div class="search-backdrop" @click="close" />

        <!-- Modal panel -->
        <div class="search-panel" ref="panelRef">

          <!-- ══ HEADER: input bar ══════════════════════════════════ -->
          <div class="search-bar">
            <div class="sb-icon-wrap">
              <svg v-if="!isLoading" class="sb-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                <circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <div v-else class="sb-spinner" />
            </div>

            <input
              ref="inputRef"
              v-model="query"
              type="text"
              class="sb-input"
              :placeholder="activePlaceholder"
              autocomplete="off"
              spellcheck="false"
            />

            <!-- Filter pill -->
            <div class="sb-filters">
              <button
                v-for="f in filters"
                :key="f.key"
                class="sb-filter-btn"
                :class="{ active: activeFilter === f.key }"
                @click.stop="toggleFilter(f.key)"
              >
                <span class="sbf-icon"><i :class="f.icon"></i></span>
                <span class="sbf-label">{{ tBy({en: f.label.en, km: f.label.km}) }}</span>
              </button>
            </div>

            <!-- Clear / Close -->
            <button v-if="query" class="sb-clear" @click.stop="query = ''" :aria-label="$t('clear')">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
            <button class="sb-close" @click="close" :aria-label="$t('close_search')">
              <span>ESC</span>
            </button>
          </div>

          <!-- ══ SCOPE TABS (when query active) ══════════════════════ -->
          <div v-if="query.trim().length > 0" class="scope-tabs">
            <button
              v-for="tab in scopeTabs"
              :key="tab.key"
              class="scope-tab"
              :class="{ active: activeScope === tab.key }"
              @click="activeScope = tab.key"
            >
              {{ tBy({en:tab.label.en, km:tab.label.km}) }}
              <span v-if="tab.count > 0" class="scope-count">{{ tab.count }}</span>
            </button>
          </div>

          <!-- ══ BODY ════════════════════════════════════════════════ -->
          <div class="search-body" ref="bodyRef">

            <!-- ── EMPTY STATE: no query ──────────────────────────── -->
            <div v-if="!query.trim()" class="state-empty">

              <!-- Recent searches -->
              <div v-if="recentSearches.length" class="empty-section">
                <div class="es-head">
                  <p class="es-label">{{ $t('recent_searches') }}</p>
                  <button class="es-clear-btn" @click="clearRecent">{{ $t('clear') }}</button>
                </div>
                <div class="chip-row">
                  <button
                    v-for="r in recentSearches"
                    :key="r"
                    class="chip chip-recent"
                    @click="query = r"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {{ r }}
                  </button>
                </div>
              </div>

              <!-- Trending chips -->
              <div class="empty-section">
                <p class="es-label">{{ tBy({en:'Trending searches', km:'ស្វែងរកពេញនិយម'}) }}</p>
                <div class="chip-row">
                  <button v-for="t in trending" :key="t.id" class="chip chip-trend" @click="query = t.title.en">
                    <!-- <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg> -->
                    <!-- <component :is="t.icon" /> -->
                    {{ tBy({en:t.title?.en, km:t.title?.km }) }}
                  </button>
                </div>
              </div>

              <!-- Quick navigation -->
              <div class="empty-section">
                <p class="es-label">{{ tBy({en:'Quick navigate', km:'រុករករហ័ស'}) }}</p>
                <div class="quick-nav-grid">
                  <NuxtLink
                    v-for="(nav, i) in quickNav"
                    :key="nav.href"
                    :to="nav.href"
                    class="qn-card"
                    :class="`qn-color-${i % 4}`"
                    @click="close"
                  >
                    <span class="qn-icon"><i :class="nav.icon"></i></span>
                    <span class="qn-label">{{ tBy({en:nav.title?.en, km:nav.title?.km}) }}</span>
                    <svg class="qn-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </NuxtLink>
                </div>
              </div>
            </div>

            <!-- ── RESULTS STATE ────────────────────────────────────── -->
            <div v-else-if="totalResults > 0" class="state-results">

              <!-- ARTWORKS group -->
              <div
                v-if="(activeScope === 'all' || activeScope === 'artworks') && scopedResults.artworks.length"
                class="result-group"
              >
                <div class="rg-header">
                  <span class="rg-label">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    {{ tBy({en:'Artworks', km:'ស្នាដៃ'}) }}
                  </span>
                  <NuxtLink v-if="scopedResults.artworks.length >= MAX_PER_GROUP" to="/gallery" class="rg-see-all" @click="close">
                    {{ tBy({en:'See all in Gallery', km:'មើលទាំងអស់'}) }} →
                  </NuxtLink>
                </div>
                <NuxtLink
                  v-for="(a, idx) in scopedResults.artworks"
                  :key="a.id"
                  :to="`/artwork/${a.slug}`"
                  class="result-row"
                  :class="{ highlighted: cursorIndex === getCursorIdx('artworks', idx) }"
                  @click="handleResultClick(a.title)"
                  @mouseenter="cursorIndex = getCursorIdx('artworks', idx)"
                >
                  <div class="rr-thumb rr-thumb-square">
                    <img :src="a.image" :alt="a.title" loading="lazy" />
                  </div>
                  <div class="rr-body">
                    <p class="rr-title" v-html="highlight(locale === 'km' && a.title_km ? a.title_km : a.title)" />
                    <p class="rr-meta">
                      <span class="rr-badge rr-badge-category">{{ tBy({en:a.category, km:a.category}) }}</span>
                      <span class="rr-dot">·</span>
                      {{ tBy({en:'by', km:'ដោយ'}) }} {{ a.artist.name }}
                      <span class="rr-dot">·</span>
                      <span class="rr-price">${{ a.price.toLocaleString() }}</span>
                    </p>
                    <div class="rr-tags">
                      <span v-for="tag in a.tags.slice(0, 3)" :key="tag" class="rr-tag">{{ tBy({en:tag.en, km:tag.km}) }}</span>
                    </div>
                  </div>
                  <div class="rr-right">
                    <span class="rr-likes"><i class="ri-heart-fill"></i>{{ a.likes }}</span>
                    <svg class="rr-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </div>
                </NuxtLink>
              </div>

              <!-- ARTISTS group -->
              <div
                v-if="(activeScope === 'all' || activeScope === 'artists') && scopedResults.artists.length"
                class="result-group"
              >
                <div class="rg-header">
                  <span class="rg-label">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    {{ tBy({en:'Artists', km:'វិចិត្រករ'}) }}
                  </span>
                  <NuxtLink v-if="scopedResults.artists.length >= MAX_PER_GROUP" to="/artists" class="rg-see-all" @click="close">
                    {{ tBy({en:'See all Artists', km:'មើលទាំងអស់'}) }} →
                  </NuxtLink>
                </div>
                <NuxtLink
                  v-for="(ar, idx) in scopedResults.artists"
                  :key="ar.id"
                  :to="`/artist/${ar.slug}`"
                  class="result-row"
                  :class="{ highlighted: cursorIndex === getCursorIdx('artists', idx) }"
                  @click="handleResultClick(ar.name)"
                  @mouseenter="cursorIndex = getCursorIdx('artists', idx)"
                >
                  <div class="rr-thumb rr-thumb-round">
                    <img :src="ar.avatar" :alt="ar.name" loading="lazy" />
                    <div v-if="ar.verified" class="rr-verified">✓</div>
                  </div>
                  <div class="rr-body">
                    <p class="rr-title" v-html="highlight(locale === 'km' && ar.name_km ? ar.name_km : ar.name)" />
                    <p class="rr-meta">
                      <span class="rr-badge rr-badge-specialty">{{ tBy({en:ar.specialty, km:ar.specialty}) }}</span>
                      <span class="rr-dot">·</span>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {{ ar.location }}
                    </p>
                    <p class="rr-sub">{{ ar.artworks_count }} {{ tBy({en:'works', km:'ស្នាដៃ'}) }} · {{ formatCount(ar.followers) }} {{ tBy({en:'followers', km:'អ្នកតាមដាន'}) }}</p>
                  </div>
                  <svg class="rr-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </NuxtLink>
              </div>

              <!-- EVENTS group -->
              <div
                v-if="(activeScope === 'all' || activeScope === 'events') && scopedResults.events.length"
                class="result-group"
              >
                <div class="rg-header">
                  <span class="rg-label">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    {{ tBy({en:'Events', km:'ព្រឹត្តិការណ៍'}) }}
                  </span>
                  <NuxtLink v-if="scopedResults.events.length >= MAX_PER_GROUP" to="/events" class="rg-see-all" @click="close">{{ tBy({en:'See all Events', km:'មើលទាំងអស់'}) }} →</NuxtLink>
                </div>
                <NuxtLink
                  v-for="(ev, idx) in scopedResults.events"
                  :key="ev.id"
                  :to="`/events/${ev.slug}`"
                  class="result-row"
                  :class="{ highlighted: cursorIndex === getCursorIdx('events', idx) }"
                  @click="handleResultClick(ev.title)"
                  @mouseenter="cursorIndex = getCursorIdx('events', idx)"
                >
                  <div class="rr-thumb rr-thumb-square">
                    <img :src="ev.image" :alt="ev.title" loading="lazy" />
                  </div>
                  <div class="rr-body">
                    <p class="rr-title" v-html="highlight(locale === 'km' && ev.title_km ? ev.title_km : ev.title)" />
                    <p class="rr-meta">
                      <span class="rr-badge rr-badge-event">{{ tBy({en:ev.category, km:ev.category}) }}</span>
                      <span class="rr-dot">·</span>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {{ tBy({en:ev.location, km:ev.location}) }}
                    </p>
                    <p class="rr-sub">{{ fmtDate(ev.date) }}</p>
                  </div>
                  <svg class="rr-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </NuxtLink>
              </div>

              <!-- SERVICES group -->
              <div
                v-if="(activeScope === 'all' || activeScope === 'services') && scopedResults.services.length"
                class="result-group"
              >
                <div class="rg-header">
                  <span class="rg-label">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    {{ tBy({en:'Services', km:'សេវាកម្ម'}) }}
                  </span>
                  <NuxtLink v-if="scopedResults.services.length >= MAX_PER_GROUP" to="/services" class="rg-see-all" @click="close">{{ tBy({en:'See all Services', km:'មើលទាំងអស់'}) }} →</NuxtLink>
                </div>
                <NuxtLink
                  v-for="(svc, idx) in scopedResults.services"
                  :key="svc.id"
                  :to="`/services#features`"
                  class="result-row"
                  :class="{ highlighted: cursorIndex === getCursorIdx('services', idx) }"
                  @click="handleResultClick(svc.title.en)"
                  @mouseenter="cursorIndex = getCursorIdx('services', idx)"
                >
                  <div class="rr-thumb rr-thumb-icon">
                    <span><i :class="svc.icon" ></i></span>
                  </div>
                  <div class="rr-body">
                    <p class="rr-title" v-html="highlight(locale === 'km' ? svc.title.km : svc.title.en)" />
                    <p class="rr-sub">{{ locale === 'km' ? svc.description.km : svc.description.en }}</p>
                  </div>
                  <svg class="rr-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </NuxtLink>
              </div>

              <!-- PAGES group -->
              <div
                v-if="(activeScope === 'all' || activeScope === 'pages') && scopedResults.pages.length"
                class="result-group"
              >
                <div class="rg-header">
                  <span class="rg-label">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    {{ tBy({en:'Pages', km:'ទំព័រ'}) }}
                  </span>
                </div>
                <NuxtLink
                  v-for="(pg, idx) in scopedResults.pages"
                  :key="pg.href"
                  :to="pg.href"
                  class="result-row"
                  :class="{ highlighted: cursorIndex === getCursorIdx('pages', idx) }"
                  @click="handleResultClick(pg.title.en)"
                  @mouseenter="cursorIndex = getCursorIdx('pages', idx)"
                >
                  <div class="rr-thumb rr-thumb-icon">
                    <span>{{ pg.icon }}</span>
                  </div>
                  <div class="rr-body">
                    <p class="rr-title" v-html="highlight(locale === 'km' ? pg.title.km : pg.title.en)" />
                    <p class="rr-sub">{{ locale === 'km' ? pg.href.km : pg.href.en }}</p>
                  </div>
                  <svg class="rr-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </NuxtLink>
              </div>

            </div>

            <!-- ── NO RESULTS STATE ────────────────────────────────── -->
            <div v-else-if="query.trim().length > 1" class="state-no-results">
              <div class="nr-icon"><i class="ri-search-eye-line"></i></div>
              <p class="nr-title">{{ tBy({en:`No results for "${query}"`, km:`រកមិនឃើញ "${query}"`}) }}</p>
              <p class="nr-sub">{{ tBy({en:'Try different keywords or browse by category below', km:'សាកល្បងពាក្យផ្សេង ឬ​ ​រុករក​ ដោយ​ ប្រភេទ'}) }}</p>
              <div class="nr-suggestions">
                <p class="nr-sug-label">{{ tBy({en:'You might like:', km:'អ្នកអាចចូលចិត្ត:'}) }}</p>
                <div class="chip-row">
                  <!-- <button v-for="t in trending.slice(0, 5)" :key="t" class="chip chip-trend" @click="query = t">{{ t }}</button> -->
                  <button v-for="t in trending.slice(0, 5)" :key="t.id" class="chip chip-trend" @click="query = t.title.en">
                    <i :class="t.icon"></i>
                    {{ tBy({en:t.title.en, km:t.title.km }) }}
                  </button>
                </div>
              </div>
              <NuxtLink to="/gallery" class="all-btnartwork btn-outline nr-cta" @click="close">
                {{ tBy({en:'Browse all artworks', km:'មើលស្នាដៃទាំងអស់'}) }}
              </NuxtLink>
            </div>

          </div>

          <!-- ══ FOOTER: keyboard shortcuts ═══════════════════════════ -->
          <div class="search-footer">
            <div class="sf-shortcuts">
              <span class="sf-key">↑↓</span><span class="sf-hint">{{ tBy({en:'Navigate', km:'រុករក'}) }}</span>
              <span class="sf-key">↵</span><span class="sf-hint">{{ tBy({en:'Open', km:'បើក'}) }}</span>
              <span class="sf-key">ESC</span><span class="sf-hint">{{ tBy({en:'Close', km:'បិទ'}) }}</span>
            </div>
            <div class="sf-right">
              <span class="sf-powered">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--color-gold)" stroke="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                {{ tBy({en:'RamaSearch', km:'រ៉ាម៉ាស្វែងរក'}) }}
              </span>
              <span v-if="totalResults > 0" class="sf-count">{{ totalResults }} {{ tBy({en:'results', km:'លទ្ធផល'}) }}</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
// ─────────────────────────────────────────────────────────────────────────────
// RamaGallery — SearchOverlay.vue
// Full-site bilingual search (EN/KM) with keyboard navigation, recent history,
// scoped tabs, highlight, and deep-link routing to the correct page/slug.
// Nuxt 4 · Vue 3 · TypeScript · SCSS
// ─────────────────────────────────────────────────────────────────────────────

import pagesData from '~/assets/json/pages.json'
import Teams from '~/pages/teams.vue';  

// ── Types ────────────────────────────────────────────────────────────────────
interface PageResult {
  href: string
  icon: string
  title: { en: string; km: string }
  keywords: string[]
}

// ── Composables / stores ─────────────────────────────────────────────────────
const ui         = useUIStore()
const { locale } = useI18n()
const router     = useRouter()

// ── Constants ────────────────────────────────────────────────────────────────
const MAX_PER_GROUP   = 4
const RECENT_MAX      = 8
const DEBOUNCE_MS     = 160

// ── Refs ─────────────────────────────────────────────────────────────────────
const query          = ref('')
const debouncedQuery = ref('')
const inputRef       = ref<HTMLInputElement | null>(null)
const panelRef       = ref<HTMLElement | null>(null)
const bodyRef        = ref<HTMLElement | null>(null)
const isLoading      = ref(false)
const cursorIndex    = ref(-1)
const activeScope    = ref<'all' | 'artworks' | 'artists' | 'events' | 'services' | 'pages'>('all')
const activeFilter   = ref<string | null>(null)
const recentSearches = ref<string[]>([])

// ── Placeholder rotator ──────────────────────────────────────────────────────
const placeholders = computed(() => [
  tBy({en:"Search artworks, artists, events…",km:"ស្វែងរកស្នាដៃ វិចិត្រករ ព្រឹត្តិការណ៍…"}),
  tBy({en:'Try "Apsara", "Digital", "Sophea"…', km:'សាកល្បង "អប្សរ", "ឌីជីថល"…'}),
  tBy({en:'Find exhibitions, services, blogs…', km:'ស្វែងរកការតាំងបង្ហាញ សេវា…'}),
  tBy({en:'Search by artist name or style…', km:'ស្វែងរកដោយឈ្មោះ ឬ​ ស្ទីល…'}),
])

const placeholderIdx = ref(0)
const activePlaceholder = computed(() => placeholders.value[placeholderIdx.value])
let placeholderTimer: ReturnType<typeof setInterval>

// ── Filters ──────────────────────────────────────────────────────────────────
const filters = [
  { key: 'painting',     icon: 'ri-paint-fill', label: { en: 'Painting',    km: 'គំនូរ' } },
  { key: 'photography',  icon: 'ri-camera-fill', label: { en: 'Photography', km: 'ថតរូប' } },
  { key: 'digital',      icon: 'ri-computer-fill', label: { en: 'Digital',     km: 'ឌីជីថល' } },
  { key: 'sculpture',    icon: 'ri-sculpture-fill', label: { en: 'Sculpture',   km: 'ចម្លាក់' } },
  { key: 'traditional',  icon: 'ri-traditional-fill', label: { en: 'Traditional', km: 'បុរាណ' } },
]

function toggleFilter(key: string) {
  activeFilter.value = activeFilter.value === key ? null : key
  if (activeFilter.value) query.value = activeFilter.value
  else query.value = ''
  nextTick(() => inputRef.value?.focus())
}

// ── Trending / quick data ────────────────────────────────────────────────────
const trending = [
  { id: 1, title: {en:'Apsara', km: 'អប្សរ'},icon:'ri-painting-fill',  href: '/gallery/apsara',},
  { id: 2, title: {en:'Angkor', km: 'អង្គរ'},icon:'ri-gallery-fill', href: '/gallery/angkor',},
  { id: 3, title: {en:'Digital', km: 'ឌីជីថល'},icon:'ri-computer-fill',  href: '/gallery/digital',},
  { id: 4, title: {en:'Sophea', km: 'សោភា'},icon:'ri-paint-roll-fill',  href: '/gallery/sophea',},
  { id: 5, title: {en:'Gold leaf', km: 'ស្លឹកមាស'},icon:'ri-brush-fill',  href: '/gallery/gold-leaf',},
  { id: 6, title: {en:'Photography', km: 'ថតរូប'},icon:'ri-camera-fill', href: '/gallery/photography',},
  { id: 7, title: {en:'Traditional', km: 'បុរាណ'},icon:'ri-traditional-fill', href: '/gallery/traditional',},
  { id: 8, title: {en:'Phnom Penh', km: 'ភ្នំពេញ'},icon:'ri-city-fill', href: '/gallery/phnom-penh',},
  { id: 9, title: {en:'Cambodia Art Week', km: 'សប្តាហ៍សិល្បៈកម្ពុជា'},icon:'ri-calendar-event-fill', href: '/gallery/cambodia-art-week',},
]

const quickNav: PageResult[] = [
  { href: '/gallery',  icon: 'ri-gallery-fill', title: { en: 'Gallery',  km: 'វិចិត្រសាល' },  keywords: ['gallery', 'artworks', 'browse', 'វិចិត្រសាល'] },
  { href: '/artists',  icon: 'ri-paint-roll-fill', title: { en: 'Artists',  km: 'វិចិត្រករ' },  keywords: ['artists', 'creators', 'painters', 'វិចិត្រករ'] },
  { href: '/events',   icon: 'ri-calendar-event-fill', title: { en: 'Events',   km: 'ព្រឹត្តិការណ៍' }, keywords: ['events', 'exhibitions', 'festival', 'ព្រឹត្តិការណ៍'] },
  { href: '/blogs',    icon: 'ri-book-open-fill', title: { en: 'Journal',  km: 'ទស្សនាវដ្ដី' },  keywords: ['blogs', 'journal', 'articles', 'stories', 'ទស្សនាវដ្ដី'] },
  { href: '/services', icon: 'ri-tools-fill', title: { en: 'Services', km: 'សេវាកម្ម' },    keywords: ['services', 'pricing', 'plans', 'ai', 'សេវាកម្ម'] },
  { href: '/about',    icon: 'ri-ancient-gate-fill', title: { en: 'About',    km: 'អំពីយើង' },      keywords: ['about', 'team', 'mission', 'story', 'អំពីយើង'] },
  { href: '/contact',  icon: 'ri-mail-open-fill', title: { en: 'Contact',  km: 'ទំនាក់ទំនង' },  keywords: ['contact', 'support', 'help', 'ទំនាក់ទំនង'] },
  { href: '/register', icon: 'ri-user-add-fill', title: { en: 'Join',     km: 'ចូលរួម' },       keywords: ['register', 'join', 'sign up', 'create account', 'ចូលរួម'] },
]
 
// ── Debounce query → debouncedQuery ─────────────────────────────────────────
let debTimer: ReturnType<typeof setTimeout>
watch(query, (val) => {
  isLoading.value = true
  clearTimeout(debTimer)
  debTimer = setTimeout(() => {
    debouncedQuery.value = val
    isLoading.value = false
    cursorIndex.value = -1
    activeScope.value = 'all'
  }, DEBOUNCE_MS)
})

// ── Core search function ─────────────────────────────────────────────────────
const rawResults = computed(() => {
  const q = debouncedQuery.value.trim().toLowerCase()
  if (q.length < 1) return { artworks: [], artists: [], events: [], services: [], pages: [] }

  // Token split for multi-word matching
  const tokens = q.split(/\s+/).filter(Boolean)
  const matchesAny = (str: string) => tokens.some(t => str.toLowerCase().includes(t))
  const matchesAll = (strs: string[]) => tokens.every(t => strs.some(s => s.toLowerCase().includes(t)))

  // ── Artworks ─────────────────────────────────────────────────────────────
  const artworks = pagesData.artworks
    .map(a => {
      const fields = [
        a.title, a.title_km, a.category,
        a.artist.name, a.description,
        ...a.tags,
        String(a.year),
        String(a.price),
      ]
      const score = matchesAll(fields) ? 2 : matchesAny(fields.join(' ')) ? 1 : 0
      return { ...a, _score: score }
    })
    .filter(a => a._score > 0)
    .sort((a, b) => b._score - a._score || b.likes - a.likes)
    .slice(0, MAX_PER_GROUP)

  // ── Artists ──────────────────────────────────────────────────────────────
  const artists = pagesData.artists
    .map(a => {
      const fields = [a.name, a.name_km, a.specialty, a.location, a.bio]
      const score = matchesAll(fields) ? 2 : matchesAny(fields.join(' ')) ? 1 : 0
      return { ...a, _score: score }
    })
    .filter(a => a._score > 0)
    .sort((a, b) => b._score - a._score || b.followers - a.followers)
    .slice(0, MAX_PER_GROUP)

  // ── Events ───────────────────────────────────────────────────────────────
  const events = pagesData.events
    .map(ev => {
      const fields = [ev.title, ev.title_km, ev.category, ev.location, ev.description]
      const score = matchesAll(fields) ? 2 : matchesAny(fields.join(' ')) ? 1 : 0
      return { ...ev, _score: score }
    })
    .filter(ev => ev._score > 0)
    .sort((a, b) => b._score - a._score)
    .slice(0, MAX_PER_GROUP)

  // ── Services ─────────────────────────────────────────────────────────────
  const services = pagesData.services
    .map(s => {
      const fields = [s.title.en, s.title.km, s.description.en, s.description.km]
      const score = matchesAll(fields) ? 2 : matchesAny(fields.join(' ')) ? 1 : 0
      return { ...s, _score: score }
    })
    .filter(s => s._score > 0)
    .slice(0, MAX_PER_GROUP)

  // ── Static pages ─────────────────────────────────────────────────────────
  const pages = quickNav
    .map(pg => {
      const fields = [pg.title.en, pg.title.km, pg.href.replace('/', ''), ...pg.keywords]
      const score = matchesAll(fields) ? 2 : matchesAny(fields.join(' ')) ? 1 : 0
      return { ...pg, _score: score }
    })
    .filter(pg => pg._score > 0)
    .slice(0, 4)

  return { artworks, artists, events, services, pages }
})

// ── Scoped results (filter by active tab) ────────────────────────────────────
const scopedResults = computed(() => rawResults.value)

// ── Scope tabs with counts ───────────────────────────────────────────────────
const scopeTabs = computed(() => [
  { key: 'all',      label: { en: 'All',      km: 'ទាំងអស់' },       count: totalResults.value },
  { key: 'artworks', label: { en: 'Artworks', km: 'ស្នាដៃ' },        count: rawResults.value.artworks.length },
  { key: 'artists',  label: { en: 'Artists',  km: 'វិចិត្រករ' },    count: rawResults.value.artists.length },
  { key: 'events',   label: { en: 'Events',   km: 'ព្រឹត្តិការណ៍' }, count: rawResults.value.events.length },
  { key: 'services', label: { en: 'Services', km: 'សេវាកម្ម' },     count: rawResults.value.services.length },
  { key: 'pages',    label: { en: 'Pages',    km: 'ទំព័រ' },          count: rawResults.value.pages.length },
].filter(t => t.key === 'all' || t.count > 0))

const totalResults = computed(() => {
  const r = rawResults.value
  return r.artworks.length + r.artists.length + r.events.length + r.services.length + r.pages.length
})

// ── Keyboard cursor (flat index across all groups) ───────────────────────────
// Group order: artworks → artists → events → services → pages
const flatResults = computed(() => {
  const r = scopedResults.value
  return [
    ...r.artworks.map((a, i) => ({ group: 'artworks', idx: i, href: `/artwork/${a.slug}` })),
    ...r.artists.map((a, i)  => ({ group: 'artists',  idx: i, href: `/artist/${a.slug}` })),
    ...r.events.map((e, i)   => ({ group: 'events',   idx: i, href: `/events/${e.slug}` })),
    ...r.services.map((s, i) => ({ group: 'services', idx: i, href: `/services#features` })),
    ...r.pages.map((p, i)    => ({ group: 'pages',    idx: i, href: p.href })),
  ]
})

function getCursorIdx(group: string, idx: number): number {
  return flatResults.value.findIndex(f => f.group === group && f.idx === idx)
}

function moveCursor(dir: number) {
  const len = flatResults.value.length
  if (!len) return
  cursorIndex.value = (cursorIndex.value + dir + len) % len
  scrollCursorIntoView()
}

function scrollCursorIntoView() {
  nextTick(() => {
    const el = bodyRef.value?.querySelector('.result-row.highlighted')
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  })
}

function confirmCursor() {
  if (cursorIndex.value >= 0 && flatResults.value[cursorIndex.value]) {
    const item = flatResults.value[cursorIndex.value]
    handleResultClick(item.href)
    router.push(item.href)
    close()
  } else if (query.value.trim()) {
    // fallback: go to gallery with query
    router.push(`/gallery?q=${encodeURIComponent(query.value.trim())}`)
    close()
  }
}

// ── Highlight matched text ───────────────────────────────────────────────────
function highlight(text: string): string {
  const q = debouncedQuery.value.trim()
  if (!q || q.length < 1) return text
  const tokens = q.split(/\s+/).filter(Boolean)
  let result = text
  tokens.forEach(token => {
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    result = result.replace(
      new RegExp(`(${escaped})`, 'gi'),
      '<mark>$1</mark>'
    )
  })
  return result
}

// ── Recent searches (localStorage) ───────────────────────────────────────────
function loadRecent() {
  if (!import.meta.client) return
  try {
    recentSearches.value = JSON.parse(localStorage.getItem('rama_recent_search') ?? '[]')
  } catch { recentSearches.value = [] }
}

function saveRecent(term: string) {
  if (!term.trim() || !import.meta.client) return
  const arr = [term, ...recentSearches.value.filter(r => r !== term)].slice(0, RECENT_MAX)
  recentSearches.value = arr
  localStorage.setItem('rama_recent_search', JSON.stringify(arr))
}

function clearRecent() {
  recentSearches.value = []
  if (import.meta.client) localStorage.removeItem('rama_recent_search')
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatCount(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
}

function fmtDate(d: string): string {
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function handleResultClick(term: string) {
  saveRecent(term)
  close()
}

function close() {
  ui.searchOpen = false
}

// ── Watchers ─────────────────────────────────────────────────────────────────
watch(() => ui.searchOpen, (open) => {
  if (open) {
    loadRecent()
    nextTick(() => inputRef.value?.focus())
    query.value = ''
    debouncedQuery.value = ''
    activeScope.value = 'all'
    activeFilter.value = null
    cursorIndex.value = -1
    // Rotate placeholders
    placeholderIdx.value = 0
    placeholderTimer = setInterval(() => {
      placeholderIdx.value = (placeholderIdx.value + 1) % placeholders.value.length
    }, 3200)
    // Lock body scroll
    if (import.meta.client) document.body.style.overflow = 'hidden'
  } else {
    clearInterval(placeholderTimer)
    if (import.meta.client) document.body.style.overflow = ''
  }
})

// Global keyboard shortcut: Ctrl+K / Cmd+K
onMounted(() => {
  const handler = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault()
      ui.searchOpen = !ui.searchOpen
    }
  }
  window.addEventListener('keydown', handler)
  onUnmounted(() => window.removeEventListener('keydown', handler))
})
</script>

<style scoped lang="scss">
// ── Variables (consumed from :root / .dark) ───────────────────────────────────
// All colors reference global CSS vars defined in main.scss

// ── Root overlay ─────────────────────────────────────────────────────────────
.search-root {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: clamp(4rem, 8vh, 8rem) var(--container-pad) 2rem;

  // Prevent dismiss when clicking inside
  &:focus { outline: none; }
}

// ── Backdrop ─────────────────────────────────────────────────────────────────
.search-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(8, 6, 4, 0.65);
  backdrop-filter: blur(6px) saturate(0.8);
  -webkit-backdrop-filter: blur(6px) saturate(0.8);
}

// ── Panel ─────────────────────────────────────────────────────────────────────
.search-panel {
  position: relative;
  z-index: 1;
  width: min(680px, 100%);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-strong);
  border-radius: 16px;
  overflow: hidden;
  box-shadow:
    0 0 0 1px rgba(255,255,255,0.04) inset,
    0 32px 80px rgba(0,0,0,0.36),
    0 8px 24px rgba(0,0,0,0.18);
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 8rem);

  .dark & {
    border-color: rgba(240,236,228,0.12);
    box-shadow: 0 0 0 1px rgba(255,255,255,0.05) inset, 0 32px 80px rgba(0,0,0,0.6);
  }
}

// ── Search bar ───────────────────────────────────────────────────────────────
.search-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem 0.875rem 1.25rem;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-card);
  position: sticky;
  top: 0;
  z-index: 10;
  flex-shrink: 0;
}

.sb-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  flex-shrink: 0;
}

.sb-icon { color: var(--color-text-muted); }

.sb-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-gold);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.sb-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-family: var(--font-sans);
  font-size: 14px !important;
  color: var(--color-text-primary);
  min-width: 0;

  &::placeholder {
    color: var(--color-text-muted);
    transition: opacity 0.3s ease;
  }
}

// Filter pills strip
.sb-filters {
  display: flex;
  gap: 0.35rem;
  flex-shrink: 0;

  @media (max-width: 520px) { display: none; }
}

.sb-filter-btn {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.28rem 0.625rem;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  background: transparent;
  color: var(--color-text-muted);
  font-family: var(--font-sans);
  font-size: 0.7rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  .sbf-icon { font-size: 0.75rem; }
  .sbf-label { @media (max-width: 640px) { display: none; } }

  &:hover {
    border-color: var(--color-gold);
    color: var(--color-gold);
  }

  &.active {
    background: var(--color-gold);
    border-color: var(--color-gold);
    color: #fff;
  }
}

.sb-clear {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: var(--color-bg-secondary);
  color: var(--color-text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;

  &:hover { background: var(--color-border); color: var(--color-text-primary); }
}

.sb-close {
  display: flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: transparent;
  color: var(--color-text-muted);
  font-family: var(--font-mono, monospace);
  font-size: 0.65rem;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s ease;

  &:hover { border-color: var(--color-gold); color: var(--color-gold); }
}

// ── Scope tabs ────────────────────────────────────────────────────────────────
.scope-tabs {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 0 1.25rem;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-card);
  overflow-x: auto;
  flex-shrink: 0;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
}

.scope-tab {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.625rem 0.875rem;
  border: none;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: var(--color-text-muted);
  font-family: var(--font-sans);
  font-size: 0.78rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  margin-bottom: -1px;

  &:hover { color: var(--color-text-primary); }

  &.active {
    color: var(--color-gold);
    border-bottom-color: var(--color-gold);
  }
}

.scope-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: rgba(200, 149, 28, 0.15);
  color: var(--color-gold);
  border-radius: 10px;
  font-size: 0.65rem;
  font-weight: 700;
  line-height: 1;
}

// ── Body (scrollable) ─────────────────────────────────────────────────────────
.search-body {
  overflow-y: auto;
  flex: 1;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--color-border) transparent;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 2px; }
}

// ══ EMPTY STATE ───────────────────────────────────────────────────────────────
.state-empty { padding: 1.25rem 1.25rem 0.5rem; }

.empty-section { margin-bottom: 1.75rem; }

.es-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.es-label {
  font-size: 0.67rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin-bottom: 3px;
}

.es-clear-btn {
  background: none;
  border: none;
  font-size: 0.72rem;
  color: var(--color-text-muted);
  cursor: pointer;
  font-family: var(--font-sans);
  transition: color 0.2s;
  padding: 0;

  &:hover { color: var(--color-gold); }
}

// chips
.chip-row { display: flex; flex-wrap: wrap; gap: 0.4rem; }

.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.875rem;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 500;
  font-family: var(--font-sans);
  cursor: pointer;
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;
  line-height: 1;

  svg { opacity: 0.6; flex-shrink: 0; }
}

.chip-recent {
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);

  &:hover { border-color: var(--color-gold); color: var(--color-gold); }
}

.chip-trend {
  background: transparent;
  color: var(--color-text-secondary);

  &:hover { background: rgba(200,149,28,0.08); border-color: var(--color-gold); color: var(--color-gold); }
}

// Quick nav grid
.quick-nav-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;

  @media (max-width: 480px) { grid-template-columns: repeat(2, 1fr); }
}

.qn-card {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 0.875rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: var(--color-gold);
    color: var(--color-text-primary);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }

  &:hover .qn-arrow { opacity: 1; transform: translateX(2px); }

  // subtle tint per card
  &.qn-color-0 { &:hover { background: rgba(200,149,28,0.05); } }
  &.qn-color-1 { &:hover { background: rgba(59,130,246,0.05); } }
  &.qn-color-2 { &:hover { background: rgba(16,185,129,0.05); } }
  &.qn-color-3 { &:hover { background: rgba(239,68,68,0.05); } }
}

.qn-icon { font-size: 1rem; flex-shrink: 0; }
.qn-label { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.qn-arrow { opacity: 0; color: var(--color-gold); flex-shrink: 0; transition: all 0.2s; }

// ══ RESULTS ───────────────────────────────────────────────────────────────────
.state-results { padding: 0.5rem 0 0.5rem; }

.result-group {
  &:not(:last-child) {
    border-bottom: 1px solid var(--color-border);
    margin-bottom: 0;
    padding-bottom: 0.5rem;
  }
}

.rg-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.25rem 0.375rem;
}

.rg-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.67rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-text-muted);

  svg { opacity: 0.7; }
}

.rg-see-all {
  font-size: 0.72rem;
  color: var(--color-gold);
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;

  &:hover { opacity: 0.8; text-decoration: underline; }
}

// Each result row
.result-row {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.625rem 1.25rem;
  text-decoration: none;
  transition: background 0.15s ease;
  cursor: pointer;

  &:hover, &.highlighted {
    background: var(--color-bg-secondary);

    .rr-title { color: var(--color-gold); }
    .rr-arrow { opacity: 1; transform: translateX(3px); color: var(--color-gold); }
  }
}

// Thumbnails
.rr-thumb {
  width: 46px;
  height: 46px;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--color-bg-secondary);

  img { width: 100%; height: 100%; object-fit: cover; display: block; }

  &-square { border-radius: 6px; }
  &-round { border-radius: 50%; position: relative; }
  &-icon {
    border-radius: 8px;
    background: var(--color-bg-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    border: 1px solid var(--color-border);
  }
}

.rr-verified {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 14px;
  height: 14px;
  background: var(--color-gold);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.5rem;
  color: #fff;
  font-weight: 700;
  border: 1.5px solid var(--color-bg-card);
}

.rr-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.rr-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.15s;

  // Highlight marks
  :deep(mark) {
    background: rgba(200, 149, 28, 0.25);
    color: var(--color-gold);
    border-radius: 2px;
    padding: 0 1px;
    font-style: normal;
  }
}

.rr-meta {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.72rem;
  color: var(--color-text-muted);
  flex-wrap: nowrap;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  svg { opacity: 0.7; flex-shrink: 0; }
}

.rr-dot { opacity: 0.4; }

.rr-sub {
  font-size: 0.72rem;
  color: var(--color-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rr-tags {
  display: flex;
  gap: 0.25rem;
  flex-wrap: nowrap;
  overflow: hidden;
}

.rr-tag {
  display: inline-block;
  padding: 0.1rem 0.4rem;
  background: var(--color-bg-secondary);
  border-radius: 3px;
  font-size: 0.62rem;
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
  white-space: nowrap;
}

.rr-badge {
  display: inline-block;
  padding: 0.1rem 0.45rem;
  border-radius: 3px;
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: capitalize;

  &-category { background: rgba(200,149,28,0.1); color: var(--color-gold); }
  &-specialty { background: rgba(59,130,246,0.1); color: #3b82f6; }
  &-event     { background: rgba(16,185,129,0.1); color: #10b981; }
}

.rr-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
  flex-shrink: 0;
}

.rr-likes {
  font-size: 0.72rem;
  color: var(--color-text-muted);
}

.rr-price {
  color: var(--color-gold);
  font-weight: 600;
}

.rr-arrow {
  opacity: 0;
  flex-shrink: 0;
  transition: all 0.2s ease;
  color: var(--color-text-muted);
}

// ══ NO RESULTS ────────────────────────────────────────────────────────────────
.state-no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.5rem 2rem;
  gap: 0.875rem;
  text-align: center;
}

.nr-icon { font-size: 2.5rem; }

.nr-title {
  font-family: var(--font-display, Georgia, serif);
  font-size: 1.1rem;
  color: var(--color-text-primary);
}

.nr-sub {
  font-size: 0.83rem;
  color: var(--color-text-muted);
  max-width: 360px;
  line-height: 1.6;
}

.nr-suggestions { text-align: left; width: 100%; }

.nr-sug-label {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--color-text-muted);
  margin-bottom: 0.625rem;
}

.nr-cta { margin-top: 0.5rem; }

// ══ FOOTER ────────────────────────────────────────────────────────────────────
.search-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.625rem 1.25rem;
  border-top: 1px solid var(--color-border);
  background: var(--color-bg-secondary);
  flex-shrink: 0;
}

.sf-shortcuts {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex-wrap: wrap;

  @media (max-width: 480px) { display: none; }
}

.sf-key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem 0.45rem;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-family: var(--font-mono, monospace);
  font-size: 0.62rem;
  color: var(--color-text-muted);
  min-width: 24px;
}

.sf-hint {
  font-size: 0.68rem;
  color: var(--color-text-muted);
  margin-right: 0.5rem;
}

.sf-right {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.sf-powered {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.68rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

.sf-count {
  font-size: 0.72rem;
  color: var(--color-gold);
  font-weight: 600;
}

// ══ TRANSITIONS ───────────────────────────────────────────────────────────────
// .search-fade-enter-active {
//   transition: opacity 0.22s ease;
//   .search-panel {
//     transition: opacity 0.22s ease, transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
//   }
// }

// .search-fade-leave-active {
//   transition: opacity 0.18s ease;
//   .search-panel {
//     transition: opacity 0.15s ease, transform 0.18s ease;
//   }
// }

// .search-fade-enter-from {
//   opacity: 0;
//   .search-panel {
//     opacity: 0;
//     transform: translateY(-12px) scale(0.97);
//   }
// }

// .search-fade-leave-to {
//   opacity: 0;
//   .search-panel {
//     opacity: 0;
//     transform: translateY(-8px) scale(0.98);
//   }
// }

/* Transition */
.search-fade-enter-active, .search-fade-leave-active {
  transition: all 0.3s ease;
  .search-backdrop { transition: opacity 0.3s ease; }
  .search-modal { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
}

.search-fade-enter-from, .search-fade-leave-to {
  .search-backdrop { opacity: 0; }
  .search-modal { opacity: 0; transform: scale(0.95) translateY(-10px); }
}
.all-btnartwork{
  border: 1px solid var(--color-border);
  padding: 0.2rem 0.45rem;
}


</style>
