<template>
  <div class="min-h-screen bg-[var(--bg)] transition-colors duration-500">
    <!-- Back Button -->
    <button
      @click="navigateBack"
      class="fixed top-6 left-6 flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--color-gold)] transition-all group"
    >
      <span class="text-xl transition-transform group-hover:-translate-x-0.5">←</span>
      <span class="font-medium text-sm tracking-wide">{{ $t('back') }}</span>
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
              <i class="ri-calendar-line text-[var(--color-gold)]"></i>
              {{ artwork?.CreatedAt ? new Date(artwork.CreatedAt).toLocaleDateString() : 'Recent' }}
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
              <i class="ri-eye-line text-2xl text-[var(--muted)]"></i>
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
              icon="ri-heart-fill"
            />

            <RAButton
              @click="toggleSave"
              color="amber"
              variant="solid"
              size="xl"
              class="flex-1 text-base font-medium shadow-lg shadow-red-500/20"
              icon="ri-save-line"
            />

            <RAButton
              @click="shareArtwork"
              color="neutral"
              variant="ghost"
              size="xl"
              class="flex-1 text-base font-medium shadow-lg shadow-red-500/20"
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

          <!-- Comments Section -->
          <div class="pt-10 border-t border-[var(--border)] space-y-8">
            <h2 class="text-2xl font-display text-[var(--text-primary)]">
              Comments ({{ totalComments }})
            </h2>

            <!-- Comment Input -->
            <div class="flex gap-4">
              <img :src="auth.user?.Avatar || 'https://api.dicebear.com/7.x/personas/svg?seed=guest'" class="w-10 h-10 rounded-full object-cover border border-[var(--border)]" />
              <div class="flex-1 space-y-3">
                <textarea
                  v-model="newComment"
                  placeholder="Share your thoughts..."
                  class="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-4 text-sm focus:border-[var(--color-gold)] outline-none transition-all resize-none text-[var(--text-primary)]"
                  rows="3"
                  @focus="checkCommentAuth"
                ></textarea>
                <div class="flex justify-end">
                  <RAButton
                    label="Post Comment"
                    size="md"
                    :disabled="!newComment.trim()"
                    @click="postComment"
                  />
                </div>
              </div>
            </div>

            <!-- Comment List -->
            <div class="space-y-6">
              <div v-for="(c, idx) in visibleComments" :key="idx" class="flex gap-4 group animate-in fade-in slide-in-from-bottom-2 duration-500">
                <img :src="c.UserAvatar" class="w-10 h-10 rounded-full object-cover border border-[var(--border)]" />
                <div class="flex-1">
                  <div class="bg-[var(--bg-secondary)] rounded-2xl p-4 group-hover:bg-[var(--bg-card)] transition-colors">
                    <div class="flex justify-between items-center mb-1">
                      <p class="font-semibold text-sm text-[var(--text-primary)]">{{ c.UserName }}</p>
                      <p class="text-[10px] uppercase tracking-widest text-[var(--muted)]">{{ c.CreatedAt }}</p>
                    </div>
                    <p class="text-sm text-[var(--text-secondary)] leading-relaxed">{{ c.Content }}</p>
                  </div>
                </div>
              </div>

              <!-- Guest Limitation -->
              <div v-if="!auth.isLoggedIn && totalComments > 2" class="relative py-8 text-center">
                <div class="absolute inset-x-0 top-0 h-24 bg-gradient-to-t from-[var(--bg)] to-transparent pointer-events-none"></div>
                <button @click="showAuthToast" class="relative z-10 px-6 py-2 rounded-full border border-[var(--color-gold)] text-[var(--color-gold)] font-medium hover:bg-[var(--color-gold)] hover:text-black transition-all">
                  Login to view all {{ totalComments }} comments
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  <!-- Fullscreen Viewer -->
  <FullScreenViewer
    v-model="showViewer"
    :image-src="artwork?.image_url || artwork?.Image"
    :title="artwork?.Title"
    :artist="artwork?.Artist"
    :likes="artwork?.Likes"
    :saves="artwork?.Saves"
  />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string
const item_id = route.params.id as string
console.log(" Item Id = ", item_id)

const artwork = ref<any>(null)
const isLiked = ref(false)
const isSaved = ref(false)
const newComment = ref('')
const auth = useAuthStore()
const notification = useNotificationStore()

const mockComments = [
  { UserName: 'Sokha Ly', UserAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=sokha', Content: tBy({en: 'Absolutely stunning work! The gold leaf detail is incredible.',km:'អស្ចារ្យណាស់! លម្អិលមាសនេះពិតជាអស្ចារ្យណាស់។'}), CreatedAt: tBy({en: '2 days ago',km:'២ ថ្ងៃមុន'}) },
  { UserName: 'Borey Chan', UserAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=borey', Content: tBy({en: 'I love how this captures the essence of Khmer culture.',km:'ខ្ញុំស្រឡាញ់របៀបដែលនេះចាប់យកព្រលឹងនៃវប្បធម៌ខ្មែរ។'}), CreatedAt: tBy({en: '1 week ago',km:'១ សប្តាហ៍មុន'}) },
  { UserName: 'Davith', UserAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=davith', Content: tBy({en: 'The composition is perfect. Truly a masterpiece.',km:'ការតែងនិពន្ធគឺល្អឥតខ្ចោះ។ ពិតជាស្នាដៃដ៏អស្ចារ្យ។'}), CreatedAt: tBy({en: '2 weeks ago',km:'២ សប្តាហ៍មុន'}) }
]

const totalComments = computed(() => (artwork.value?.Comments?.length || 0) + mockComments.length)

const visibleComments = computed(() => {
  const all = [...(artwork.value?.Comments || []), ...mockComments]
  return auth.isLoggedIn ? all : all.slice(0, 2)
})

const showViewer = ref(false)

const openFullscreen = () => {
  showViewer.value = true
}

const { data } = await useWeb(`api/v1/artwork/detail`, { method: 'POST',data:{Slug:slug}})
artwork.value = data.value
console.log(" Artwork = ", artwork.value)

// Optimistic Like
const toggleLike = async () => {
  if (!artwork.value) return
  const oldLikes = artwork.value.Likes
  if (isLiked.value) {
    artwork.value.Likes -= 1
  } else {
    artwork.value.Likes += 1
  }
  isLiked.value = !isLiked.value
  // artwork.value.Likes += 1
  // isLiked.value = !isLiked.value

  const { error } = await useWeb('api/v1/artwork/like', {
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
  
  if (!auth.isLoggedIn) {
    showAuthToast()
    return
  }

  const oldSaves = artwork.value.Saves
  artwork.value.Saves += 1
  isSaved.value = !isSaved.value

  const { error } = await useWeb('api/v1/artworks/save', {
    method: 'POST',
    data: { ArtworkId: artwork.value.Id }
  })

  if (error.value) artwork.value.Saves = oldSaves
}

const checkCommentAuth = () => {
  if (!auth.isLoggedIn) {
    showAuthToast()
  }
}

const postComment = async () => {
  if (!auth.isLoggedIn) {
    showAuthToast()
    return
  }
  
  if (!newComment.value.trim()) return

  // In a real app, you'd call the API here
  notification.pushToast({
    Id: Date.now(),
    Message: 'Comment posted successfully!',
    Type: 'system'
  } as any)
  
  newComment.value = ''
}

const showAuthToast = () => {
  notification.pushToast({
    Id: Date.now(),
    Message: 'Please log in to continue',
    Type: 'system'
  } as any)
}

const shareArtwork = async () => {
    const { error } = await useWeb('api/v1/artworks/share', {
    method: 'POST',
    data: { ArtworkId: artwork.value.Id }
  })

  // if (error.value) return

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