<template>
  <div>
    <!-- The Notification Toggle -->
    <button
      class="fixed bottom-6 left-6 z-50 rounded-full shadow-lg h-12 w-12 flex items-center justify-center bg-white dark:bg-gray-800 hover:scale-105 transition-transform border dark:border-gray-700"
      @click="isOpen = !isOpen"
      color="gray"
      variant="ghost"
    >
      <div class="relative">
        <span class="i-heroicons-bell text-xl text-gray-700 dark:text-gray-200"></span>
        <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 flex h-3 w-3">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      </div>
    </button>

    <!-- Slide-in Panel from left -->
    <Transition name="slide-right">
      <div 
        v-if="isOpen" 
        @click.self="isOpen = false"
        class="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-800 shadow-2xl z-[1000] border-r border-gray-100 dark:border-gray-700 flex flex-col"
      >
        <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900 border-r-0">
          <h3 class="font-bold text-lg flex items-center gap-2">
            <span class="ri-notification-4-fill"></span> Notifications
          </h3>
          <button @click="isOpen = !isOpen" class="hover:bg-gray-200 dark:hover:bg-gray-700 rounded p-1">
            <span class="ri-close-line text-xl text-gray-700 dark:text-gray-200"></span>
          </button>
        </div>
        
        <div class="flex-1 overflow-y-auto">
          <!-- Notification Items list -->
          <div v-if="notifications.length === 0" class="p-8 text-center text-gray-400">
            No new notifications.
          </div>
          <div 
            v-for="(note, i) in notifications" 
            :key="i"
            class="p-4 border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
          >
            <div class="font-semibold text-sm">{{ note.title }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ note.msg }}</div>
            <div class="text-[10px] text-primary-500 mt-2 font-mono">{{ note.time }}</div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)
const unreadCount = ref(2)

// In a real app with Supabase Realtime, this is populated via WebSocket channel
const notifications = ref([
  { title: 'New Like!', msg: 'Someone liked your "Ethereal Pathways" artwork.', time: 'Just now' },
  { title: 'Comment', msg: 'Great use of colors here! Very inspiring.', time: '2 mins ago' }
])
</script>

<style scoped>
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.35s ease cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>
