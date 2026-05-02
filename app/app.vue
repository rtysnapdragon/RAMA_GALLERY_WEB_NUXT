<template>
  <div class="transition-colors duration-300">
    <NuxtLayout>
      <NuxtPage />
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

useHead({
  titleTemplate: (titleChunk) =>
    titleChunk ? `${titleChunk} - RamaGallery` : 'RamaGallery - Artist Portfolio Platform',
})

onMounted(() => {
  auth.initFromStorage()
})

/* ── Auth → notification sync ── */
watch(
  () => auth.token,
  async (token, oldToken) => {
    if (token && token !== oldToken) {
      await notification.init(token)
      notification.initSound()
      return
    }
    if (!token) {
      notification.reset()
    }
  },
  { immediate: true }
)

/* ── Window events ── */
if (import.meta.client) {
  // ✅ Only refetch on focus when WS is NOT alive (e.g. user was offline)
  window.addEventListener('focus', () => {
    if (auth.token && !notification.isWsAlive) {
      notification.fetchNotifications()
    }
  })

  // ✅ On reconnect: restore WS first, fetch only if needed
  window.addEventListener('online', () => {
    if (auth.token) {
      notification.connectRealtime()
      // WS onopen will stop polling; fetch only if WS takes time
      setTimeout(() => {
        if (!notification.isWsAlive) {
          notification.fetchNotifications()
        }
      }, 1500)
    }
  })

  window.addEventListener('beforeunload', () => {
    notification.cleanup()
  })
}
</script>
