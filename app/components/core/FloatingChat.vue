<template>
  <div v-if="user">
    <!-- The Floating Button -->
    <UButton
      class="fixed bottom-6 right-6 z-50 rounded-full shadow-2xl h-14 w-14 flex items-center justify-center bg-primary-600 hover:bg-primary-500 hover:scale-105 transition-transform"
      @click="isOpen = !isOpen"
      color="primary"
    >
      <span class="i-heroicons-sparkles text-2xl text-white"></span>
    </UButton>

    <!-- The Chat Panel -->
    <Transition name="slide-fade">
      <div 
        v-if="isOpen" 
        class="fixed bottom-24 right-6 w-80 h-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-40 flex flex-col border border-gray-100 dark:border-gray-700 overflow-hidden"
      >
        <div class="bg-primary-600 p-4 text-white flex justify-between items-center">
          <h3 class="font-bold flex items-center gap-2">
            <span class="i-heroicons-cpu-chip"></span> AI Assistant
          </h3>
          <button @click="isOpen = false" class="hover:bg-primary-500 rounded p-1">
            <span class="i-heroicons-x-mark"></span>
          </button>
        </div>
        
        <div class="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900/50 space-y-4">
          <div class="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg rounded-tl-none w-[80%] text-sm">
            Hello! I am Rama AI. I can help you generate captions, suggest tags for your art, or offer stylistic advice.
          </div>
          <div v-for="(msg, i) in messages" :key="i" class="p-3 rounded-lg text-sm" :class="[msg.role === 'user' ? 'bg-primary-100 dark:bg-primary-900 rounded-tr-none ml-auto w-[80%]' : 'bg-gray-200 dark:bg-gray-700 rounded-tl-none w-[80%]']">
            {{ msg.content }}
          </div>
        </div>

        <div class="p-3 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
          <UInput 
            v-model="input" 
            placeholder="Ask about your artwork..." 
            @keyup.enter="sendMessage"
            class="w-full"
            icon="i-heroicons-paper-airplane"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const isOpen = ref(false)
const input = ref('')
const messages = ref([])

const sendMessage = () => {
  if (!input.value.trim()) return
  messages.value.push({ role: 'user', content: input.value })
  const userText = input.value
  input.value = ''
  
  // Fake AI response
  setTimeout(() => {
    messages.value.push({ 
      role: 'ai', 
      content: `I can certainly help you with "${userText}". Here is a generated caption suggestion: "Ethereal pathways of the mind, painted in strokes of gold and violet."` 
    })
  }, 1000)
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
