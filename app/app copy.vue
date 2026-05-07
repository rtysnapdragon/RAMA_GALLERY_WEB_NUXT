<template>
  <div class="transition-colors duration-300">
    <NuxtLayout>
      <NuxtPage />

      <!-- Global Components -->
      <FloatingChat />
      <NotificationPanel />
      <NotificationToast />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useHead } from '#imports'

const auth = useAuthStore()
const notification = useNotificationStore()

/* ------------------------------------------
SEO TITLE
------------------------------------------ */
useHead({
  titleTemplate: (titleChunk) =>
    titleChunk
      ? `${titleChunk} - RamaGallery`
      : 'RamaGallery - Artist Portfolio Platform'
})

/* ------------------------------------------
OPTIONAL SUPABASE TEST
(remove if unused)
------------------------------------------ */
const todos = ref<any[]>([])

async function getTodos() {
  try {
    const { data } = await supabase
      .from('todos')
      .select()

    todos.value = data || []
  } catch (error) {
    console.log(error)
  }
}

onMounted( async () => {
   auth.initFromStorage()
  //  notification.initSound()

  // if (auth.token) {
  //   await notification.init(auth.token)
  // }
  getTodos()
})

/* ------------------------------------------
GLOBAL AUTH -> NOTIFICATION AUTO SYNC
------------------------------------------ */
watch(
  () => auth.token,
  async (token, oldToken) => {
    /* login / refresh token */
    if (token && token !== oldToken) {
      await notification.init(token)
      notification.initSound()
      return
    }

    /* logout */
    if (!token) {
      notification.reset()
    }
  },
  { immediate: true }
)

/* ------------------------------------------
TAB ACTIVE = REFRESH
------------------------------------------ */
if (import.meta.client) {
  window.addEventListener('focus', () => {
    if (auth.token) {
      notification.fetchNotifications()
    }
  })

  window.addEventListener('online', () => {
    if (auth.token) {
      notification.connectRealtime()
      notification.fetchNotifications()
    }
  })

  window.addEventListener('beforeunload', () => {
    notification.cleanup()
  })
}
</script>