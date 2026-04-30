<template>
  <div class="transition-colors duration-300">
    <NuxtLayout>
      <NuxtPage />
      <FloatingChat />
      <!-- <FloatingTelegramChat /> -->
      <NotificationPanel />
    </NuxtLayout>
    <!-- <UNotifications />
    <ul>
      <li v-for="todo in todos" :key="todo.id">{{ todo.name }}</li>
    </ul> -->
  </div>
</template>

<script setup>
import { useHead } from '#imports'
import { ref, onMounted } from 'vue'
const auth = useAuthStore()
const notification = useNotificationStore()

useHead({
  titleTemplate: (titleChunk) =>
    titleChunk
      ? `${titleChunk} - RamaGallery`
      : 'RamaGallery - Artist Portfolio Platform'
})

const todos = ref([])

async function getTodos() {
  const { data } = await supabase.from('todos').select()
  todos.value = data || []
}
onMounted(() => {
  getTodos()
})

watch(
  () => auth.token,
  async (token) => {
    if (token) {
      await notification.init(token)
    } else {
      notification.reset()
    }
  },
  { immediate: true }
)
</script>
