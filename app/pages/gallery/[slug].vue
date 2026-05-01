<template>
  <div class="min-h-screen bg-[var(--bg)] transition-colors duration-500">
    <!-- Back Button -->
    <button
      @click="navigateBack"
      class="fixed top-6 left-6 flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--color-gold)] transition-all group"
    >
      <span class="text-xl transition-transform group-hover:-translate-x-0.5">←</span>
      <span class="font-medium text-sm tracking-wide">{{ t('back') }}</span>
    </button>

    <div class="max-w-7xl mx-auto px-6 pt-24 pb-20">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        <!-- LEFT: Image Viewer -->
        <div class="lg:col-span-7">
          <div class="relative rounded-3xl overflow-hidden shadow-2xl bg-black group">
            <RAImage
              :src="artwork?.image_url || artwork?.Image"
              :alt="artwork?.Title"
              class="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              watermark
            />

            <!-- Fullscreen Button -->
            <button
              @click="openFullscreen"
              class="absolute bottom-6 right-6 p-4 bg-black/70 hover:bg-black/90 text-white rounded-2xl backdrop-blur-md transition-all hover:scale-110"
            >
              <span class="text-2xl">⛶</span>
            </button>

            <!-- Overlay Info -->
            <div class="absolute top-6 left-6 px-5 py-2 bg-black/60 backdrop-blur-md rounded-2xl text-white text-sm flex items-center gap-2">
              <div class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              {{ artwork?.Views?.toLocaleString() || 0 }} views
            </div>
          </div>
        </div>

        <!-- RIGHT: Metadata & Actions -->
        <div class="lg:col-span-5 space-y-8">
          <div>
            <h1 class="text-4xl lg:text-5xl font-display leading-tight text-[var(--text-primary)] tracking-tight">
              {{ artwork?.Title }}
            </h1>
            <p class="mt-3 text-[var(--text-secondary)] text-lg">
              by <span class="font-medium text-[var(--color-gold)]">{{ artwork?.Artist || 'Rama Artist' }}</span>
            </p>
          </div>

          <!-- Description -->
          <div class="prose prose-lg dark:prose-invert max-w-none">
            <p class="text-[var(--text-secondary)] leading-relaxed">
              {{ artwork?.Description }}
            </p>
          </div>

          <!-- Stats -->
          <div class="flex flex-wrap gap-6 text-sm">
            <div class="flex items-center gap-2">
              <i class="ri-heart-fill text-2xl"></i>
              <div>
                <p class="font-semibold text-xl text-[var(--text-primary)]">{{ artwork?.Likes?.toLocaleString() || 0 }}</p>
                <p class="text-xs text-[var(--muted)] -mt-1">Likes</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <i class="ri-bookmark-line text-2xl"></i>
              <div>
                <p class="font-semibold text-xl text-[var(--text-primary)]">{{ artwork?.Saves?.toLocaleString() || 0 }}</p>
                <p class="text-xs text-[var(--muted)] -mt-1">Saved</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <i class="ri-eye-line text-2xl"></i>
              <div>
                <p class="font-semibold text-xl text-[var(--text-primary)]">{{ artwork?.Views?.toLocaleString() || 0 }}</p>
                <p class="text-xs text-[var(--muted)] -mt-1">Views</p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-4 pt-4">
            <RAButton
              @click="toggleLike"
              color="red"
              variant="solid"
              size="xl"
              class="flex-1 text-base font-medium shadow-lg shadow-red-500/20"
              :label="`Like (${artwork?.Likes || 0})`"
              icon="ri-heart-fill"
            />

            <RAButton
              @click="toggleSave"
              color="amber"
              variant="outline"
              size="xl"
              class="flex-1 text-base font-medium"
              :label="`Save to Collection (${artwork?.Saves || 0})`"
              icon="ri-save-line"
            />

            <RAButton
              @click="shareArtwork"
              color="neutral"
              variant="ghost"
              size="xl"
              icon="ri-share-forward-line"
            />
          </div>

          <!-- Tags -->
          <div v-if="artwork?.Tags?.length" class="flex flex-wrap gap-2">
            <span
              v-for="tag in artwork.Tags"
              :key="tag"
              class="px-4 py-1.5 text-xs rounded-full bg-[var(--bg-secondary)] text-[var(--muted)] border border-[var(--border)] hover:border-[var(--color-gold)] transition-colors cursor-pointer"
            >
              #{{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>

  <!-- Fullscreen Viewer -->
  <FullScreenViewer
    v-model:is-open="showViewer"
    :image-src="artwork?.image_url || artwork?.Image"
    :title="artwork?.Title"
    :artist="artwork?.Artist"
    :likes="artwork?.Likes"
    :saves="artwork?.Saves"
    @update:likes="(val) => artwork.Likes = val"
    @update:saves="(val) => artwork.Saves = val"
  />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const slug = route.params.slug as string

const artwork = ref<any>(null)
const isLiked = ref(false)
const isSaved = ref(false)

const showViewer = ref(false)

const openFullscreen = () => {
  showViewer.value = true
}

const { data } = await useWeb(`artworks/${slug}`, { method: 'POST' })
artwork.value = data.value

// Optimistic Like
const toggleLike = async () => {
  if (!artwork.value) return
  const oldLikes = artwork.value.Likes
  artwork.value.Likes += 1
  isLiked.value = !isLiked.value

  const { error } = await useWeb('artworks/like', {
    method: 'POST',
    data: { ArtworkId: artwork.value.Id }
  })

  if (error.value) {
    artwork.value.Likes = oldLikes
    isLiked.value = !isLiked.value
  }
}

const toggleSave = async () => {
  if (!artwork.value) return
  const oldSaves = artwork.value.Saves
  artwork.value.Saves += 1
  isSaved.value = !isSaved.value

  const { error } = await useWeb('artworks/save', {
    method: 'POST',
    data: { ArtworkId: artwork.value.id }
  })

  if (error.value) artwork.value.Saves = oldSaves
}

const shareArtwork = () => {
  if (navigator.share) {
    navigator.share({
      title: artwork.value.Title,
      text: artwork.value.Description?.slice(0, 100),
      url: window.location.href
    })
  } else {
    navigator.clipboard.writeText(window.location.href)
    // You can add toast notification here
  }
}

const toggleFullscreen = () => {
  // Can integrate with a proper fullscreen image viewer later
  alert('Fullscreen viewer coming soon ✨')
}

const navigateBack = () => {
  navigateTo('/gallery')
}
</script>

<style scoped lang="scss">
.page-wrap {
  @apply max-w-7xl mx-auto px-6;
}

/* Use design tokens from your scss */
h1 {
  font-family: var(--font-display);
}

.prose {
  font-family: var(--font-sans);
}

/* Smooth theme transition */
* {
  transition: background-color 0.4s ease, color 0.4s ease, border-color 0.4s ease;
}
</style>