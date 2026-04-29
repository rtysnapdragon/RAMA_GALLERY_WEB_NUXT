<template>
<section class="gallery-page">

  <!-- Hero -->
  <div class="gallery-hero">
    <div class="hero-bg"></div>

    <div class="hero-content">
      <p class="hero-badge">
        ✦ {{ $t('curated_collection') }}
      </p>

      <h1 class="page-title">
        {{ $t('gallery') }}
      </h1>

      <p class="hero-desc">
        {{ tBy({
          en:'Discover premium artworks, modern Khmer creativity, and timeless visual stories.',
          km:'ស្វែងរកស្នាដៃសិល្បៈដ៏ប្រណិត សិល្បៈខ្មែរទំនើប និងរឿងរ៉ាវតាមរូបភាពដ៏អស្ចារ្យ។'
        }) }}
      </p>

      <div class="hero-actions">
        <button class="btn-primary">
          {{ tBy({ en:'Explore Now', km:'ស្វែងរកឥឡូវ' }) }}
        </button>

        <button class="btn-ghost">
          {{ tBy({ en:'Featured Artists', km:'សិល្បករឆ្នើម' }) }}
        </button>
      </div>
    </div>
  </div>

  <!-- Filter -->
  <div class="filter-bar">
    <button class="filter active">All</button>
    <button class="filter">Painting</button>
    <button class="filter">Digital</button>
    <button class="filter">Photography</button>
    <button class="filter">Sculpture</button>
  </div>

  <!-- Masonry Grid -->
  <div class="gallery-grid">

    <NuxtLink
      v-for="i in 9"
      :key="i"
      :to="localePath(`/gallery/artwork-${i}`)"
      class="art-card group"
    >
      <div class="thumb-wrap">
        <img
          :src="`https://picsum.photos/600/80${i}`"
          :alt="`Artwork ${i}`"
          class="thumb"
        />

        <div class="overlay">
          <span class="view-btn">
            {{ tBy({ en:'View Artwork', km:'មើលស្នាដៃ' }) }}
          </span>
        </div>
      </div>

      <div class="card-body">
        <h3 class="art-title">
          Artwork {{ i }}
        </h3>

        <p class="art-meta">
          by Rama Artist
        </p>

        <div class="card-footer">
          <!-- <span>❤️ {{liked[i] ? (liked[i] + 1) : i}}</span> -->
            <!-- Heart Save Click -->
          <button
            class="like-btn"
            @click.prevent="toggleLike(i)"
            :aria-label="liked[i] ? 'Unlike' : 'Like'"
          >
            <span class="heart-wrap">

              <i
                class="ri-heart-3-fill heart-icon"
                :class="{
                  active: liked[i],
                  burst: burst[i]
                }"
              ></i>

              <!-- floating particles -->
              <span
                v-if="burst[i]"
                class="particle p1"
              >❤</span>

              <span
                v-if="burst[i]"
                class="particle p2"
              >❤</span>

              <span
                v-if="burst[i]"
                class="particle p3"
              >❤</span>
              <span class="count">
                {{ likes[i] ?? i }}
              </span>
            </span>
          </button>
          <span  class="view-box"><i class="ri-eye-line"></i>{{ 900 + i }}</span>
        </div>
      </div>
    </NuxtLink>
  </div>

</section>
</template>


<script setup>
const route = useRoute()
const localePath = useLocalePath()
const slug = route.params.slug
console.log(" SLUG=-----> ", slug); 

const title = String(slug).replaceAll('-', ' ')
console.log(" Title=-----> ", title);
const liked = ref({})
const likes = ref({})
const burst = ref({})

const toggleLike = (id) => {
  if (likes.value[id] === undefined) {
    likes.value[id] = id
  }

  if (liked.value[id]) {
    liked.value[id] = false
    likes.value[id]--
    return
  }

  liked.value[id] = true
  likes.value[id]++

  /* trigger tiktok burst animation */
  burst.value[id] = true

  setTimeout(() => {
    burst.value[id] = false
  }, 650)
}
// useHead({
//   link: [
//     {
//       rel: 'alternate',
//       hreflang: 'en',
//       href: 'https://ramagallery.angkordragon.space/en'
//     },
//     {
//       rel: 'alternate',
//       hreflang: 'km',
//       href: 'https://ramagallery.angkordragon.space/km'
//     },
//     {
//       rel: 'canonical',
//       href: 'https://ramagallery.angkordragon.space/gallery/sunset-angkor'
//     }
//   ]
// })

useSeoMeta({
  title: 'Gallery',
  description: 'Explore premium artworks on RamaGallery.',
  ogTitle: 'Gallery',
  ogDescription: 'Explore premium artworks on RamaGallery.',
  ogUrl: 'https://ramagallery.angkordragon.space/gallery',
  ogImage: '/og-image.jpg'
})

useHead({
  link: [
    {
      rel: 'canonical',
      href: 'https://ramagallery.angkordragon.space/gallery'
    },
    {
      rel: 'alternate',
      hreflang: 'en',
      href: 'https://ramagallery.angkordragon.space/en/gallery'
    },
    {
      rel: 'alternate',
      hreflang: 'km',
      href: 'https://ramagallery.angkordragon.space/km/gallery'
    }
  ]
})
</script>

<style lang="scss" scoped>
.gallery-page{
  @apply px-4 md:px-8 lg:px-12 py-10 max-w-7xl mx-auto;
}

/* HERO */
.gallery-hero{
  position: relative;
  overflow: hidden;
  border-radius: 32px;
  padding: 5rem 2rem;
  margin-bottom: 2rem;
  background: linear-gradient(135deg,#111827,#0f172a,#1e1b4b);
}

.hero-bg{
  position:absolute;
  inset:0;
  background:
    radial-gradient(circle at top right, rgba(255,255,255,.12), transparent 35%),
    radial-gradient(circle at bottom left, rgba(99,102,241,.25), transparent 30%);
}

.hero-content{
  position:relative;
  z-index:2;
  max-width:700px;
}

.hero-badge{
  display:inline-block;
  padding:.45rem .9rem;
  border-radius:999px;
  background:rgba(255,255,255,.08);
  color:white;
  font-size:.85rem;
  margin-bottom:1rem;
}

.page-title{
  font-size: clamp(2.2rem, 5vw, 4.8rem);
  font-weight: 800;
  color:white;
  line-height:1.05;
}

.hero-desc{
  margin-top:1rem;
  color:rgba(255,255,255,.75);
  font-size:1.05rem;
  max-width:620px;
}

.hero-actions{
  display:flex;
  gap:1rem;
  flex-wrap:wrap;
  margin-top:1.8rem;
}

.btn-primary{
  padding:.95rem 1.3rem;
  border-radius:16px;
  color:white;
  font-weight:700;
  background:linear-gradient(90deg,#6366f1,#ec4899);
}

.btn-ghost{
  padding:.95rem 1.3rem;
  border-radius:16px;
  color:white;
  font-weight:700;
  border:1px solid rgba(255,255,255,.18);
  background:rgba(255,255,255,.04);
}

/* FILTER */
.filter-bar{
  display:flex;
  gap:.8rem;
  overflow:auto;
  padding-bottom:.5rem;
  margin-bottom:1.8rem;
}

.filter{
  padding:.75rem 1rem;
  border-radius:999px;
  white-space:nowrap;
  background:var(--card);
  border:1px solid var(--border);
}

.filter.active{
  background:linear-gradient(90deg,#6366f1,#ec4899);
  color:white;
  border:none;
}

/* GRID */
.gallery-grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
  gap:1.25rem;

}

.art-card{
  border-radius:26px;
  overflow:hidden;
  background:var(--card);
  border:1px solid var(--border);
  transition:.35s ease;
}

.art-card:hover{
  transform:translateY(-8px);
  box-shadow:0 24px 60px rgba(0,0,0,.12);
}

.thumb-wrap{
  position:relative;
  overflow:hidden;
}

.thumb{
  width:100%;
  height:320px;
  object-fit:cover;
  transition:.6s ease;
}

.art-card:hover .thumb{
  transform:scale(1.08);
}

.overlay{
  position:absolute;
  inset:0;
  display:flex;
  align-items:center;
  justify-content:center;
  background:rgba(0,0,0,.35);
  opacity:0;
  transition:.3s ease;
}

.art-card:hover .overlay{
  opacity:1;
}

.view-btn{
  padding:.8rem 1rem;
  border-radius:14px;
  color:white;
  font-weight:700;
  background:rgba(255,255,255,.15);
  backdrop-filter:blur(10px);
}

.card-body{
  padding:1rem 1rem 1.2rem;
}

.art-title{
  font-size:1.15rem;
  font-weight:800;
}

.art-meta{
  opacity:.65;
  margin-top:.3rem;
}

.card-footer{
  display:flex;
  justify-content:space-between;
  margin-top:1rem;
  font-size:.92rem;
  opacity:.75;
  align-items:center;
}

.like-btn{
  display:flex;
  align-items:center;
  gap:.45rem;
  padding:.55rem .8rem;
  border-radius:999px;
  transition:.25s ease;
  background:rgba(255,255,255,.04);
}

.like-btn:hover{
  transform:translateY(-2px);
}

.like-btn i{
  font-size:1.1rem;
  color:#9ca3af;
  transition:.25s ease;
}

.like-btn i.active{
  color:#ef4444;
  transform:scale(1.15);
}

.view-box{
  display:flex;
  align-items:center;
  gap:.45rem;
  opacity:.75;
}

.like-btn{
  display:flex;
  align-items:center;
  gap:.55rem;
  padding:.55rem .85rem;
  border-radius:999px;
  background:rgba(255,255,255,.05);
  transition:.25s ease;
}

.like-btn:hover{
  transform:translateY(-2px);
}

.heart-wrap{
  position:relative;
  width:22px;
  height:22px;
  display:grid;
  place-items:center;
}

.heart-icon{
  font-size:1.25rem;
  color:#94a3b8;
  transition:.25s ease;
}

.heart-icon.active{
  color:#ff2d55;
}

.heart-icon.burst{
  animation:tiktok-pop .55s cubic-bezier(.2,.8,.2,1);
}

/* particles */
.particle{
  position:absolute;
  font-size:.75rem;
  color:#ff2d55;
  pointer-events:none;
  animation:float-up .65s ease forwards;
}

.p1{
  left:-8px;
  top:2px;
}

.p2{
  right:-8px;
  top:-2px;
  animation-delay:.05s;
}

.p3{
  top:-10px;
  left:6px;
  animation-delay:.08s;
}

.count{
  font-weight:600;
}

@keyframes tiktok-pop{
  0%{
    transform:scale(.4);
  }
  40%{
    transform:scale(1.45);
  }
  70%{
    transform:scale(.95);
  }
  100%{
    transform:scale(1);
  }
}

@keyframes float-up{
  0%{
    opacity:1;
    transform:translateY(0) scale(.8);
  }
  100%{
    opacity:0;
    transform:translateY(-22px) scale(1.35);
  }
}
</style>