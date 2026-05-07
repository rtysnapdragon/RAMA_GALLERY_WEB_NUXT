<template>
<section class="gallery-page">
  <!-- Hero -->
  <div class="gallery-hero">
    <div class="hero-bg"></div>
    <div class="hero-glow"></div>
    <div class="container hero-container">
      <div class="hero-content animate-on-scroll">
        <p class="hero-badge">✦ {{ $t('curated_collection') }}</p>
        <h1 class="page-title">
          {{ $t('gallery') }}
        </h1>
        <p class="hero-desc">
          {{ tBy({ en: 'Explore a curated selection of premium artworks from Cambodia\'s most visionary creators.', km: 'ស្វែងរកស្នាដៃសិល្បៈដែលបានជ្រើសរើសយ៉ាងសម្រិតសម្រាំងពីអ្នកបង្កើតដែលមានចក្ខុវិស័យបំផុតរបស់កម្ពុជា។' }) }}
        </p>
      </div>
    </div>
  </div>

  <!-- Filters -->
  <div class="filters-section sticky top-16 z-20">
    <div class="container">
      <div class="filters-wrap animate-on-scroll">
        <button 
          v-for="cat in categories" 
          :key="cat.id"
          class="filter-btn"
          :class="{ active: activeCategory === cat.id }"
          @click="setCategory(cat.id)"
        >
          {{ tBy(cat.name) }}
        </button>
      </div>
    </div>
  </div>

  <div class="container gallery-container section">
    <!-- Grid -->
    <div class="gallery-grid">
      <article
        v-for="(item, i) in filteredArtworks"
        :key="item.Id"
        class="art-card animate-on-scroll"
        :style="{ animationDelay: `${i * 0.05}s` }"
      >
        <!-- image -->
        <NuxtLink
          :to="localePath(`/gallery/${item.Slug}`)"
          class="thumb-wrap"
          @click="trackView(item)"
        >
          <RAImage
            :src="item.Image"
            :alt="item.Title"
            class="thumb"
            :watermark="false"
          />

          <div class="overlay">
            <span class="view-btn">{{ tBy({ en: 'View Details', km: 'មើលព័ត៌មានលម្អិត' }) }}</span>
          </div>
          
          <div class="card-badge" v-if="item.IsFeatured">Featured</div>
        </NuxtLink>

        <!-- content -->
        <div class="card-body">
          <div class="artist-mini">
            <img :src="item.ArtistAvatar" :alt="item.Artist" class="mini-avatar" v-if="item.ArtistAvatar" />
            <span class="artist-name">by {{ item.Artist }}</span>
          </div>
          
          <h3 class="art-title">{{ item.Title }}</h3>

          <!-- actions -->
          <div class="action-row">
            <button
              class="circle-btn like-btn"
              :class="{ active: item.IsLiked }"
              @click.stop="toggleLike(item)"
            >
              <div class="heart-wrap">
                <i
                  class="ri-heart-3-fill heart-icon"
                  :class="{
                    active: item.IsLiked,
                    burst: burst[item.Id]
                  }"
                />
                <span v-for="p in 3" :key="p" v-if="burst[item.Id]" :class="'particle p' + p">❤</span>
              </div>
              <span class="count">{{ formatCount(item.LikeCount) }}</span>
            </button>

            <button
              class="circle-btn save-btn"
              :class="{ active: item.IsSaved }"
              @click.stop="toggleSave(item)"
            >
              <i class="ri-bookmark-fill" />
              <span class="count">{{ formatCount(item.SaveCount) }}</span>
            </button>

            <button
              class="circle-btn share-btn"
              @click.stop="shareArtwork(item)"
            >
              <i class="ri-share-forward-line"></i>
            </button>

            <div class="view-info-badge">
              <i class="ri-eye-line"></i>
              <span>{{ formatCount(item.ViewCount) }}</span>
            </div>
          </div>
        </div>
      </article>
    </div>

    <!-- Empty State -->
    <div v-if="filteredArtworks.length === 0 && !loading" class="empty-state">
      <i class="ri-search-line"></i>
      <p>{{ tBy({ en: 'No artworks found in this category.', km: 'រកមិនឃើញស្នាដៃសិល្បៈនៅក្នុងប្រភេទនេះទេ។' }) }}</p>
      <button class="btn btn-outline" @click="setCategory('all')">Reset Filters</button>
    </div>
    </div>
  </section>
</template>
<script setup lang="ts">
const localePath = useLocalePath()
const auth = useAuthStore()
const notification = useNotificationStore()

interface Artwork {
  Id: number
  Title: string
  Slug: string
  Artist: string
  ArtistAvatar?: string
  Image: string
  Category?: string
  IsFeatured?: boolean

  LikeCount: number
  SaveCount: number
  ShareCount: number
  ViewCount: number

  IsLiked: boolean
  IsSaved: boolean
}

const artworks = ref<Artwork[]>([])
const loading = ref(true)
const burst = ref<Record<number, boolean>>({})
const activeCategory = ref('all')

const categories = [
  { id: 'all', name: { en: 'All Works', km: 'ស្នាដៃទាំងអស់' } },
  { id: 'painting', name: { en: 'Painting', km: 'គំនូរ' } },
  { id: 'photography', name: { en: 'Photography', km: 'រូបថត' } },
  { id: 'digital', name: { en: 'Digital', km: 'ឌីជីថល' } },
  { id: 'sculpture', name: { en: 'Sculpture', km: 'ចម្លាក់' } },
  { id: 'traditional', name: { en: 'Traditional', km: 'បែបប្រពៃណី' } }
]

const filteredArtworks = computed(() => {
  if (activeCategory.value === 'all') return artworks.value
  return artworks.value.filter(a => a.Category?.toLowerCase() === activeCategory.value)
})

const setCategory = (id: string) => {
  activeCategory.value = id
}

const formatCount = (n: number) => {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return n
}

/**
 * debounce timers per artwork
 */
const likeTimers = ref<Record<number, ReturnType<typeof setTimeout>>>({})
const saveTimers = ref<Record<number, ReturnType<typeof setTimeout>>>({})

/* ------------------------------------------
LOAD
------------------------------------------ */
const fetchArtworks = async () => {
  loading.value = true
  try {
    const { data, error } = await useWeb(
      'api/v1/artworks',
      { method: 'POST' }
    )

    if (error.value) {
      console.error(error.value)
      return
    }

    artworks.value = data.value || []
  } finally {
    loading.value = false
  }
}

onMounted(fetchArtworks)
useScrollAnimation()

/* ------------------------------------------
LIKE
UI update instantly
real request after delay
------------------------------------------ */
const toggleLike = (item: Artwork) => {
  item.IsLiked = !item.IsLiked
  item.LikeCount += item.IsLiked ? 1 : -1

  if (item.IsLiked) {
    burst.value[item.Id] = true

    setTimeout(() => {
      burst.value[item.Id] = false
    }, 650)
  }

  /**
   * clear previous request
   * user clicked fast => only final state sent
   */
  if (likeTimers.value[item.Id]) {
    clearTimeout(likeTimers.value[item.Id])
  }

  likeTimers.value[item.Id] = setTimeout(async () => {
    const { error } = await useWeb(
      'api/v1/artwork/like',
      {
        method: 'POST',
        data: {
          ArtworkId: item.Id,
          Liked: item.IsLiked
        }
      }
    )

    if (error.value) {
      console.error(error.value)
    }
  }, 500)
}

/* ------------------------------------------
SAVE
------------------------------------------ */
const toggleSave = (item: Artwork) => {
  if (!auth.isLoggedIn) {
    notification.pushToast({
      Id: Date.now(),
      Message: 'Please log in to save artworks',
      Type: 'system'
    } as any)
    return
  }

  item.IsSaved = !item.IsSaved
  item.SaveCount += item.IsSaved ? 1 : -1

  if (saveTimers.value[item.Id]) {
    clearTimeout(saveTimers.value[item.Id])
  }

  saveTimers.value[item.Id] = setTimeout(async () => {
    const { error } = await useWeb(
      'api/v1/artwork/save',
      {
        method: 'POST',
        data: {
          ArtworkId: item.Id,
          Saved: item.IsSaved
        }
      }
    )

    if (error.value) {
      console.error(error.value)
    }
  }, 500)
}

/* ------------------------------------------
SHARE
------------------------------------------ */
const shareArtwork = async (item: Artwork) => {
  const url =
    window.location.origin +
    localePath(`/gallery/${item.Slug}`)

  try {
    if (navigator.share) {
      await navigator.share({
        title: item.Title,
        url
      })
    } else {
      await navigator.clipboard.writeText(url)
    }

    item.ShareCount++

    await useWeb(
      'api/v1/artwork/share',
      {
        method: 'POST',
        data: { ArtworkId: item.Id }
      }
    )
  } catch (e) {
    console.error(e)
  }
}

/* ------------------------------------------
VIEW
------------------------------------------ */
const trackView = async (item: Artwork) => {
  item.ViewCount++

  await useWeb(
    'api/v1/artwork/view',
    {
      method: 'POST',
      data: { ArtworkId: item.Id }
    }
  )
}
</script>

<style lang="scss" scoped>
.gallery-hero {
  position: relative;
  padding: 8rem 0 6rem;
  background: var(--color-bg);
  overflow: hidden;
  text-align: center;

  .hero-bg {
    position: absolute;
    inset: 0;
    background-image: 
      radial-gradient(circle at 20% 30%, rgba(200, 149, 28, 0.08) 0%, transparent 40%),
      radial-gradient(circle at 80% 70%, rgba(200, 149, 28, 0.05) 0%, transparent 40%);
    filter: blur(60px);
  }

  .hero-glow {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(from 180deg at 50% 50%, transparent 0deg, var(--color-gold-muted) 180deg, transparent 360deg);
    opacity: 0.03;
    animation: rotate 20s linear infinite;
  }

  .hero-container { position: relative; z-index: 1; }
  
  .hero-badge {
    display: inline-block;
    padding: 0.5rem 1.25rem;
    background: rgba(200, 149, 28, 0.1);
    color: var(--color-gold);
    border-radius: 99px;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 1.5rem;
    border: 1px solid rgba(200, 149, 28, 0.2);
  }

  .page-title {
    font-family: var(--font-display);
    font-size: clamp(2.5rem, 8vw, 4.5rem);
    line-height: 1.1;
    margin-bottom: 1.5rem;
    background: linear-gradient(to bottom, var(--color-text-primary), var(--color-text-secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .hero-desc {
    font-size: 1.125rem;
    color: var(--color-text-secondary);
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
}

.filters-section {
  padding: 1.5rem 0;
  background: rgba(var(--color-bg-rgb), 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--color-border);
}

.filters-wrap {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
}

.filter-btn {
  padding: 0.625rem 1.5rem;
  border-radius: 99px;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--color-gold-muted);
    color: var(--color-text-primary);
  }

  &.active {
    background: var(--color-gold);
    border-color: var(--color-gold);
    color: #000;
    box-shadow: 0 4px 12px rgba(200, 149, 28, 0.25);
  }
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

.art-card {
  position: relative;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 24px;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);

  &:hover {
    transform: translateY(-8px);
    border-color: rgba(200, 149, 28, 0.3);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);

    .thumb { transform: scale(1.05); }
    .overlay { opacity: 1; }
  }
}

.thumb-wrap {
  position: relative;
  display: block;
  aspect-ratio: 1/1;
  overflow: hidden;
}

.thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.4s ease;
  backdrop-filter: blur(4px);
}

.view-btn {
  padding: 0.75rem 1.5rem;
  background: #fff;
  color: #000;
  border-radius: 99px;
  font-weight: 600;
  font-size: 0.875rem;
  transform: translateY(10px);
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.art-card:hover .view-btn {
  transform: translateY(0);
}

.card-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.375rem 0.75rem;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  color: var(--color-gold);
  border-radius: 99px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid rgba(200, 149, 28, 0.3);
}

.card-body {
  padding: 1.5rem;
}

.artist-mini {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;

  .mini-avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid var(--color-border);
  }

  .artist-name {
    font-size: 0.8rem;
    color: var(--color-text-secondary);
  }
}

.art-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 1.25rem;
  line-height: 1.3;
}

.action-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--color-border);
}

.circle-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.875rem;
  border-radius: 99px;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  transition: all 0.3s ease;

  i { font-size: 1.1rem; }
  .count { font-size: 0.85rem; font-weight: 600; }

  &:hover {
    border-color: var(--color-gold-muted);
    color: var(--color-text-primary);
    transform: translateY(-2px);
  }

  &.active.like-btn {
    background: rgba(255, 45, 85, 0.1);
    border-color: rgba(255, 45, 85, 0.2);
    color: #ff2d55;
  }

  &.active.save-btn {
    background: rgba(200, 149, 28, 0.1);
    border-color: rgba(200, 149, 28, 0.2);
    color: var(--color-gold);
  }
}

.view-info-badge {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.empty-state {
  text-align: center;
  padding: 6rem 0;
  color: var(--color-text-muted);

  i { font-size: 3rem; margin-bottom: 1rem; color: var(--color-border); }
  p { margin-bottom: 1.5rem; }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .gallery-hero { padding: 6rem 0 4rem; }
  .page-title { font-size: 2.5rem; }
  .card-body { padding: 1rem; }
  .art-title { font-size: 1rem; margin-bottom: 1rem; }
  .action-row { gap: 0.35rem; }
  .circle-btn {
    padding: 0.4rem 0.6rem;
    i { font-size: 1rem; }
    .count { font-size: 0.75rem; }
  }
  .view-info-badge { font-size: 0.7rem; }
}
</style>