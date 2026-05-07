<template>
<section class="gallery-page">
  <!-- Hero -->
  <div class="gallery-hero">
    <div class="hero-bg"></div>

    <div class="hero-content">
      <p class="hero-badge">✦ {{ $t('curated_collection') }}</p>

      <h1 class="page-title">
        {{ $t('gallery') }}
      </h1>

      <p class="hero-desc">
        Discover premium artworks, modern Khmer creativity, and timeless visual stories.
      </p>
    </div>
  </div>

  <!-- Grid -->
  <div class="gallery-grid">
    <article
      v-for="item in artworks"
      :key="item.Id"
      class="art-card"
    >
      <!-- image -->
      <NuxtLink
        :to="localePath(`/gallery/${item.Slug}`)"
        class="thumb-wrap"
        @click="trackView(item)"
      >
        <img
          :src="item.Image"
          :alt="item.Title"
          class="thumb"
        />

        <div class="overlay">
          <span class="view-btn">View Artwork</span>
        </div>
      </NuxtLink>

      <!-- content -->
      <div class="card-body">
        <h3 class="art-title">{{ item.Title }}</h3>

        <p class="art-meta">
          by {{ item.Artist }}
        </p>

        <!-- actions -->
        <div class="action-row">

          <!-- Like -->
          <button
            class="circle-btn like-btn"
            @click="toggleLike(item)"
          >
            <div class="heart-wrap">
              <i
                class="ri-heart-3-fill heart-icon"
                :class="{
                  active: item.IsLiked,
                  burst: burst[item.Id]
                }"
              />

              <span v-if="burst[item.Id]" class="particle p1">❤</span>
              <span v-if="burst[item.Id]" class="particle p2">❤</span>
              <span v-if="burst[item.Id]" class="particle p3">❤</span>
            </div>

            <span>{{ item.LikeCount }}</span>
          </button>

          <!-- Save -->
          <button
            class="circle-btn"
            @click="toggleSave(item)"
          >
            <i
              class="ri-bookmark-fill"
              :class="{ saved:item.IsSaved }"
            />
            <span>{{ item.SaveCount }}</span>
          </button>

          <!-- Share -->
          <button
            class="circle-btn"
            @click="shareArtwork(item)"
          >
            <i class="ri-share-forward-fill"></i>
            <span>{{ item.ShareCount }}</span>
          </button>

          <!-- View -->
          <button
            class="circle-btn"
            @click="trackView(item)"
          >
            <i class="ri-eye-fill"></i>
            <span>{{ item.ViewCount }}</span>
          </button>
        </div>
      </div>
    </article>
  </div>
</section>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const localePath = useLocalePath()

interface Artwork {
  Id:number
  Title:string
  Slug:string
  Artist:string
  Image:string

  LikeCount:number
  SaveCount:number
  ShareCount:number
  ViewCount:number

  IsLiked:boolean
  IsSaved:boolean
}

const artworks = ref<Artwork[]>([])
const burst = ref<Record<number, boolean>>({})

/* ------------------------------------------
LOAD
------------------------------------------ */
const fetchArtworks = async () => {
  try {
    // ✅ Await useWeb so data is resolved before you use it
    const { data, error } = await useWeb<Artwork[]>('api/v1/artworks', {
      method: 'POST',
    })

    if (error.value) {
      console.error('Error:', error.value)
      return
    }

    console.log('Artworks list =>>', data.value) // ✅ Now logs the actual array
    artworks.value = data.value                  // ✅ Assign .value, not the ref itself
  } catch (e) {
    console.error(e)
  }
}

onMounted(fetchArtworks)
/* ------------------------------------------
LIKE
------------------------------------------ */
const toggleLike = async (item: Artwork) => {
  const oldLiked = item.IsLiked
  const oldCount = item.LikeCount

  item.IsLiked = !item.IsLiked
  item.LikeCount += item.IsLiked ? 1 : -1

  if (item.IsLiked) {
    burst.value[item.Id] = true

    setTimeout(() => {
      burst.value[item.Id] = false
    }, 650)
  }

  const { error } = await useWeb(
    'api/v1/artwork/like',
    {
      method: 'POST',
      body: {
        ArtworkId: item.Id
      }
    }
  )

  if (error.value) {
    item.IsLiked = oldLiked
    item.LikeCount = oldCount
  }
}


/* ------------------------------------------
SAVE
------------------------------------------ */
const toggleSave = async (item: Artwork) => {
  const oldSaved = item.IsSaved
  const oldCount = item.SaveCount

  item.IsSaved = !item.IsSaved
  item.SaveCount += item.IsSaved ? 1 : -1

  const { error } = await useWeb(
    'api/v1/artwork/save',
    {
      method: 'POST',
      body: {
        ArtworkId: item.Id
      }
    }
  )

  if (error.value) {
    item.IsSaved = oldSaved
    item.SaveCount = oldCount
  }
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
      alert('Copied link')
    }

    item.ShareCount++

    const { error } = await useWeb(
      'api/v1/artwork/share',
      {
        method: 'POST',
        body: {
          ArtworkId: item.Id
        }
      }
    )

    if (error.value) {
      item.ShareCount--
    }

  } catch (e) {
    console.error(e)
  }
}


/* ------------------------------------------
VIEW
------------------------------------------ */
const trackView = async (item: Artwork) => {
  item.ViewCount++

  const { error } = await useWeb(
    'api/v1/artwork/view',
    {
      method: 'POST',
      body: {
        ArtworkId: item.Id
      }
    }
  )

  if (error.value) {
    item.ViewCount--
  }
}
</script>

<style scoped lang="scss">
.gallery-page{
  @apply max-w-7xl mx-auto px-4 py-10;
}

.gallery-grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
  gap:1.2rem;
}

.art-card{
  border-radius:24px;
  overflow:hidden;
  background:var(--card);
  border:1px solid var(--border);
}

.thumb-wrap{
  position:relative;
  display:block;
}

.thumb{
  width:100%;
  height:320px;
  object-fit:cover;
}

.overlay{
  position:absolute;
  inset:0;
  background:rgba(0,0,0,.25);
  display:flex;
  justify-content:center;
  align-items:center;
  opacity:0;
  transition:.3s;
}

.thumb-wrap:hover .overlay{
  opacity:1;
}

.view-btn{
  color:#fff;
  font-weight:700;
}

.card-body{
  padding:1rem;
}

.art-title{
  font-weight:800;
}

.art-meta{
  opacity:.6;
  margin-top:.25rem;
}

.action-row{
  display:flex;
  gap:.6rem;
  margin-top:1rem;
  flex-wrap:wrap;
}

.circle-btn{
  display:flex;
  align-items:center;
  gap:.45rem;
  padding:.55rem .8rem;
  border-radius:999px;
  background:rgba(255,255,255,.05);
}

.circle-btn i{
  font-size:1.05rem;
}

.saved{
  color:#f59e0b;
}

/* TikTok Like */
.heart-wrap{
  position:relative;
}

.heart-icon{
  color:#94a3b8;
}

.heart-icon.active{
  color:#ff2d55;
}

.heart-icon.burst{
  animation:pop .55s ease;
}

.particle{
  position:absolute;
  color:#ff2d55;
  font-size:.7rem;
  animation:float .65s forwards;
}

.p1{left:-8px;top:0;}
.p2{right:-8px;top:-2px;}
.p3{left:4px;top:-10px;}

@keyframes pop{
  0%{transform:scale(.4);}
  50%{transform:scale(1.5);}
  100%{transform:scale(1);}
}

@keyframes float{
  from{opacity:1;transform:translateY(0);}
  to{opacity:0;transform:translateY(-22px);}
}
</style>