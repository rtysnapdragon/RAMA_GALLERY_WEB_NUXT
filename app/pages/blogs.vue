<template>
  <div class="blogs-page">
    <section class="page-hero">
      <div class="container">
        <p class="section-label animate-on-scroll">{{ tBy({ en: 'Stories & Insights', km: 'រឿងរ៉ាវ' }) }}</p>
        <h1 class="page-title animate-on-scroll">{{ tBy({ en: 'The Journal', km: 'ទស្សនាវដ្តី' }) }}</h1>
        <p class="page-subtitle animate-on-scroll">{{ tBy({ en: 'Perspectives on Cambodian art, artists, and culture', km: 'ទស្សនៈលើសិល្បៈ វិចិត្រករ និងវប្បធម៌ខ្មែរ' }) }}</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <!-- Category filters -->
        <div class="filter-row">
          <button
            v-for="cat in categories"
            :key="cat"
            class="tag"
            :class="{ 'tag-gold': activeCategory === cat }"
            @click="activeCategory = cat"
          >
            {{ cat }}
          </button>
        </div>

        <div class="blogs-grid">
          <article
            v-for="(blog, i) in filteredBlogs"
            :key="blog.id"
            class="blog-card"
            :class="{ featured: blog.featured }"
          >
            <div class="blog-img">
              <RAImage :src="blog.image" :ratio="blog.featured ? '16/9' : '4/3'" />
              <span class="blog-category">{{ blog.category }}</span>
            </div>

            <div class="blog-body">
              <div class="blog-meta">
                <img :src="blog.authorAvatar || '/images/user_image_default.png'" class="author-avatar" />
                <span>{{ blog.author }}</span>
                <span class="dot">·</span>
                <span>{{ formatDate(blog.date) }}</span>
                <span class="dot">·</span>
                <span>{{ blog.readTime }} min read</span>
              </div>

              <h2 class="blog-title">
                {{ tBy(blog.title) }}
              </h2>

              <p class="blog-excerpt">
                {{ tBy(blog.excerpt) }}
              </p>

              <div class="blog-tags">
                <span v-for="tag in blog.tags" :key="tag" class="tag">
                  {{ tag }}
                </span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useScrollAnimation()
import blogsData from '~/assets/json/blogs.json'

const activeCategory = ref('All')
// const categories = ['All', 'Artist Stories', 'Technique', 'Culture', 'Market', 'AI & Art']

const blogs1 = [
  { id: 1, slug: 'reviving-hol-lboeuk', title: 'Reviving Hol Lboeuk: Ancient Silk for Modern Collectors', excerpt: 'Third-generation weaver Channary Lim explains how she is breathing new life into Cambodia\'s most endangered textile art form using natural indigo dyes.', author: 'Sreyleak Pov', authorAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=sreyleak', date: '2025-06-10', readTime: 6, category: 'Artist Stories', image: 'https://picsum.photos/seed/blog1/800/500', tags: ['silk', 'traditional', 'interview'] },
  { id: 2, slug: 'angkor-as-muse', title: 'Angkor as Muse: Why Ancient Ruins Inspire Contemporary Artists', excerpt: 'A deep dive into how the temples of Angkor continue to shape the visual language of Cambodian artists across every medium.', author: 'Ratha Sok', authorAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=ratha', date: '2025-06-03', readTime: 8, category: 'Culture', image: 'https://picsum.photos/seed/blog2/800/500', tags: ['angkor', 'inspiration', 'history'] },
  { id: 3, slug: 'ai-in-cambodian-art', title: 'AI Tools Are Changing How Cambodian Artists Work', excerpt: 'From automatic captioning to style analysis, we explore how AI is augmenting — not replacing — creative practice in the Kingdom.', author: 'Kosal Heng', authorAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=kosal', date: '2025-05-28', readTime: 5, category: 'AI & Art', image: 'https://picsum.photos/seed/blog3/800/500', tags: ['AI', 'technology', 'future'] },
  { id: 4, slug: 'collecting-cambodian-art', title: 'A Beginner\'s Guide to Collecting Cambodian Art', excerpt: 'Everything you need to know before buying your first piece — provenance, authentication, pricing, and building a meaningful collection.', author: 'Bopha Nhem', authorAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=bopha', date: '2025-05-20', readTime: 7, category: 'Market', image: 'https://picsum.photos/seed/blog4/800/500', tags: ['collecting', 'guide', 'market'] },
  { id: 5, slug: 'digital-art-cambodia', title: 'The Rise of Digital Art in Cambodia', excerpt: 'How a new generation of Khmer artists are using tablets, generative algorithms, and NFT platforms to carve out a global space.', author: 'Sreyleak Pov', authorAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=sreyleak', date: '2025-05-12', readTime: 6, category: 'Technique', image: 'https://picsum.photos/seed/blog5/800/500', tags: ['digital', 'NFT', 'generative'] },
  { id: 6, slug: 'bronze-casting-tradition', title: 'The Living Art of Khmer Bronze Casting', excerpt: 'Vireak Chhem opens his Battambang workshop to show how the 1,000-year-old lost-wax process survives in modern Cambodia.', author: 'Ratha Sok', authorAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=ratha', date: '2025-05-05', readTime: 9, category: 'Technique', image: 'https://picsum.photos/seed/blog6/800/500', tags: ['sculpture', 'bronze', 'craft'] },
]

const filteredBlogs1 = computed(() =>
  activeCategory.value === 'All' ? blogsData : blogsData.filter(b => b.category === activeCategory.value)
)

const { tBy } = useLocalData()

const categories = blogsData.categories
const blogs = blogsData.items

const filteredBlogs = computed(() => {
  if (activeCategory.value === 'All') return blogs
  return blogs.filter(b => b.category === activeCategory.value)
})
const featuredFirst = computed(() => {
  return [...filteredBlogs.value].sort((a, b) => Number(b.featured) - Number(a.featured))
})
function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

useSeoMeta({ title: 'Journal — RamaGallery', description: 'Stories, insights, and perspectives on Cambodian art.' })
</script>

<style scoped lang="scss">
.blogs-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(calc(280px - 1rem), 1fr)
  );
  gap: 1.5rem;
}
.page-hero { padding: 5rem 0 3rem; text-align: center; background: linear-gradient(to bottom, var(--color-bg-secondary), var(--color-bg)); border-bottom: 1px solid var(--color-border); }
.page-title { font-size: clamp(2rem, 5vw, 3.5rem); margin: 0.5rem 0; }
.page-subtitle { color: var(--color-text-secondary); max-width: 520px; margin: 0 auto; }

.filter-row { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2.5rem; }

.blogs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px) { grid-template-columns: 1fr; }

  .blog-card.featured {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    align-items: stretch;

    @media (max-width: 768px) { grid-template-columns: 1fr; }

    .blog-title { font-size: 1.6rem; }
    .blog-excerpt { -webkit-line-clamp: 4; }
  }
}

.blog-card {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  transition: all var(--transition);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.1);

    .blog-title { color: var(--color-gold); }
  }
}

.blog-img { position: relative; overflow: hidden; }
.blog-category {
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.25rem 0.75rem;
  background: var(--color-gold);
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border-radius: 2px;
  z-index: 5;
}

.blog-body {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.blog-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.author-avatar { width: 22px; height: 22px; border-radius: 50%; object-fit: cover; }
.author-name { color: var(--color-text-secondary); font-weight: 500; }
.dot { opacity: 0.4; }

.blog-title {
  font-family: var(--font-display);
  font-size: 1.15rem;
  color: var(--color-text-primary);
  line-height: 1.3;
  transition: color var(--transition);
}

.blog-excerpt {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.7;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.blog-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: auto;

  .tag { font-size: 0.65rem; }
}
</style>
