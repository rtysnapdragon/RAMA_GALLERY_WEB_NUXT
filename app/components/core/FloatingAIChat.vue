<template>
  <div class="fixed bottom-6 right-6 z-[100]">
    <div class="relative">
      <!-- Chat Panel -->
      <transition 
        enter-active-class="transition ease-out duration-300"
        enter-from-class="opacity-0 translate-y-10 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 translate-y-10 scale-95"
      >
        <div v-if="isOpen" class="absolute bottom-16 right-0 w-80 h-96 premium-glass rounded-2xl shadow-2xl border border-[var(--accent-purple)] flex flex-col overflow-hidden">
          <div class="bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-gold)] p-4 text-white font-bold flex justify-between items-center">
            <span>{{ tBy({en: 'AI Assistant', km: 'ជំនួយការ AI'}) }}</span>
            <button @click="isOpen = false" class="hover:text-amber-200"><UIcon name="i-heroicons-x-mark-20-solid" class="w-5 h-5"/></button>
          </div>
          <div class="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
            <div class="bg-[var(--bg-secondary)] p-3 rounded-xl self-start text-sm border border-[var(--border-color)]">
              Hello! I'm your gallery assistant. Need help finding artworks or styling suggestions?
            </div>
            <!-- Stub for user messages -->
          </div>
          <div class="p-3 border-t border-[var(--border-color)] bg-[var(--bg-primary)]">
            <div class="relative flex items-center">
              <input type="text" :placeholder="tBy({en: 'Ask me anything...', km: 'សួរខ្ញុំអ្វីមួយ...'})" class="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-[var(--accent-purple)]" />
              <button class="absolute right-2 p-1 text-[var(--accent-purple)] hover:text-[var(--accent-gold)] transition-colors">
                <i class="iconify icon:ph:paper-plane-tilt-fill w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- Floating Button -->
      <button 
        @click="isOpen = !isOpen"
        class="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-gold)] shadow-[0_0_20px_rgba(124,58,237,0.5)] flex items-center justify-center text-white transition-transform duration-300 hover:scale-110 active:scale-95"
      >
        <UIcon :name="isOpen ? 'i-heroicons-chat-bubble-left-ellipsis-solid' : 'i-heroicons-sparkles-solid'" class="w-7 h-7" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false)
</script>
