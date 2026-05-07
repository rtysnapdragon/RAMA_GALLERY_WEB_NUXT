<template>
  <div class="chat-widget">
    <!-- Floating Button -->
    <button 
      class="chat-widget__button" 
      @click="toggleChat"
      :class="{ 'chat-widget__button--active': isOpen }"
    >
      <svg v-if="!isOpen" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="currentColor"/>
      </svg>
      <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
      </svg>
    </button>

    <!-- Chat Panel -->
    <Transition name="slide">
      <div v-if="isOpen" class="chat-widget__panel">
        <div class="chat-widget__header">
          <h3>{{ tBy({en:'RamaGallery Assistant', km:'រាមារ៉ា ជំនួយការ'}) }}</h3>
          <p> {{tBy({en:'Ask me about artworks, blogs, or gallery info', km:'សួរខ្ញុំអំពីស្នាដៃ ផុស ឬព័ត៌មានវិចិត្រសាលា'})}} </p>
        </div>

        <div class="chat-widget__messages" ref="messagesContainer">
          <div 
            v-for="(message, index) in messages" 
            :key="index"
            :class="['message', `message--${message.role}`]"
          >
            <div class="message__avatar">
              <i :class="message.role === 'user' ? 'fas fa-user' : 'fas fa-robot'"></i>
            </div>
            <div class="message__content" v-html="formatMessage(message.content)"></div>
          </div>
          
          <div v-if="isLoading" class="message message--assistant">
            <div class="message__avatar"><i class="fas fa-robot"></i></div>
            <div class="message__content">
              <div class="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        </div>

        <div class="chat-widget__input">
          <textarea
            v-model="userInput"
            @keydown.enter.prevent="sendMessage"
            :placeholder="tBy({en:'Ask about RamaGallery...', km:'សួរខ្ញុំអំពីវិចិត្រសាលារាមារ៉ា...'})"
            rows="2"
            :disabled="isLoading"
          ></textarea>
          <button 
            @click="sendMessage" 
            :disabled="!userInput.trim() || isLoading"
          >
            {{tBy({en:'Send', km:'ផ្ញើ'})}}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'

const isOpen = ref(false)
const userInput = ref('')
const isLoading = ref(false)
const currentLanguage = ref('en') // Track current conversation language

const messages = ref([
  {
    role: 'assistant',
    content: tBy({en:'Hello! I\'m your RamaGallery assistant. I can help you learn about artworks, navigate the gallery, or answer questions about our content. What would you like to know?', km:'សួស្តី! ខ្ញុំជាជំនួយការរបស់វិចិត្រសាលារាមារ៉ា។ ខ្ញុំអាចជួយអ្នករៀនអំពីស្នាដៃ ណែនាំអ្នកអំពីវិចិត្រសាលា ឬឆ្លើយសំណួរអំពីសកម្មភាពរបស់យើង។ តើអ្នកចង់ដឹងអ្វីខ្លះ?'})
  }
])
const messagesContainer = ref(null)

// Scroll to bottom of messages
const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Format message with markdown-like styling
const formatMessage = (content) => {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
}

// Toggle chat panel
const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    scrollToBottom()
  }
}

// Send message to OpenRouter API
const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return

  const userMessage = userInput.value.trim()
  messages.value.push({ role: 'user', content: userMessage })
  userInput.value = ''
  isLoading.value = true
  scrollToBottom()

  try {
    // Prepare conversation context
    const conversationHistory = messages.value.slice(-10).map(msg => ({
      role: msg.role,
      content: msg.content
    }))

    // System prompt for RamaGallery context // Enhanced system prompt for multilingual support
 const systemPrompt = `You are an AI assistant for RamaGallery, an artist's personal website.
    
    LANGUAGE CAPABILITIES:
    - You can communicate fluently in Khmer (ភាសាខ្មែរ), English, and many other languages
    - Always respond in the same language the user used to ask the question
    - For Khmer language: use proper Khmer Unicode script, honorifics, and cultural context
    
    YOUR ROLE:
    - Help visitors with information about artworks, their meanings, and techniques
    - Navigate the gallery and understand the artist's style
    - Answer questions about blog posts, comments, and reactions
    - Provide insights into the creative process
    - Help with gallery features (likes, shares, comments)
    
    Be knowledgeable, friendly, and specific to RamaGallery. Reference actual artworks and content when possible.
    Keep responses concise but informative.`

    const response = await $fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
        'X-Title': 'RamaGallery Chat'
      },
      body: {
        // model: 'openai/gpt-3.5-turbo',
            // RECOMMENDED: Best for Khmer
        model: 'qwen/qwen-3.5-max',
        
        // Alternative options (uncomment to use):
        // model: 'meta-llama/llama-4-maverick',  // Great multilingual support
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 500
      }
    })

    const assistantMessage = response.choices[0].message.content
    messages.value.push({ role: 'assistant', content: assistantMessage })
    
    // Track user engagement (you can send this to your analytics)
    trackUserEngagement(userMessage, assistantMessage)
    
  } catch (error) {
    console.error('Chat error:', error)
    messages.value.push({ 
      role: 'assistant', 
      content: `<span style="color:red">${tBy({en:'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.', km:'ខ្ញុំសូមទោស ប៉ុន្តែខ្ញុំមិនអាចភ្ជាប់ទំនាក់ទំនងបានទេ។ សូមព្យាយាមម្ដងទៀតក្នុងពេលឆាប់ៗនេះ។'}) }</span>`
    })
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

// Auto-detect user's language preference
const detectUserLanguage = (text) => {
  // Check for Khmer Unicode range
  const khmerRegex = /[\u1780-\u17FF\u19E0-\u19FF]/;
  const hasKhmer = khmerRegex.test(text);
  
  // Check for other languages if needed
  if (hasKhmer) return 'km';
  
  // Default to English
  return 'en';
}

// Track user interactions (optional)
const trackUserEngagement = (question, answer) => {
  // You can send this to your Django backend for analytics
  if (process.client) {
    const event = new CustomEvent('chat-interaction', {
      detail: { question, answer, timestamp: new Date().toISOString() }
    })
    window.dispatchEvent(event)
  }
}

// Load documents from your backend
const loadGalleryDocuments = async () => {
  try {
    const documents = await $fetch('/api/gallery/documents')
    // Store documents for context (optional)
    console.log(tBy({en:`Gallery documents loaded: ${documents.length}`, km:`ផ្ទុកឯកសារវិចិត្រសាលាបានជោគជ័យ: ${documents.length}`, error}))
  } catch (error) {
    console.log(tBy({en:'Failed to load documents:', km:'មិនអាចផ្ទុកឯកសារបានទេ។', error}))
  }
}

onMounted(() => {
  loadGalleryDocuments()
})
</script>

<style lang="scss" scoped>
.chat-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;

  &__button {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    &:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }

    &--active {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    svg {
      width: 28px;
      height: 28px;
    }
  }

  &__panel {
    position: absolute;
    bottom: 80px;
    right: 0;
    width: 380px;
    height: 500px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: slideIn 0.3s ease;
  }

  &__header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 16px 20px;
    
    h3 {
      margin: 0 0 4px 0;
      font-size: 18px;
    }
    
    p {
      margin: 0;
      font-size: 12px;
      opacity: 0.9;
    }
  }

  &__messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    background: #f8f9fa;
  }

  &__input {
    padding: 16px;
    background: white;
    border-top: 1px solid #e0e0e0;
    display: flex;
    gap: 12px;

    textarea {
      flex: 1;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 8px 12px;
      font-family: inherit;
      font-size: 14px;
      resize: none;
      outline: none;

      &:focus {
        border-color: #667eea;
      }

      &:disabled {
        background: #f5f5f5;
      }
    }

    button {
      padding: 8px 20px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;

      &:hover:not(:disabled) {
        background: #5a67d8;
        transform: translateY(-1px);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }
}

.message {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  animation: fadeIn 0.3s ease;

  &__avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #e0e0e0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }

  &__content {
    flex: 1;
    padding: 10px 14px;
    border-radius: 12px;
    font-size: 14px;
    line-height: 1.5;
  }

  &--user {
    flex-direction: row-reverse;

    .message__content {
      background: #667eea;
      color: white;
    }
  }

  &--assistant {
    .message__content {
      background: white;
      color: #333;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }
  }
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 4px 0;

  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #999;
    animation: typing 1.4s infinite;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
}

// Animations
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

// Responsive
@media (max-width: 480px) {
  .chat-widget {
    bottom: 10px;
    right: 10px;

    &__panel {
      width: calc(100vw - 20px);
      height: calc(100vh - 100px);
      right: 0;
      bottom: 70px;
    }
  }
}
</style>