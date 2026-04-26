<template>
  <div>
    <UButton
      class="fixed bottom-6 right-6 z-50 rounded-full shadow-2xl h-14 w-14 flex items-center justify-center bg-[#229ED9] hover:bg-[#1f8cc2] hover:scale-105 transition-transform"
      @click="isOpen = !isOpen"
      aria-label="Telegram"
    >
      <i class="ri-telegram-2-fill text-2xl text-white" aria-hidden="true"></i>
    </UButton>

    <Transition name="slide-fade">
      <div
        v-if="isOpen"
        class="fixed bottom-24 right-6 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-40 flex flex-col border border-gray-100 dark:border-gray-700 overflow-hidden"
      >
        <div class="bg-[#229ED9] p-4 text-white flex justify-between items-center">
          <h3 class="font-bold flex items-center gap-2">
            <i class="ri-telegram-2-fill" aria-hidden="true"></i>
            Telegram
          </h3>
          <button @click="isOpen = false" class="hover:bg-white/10 rounded p-1">
            <span class="i-heroicons-x-mark"></span>
          </button>
        </div>

        <div class="p-4 space-y-3">
          <div class="text-sm text-gray-600 dark:text-gray-300">
            {{ t('about.telegram.button') }}
          </div>

          <UInput
            v-model="message"
            :placeholder="t('about.telegram.placeholder')"
            icon="i-heroicons-chat-bubble-left-right"
            @keyup.enter="send"
          />

          <div class="flex gap-2">
            <UButton class="flex-1" color="primary" @click="send">
              {{ t('about.telegram.send') }}
            </UButton>
            <UButton
              color="gray"
              variant="soft"
              @click="openTelegram"
              class="whitespace-nowrap"
            >
              Open
            </UButton>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '#imports'

const { t } = useI18n()

const isOpen = ref(false)
const message = ref('')

// Replace with your Telegram username or bot link
const telegramUrl = 'https://t.me/'

const openTelegram = () => {
  window.open(telegramUrl, '_blank', 'noopener,noreferrer')
}

const send = () => {
  const text = message.value.trim()
  if (!text) return
  const url = `${telegramUrl}?text=${encodeURIComponent(text)}`
  window.open(url, '_blank', 'noopener,noreferrer')
  message.value = ''
}
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>

