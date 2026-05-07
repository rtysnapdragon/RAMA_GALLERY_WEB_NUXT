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
          <p>{{ tBy({en:'Ask me about artworks, blogs, or gallery info', km:'សួរខ្ញុំអំពីស្នាដៃ ផុស ឬព័ត៌មានវិចិត្រសាលា'}) }}</p>
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

// ============ REACTIVE VARIABLES ============
const isOpen = ref(false)
const userInput = ref('')
const isLoading = ref(false)
const currentLanguage = ref('en')
const messagesContainer = ref(null)

// IMPORTANT: Define these refs that were missing!
const chatSessionId = ref(null)
const userId = ref(null)
const visitorId = ref(null)

// Messages array with initial greeting
const messages = ref([
  {
    role: 'assistant',
    content: tBy({
      en: 'Hello! I\'m your RamaGallery assistant. I can help you learn about artworks, navigate the gallery, or answer questions about our content. What would you like to know?',
      km: 'សួស្តី! ខ្ញុំជាជំនួយការរបស់វិចិត្រសាលារាមារ៉ា។ ខ្ញុំអាចជួយអ្នករៀនអំពីស្នាដៃ ណែនាំអ្នកអំពីវិចិត្រសាលា ឬឆ្លើយសំណួរអំពីសកម្មភាពរបស់យើង។ តើអ្នកចង់ដឹងអ្វីខ្លះ?'
    })
  }
])

// ============ HELPER FUNCTIONS ============

// Translation helper (add this if not already in your project)
// const tBy = (translations) => {
//   // Simple language detection based on browser or current language
//   const browserLang = typeof navigator !== 'undefined' ? navigator.language : 'en'
//   const lang = browserLang.includes('km') ? 'km' : currentLanguage.value
//   return translations[lang] || translations.en
// }

// Auto-detect user's language preference
const detectUserLanguage = (text) => {
  const khmerRegex = /[\u1780-\u17FF\u19E0-\u19FF]/
  return khmerRegex.test(text) ? 'km' : 'en'
}

// Format message with markdown-like styling
const formatMessage = (content) => {
  if (!content) return ''
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
}

// Scroll to bottom of messages
const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Toggle chat panel
const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    scrollToBottom()
  }
}

// Track user interactions (optional)
const trackUserEngagement = (question, answer) => {
  if (process.client) {
    const event = new CustomEvent('chat-interaction', {
      detail: { question, answer, timestamp: new Date().toISOString() }
    })
    window.dispatchEvent(event)
  }
}

// ============ INITIALIZATION FUNCTION ============
const initChatSession = async () => {
  try {
    // Get or create visitor ID from localStorage
    let storedVisitorId = null
    if (process.client) {
      storedVisitorId = localStorage.getItem('ramagallery_visitor_id')
      if (!storedVisitorId) {
        storedVisitorId = generateUUID()
        localStorage.setItem('ramagallery_visitor_id', storedVisitorId)
      }
    }
    
    visitorId.value = storedVisitorId
    
    // Try to connect to Django backend
    const apiBase = useRuntimeConfig?.().public?.apiBase || 'http://localhost:8000'
    
    const response = await $fetch(`${apiBase}api/v2/chat/init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        VISITOR_ID: visitorId.value,
        USER_UUID: null
      }
    }).catch(error => {
      console.warn('Backend not available, using local mode:', error)
      return null
    })
    
    if (response && response.SUCCESS) {
      chatSessionId.value = response.SESSION?.ID
      userId.value = response.USER?.ID
      
      // Load previous messages if any
      if (response.RECENT_MESSAGES && response.RECENT_MESSAGES.length > 0) {
        messages.value = response.RECENT_MESSAGES.map(msg => ({
          role: msg.ROLE?.toLowerCase(),
          content: msg.CONTENT
        }))
        scrollToBottom()
      }
      
      return true
    } else {
      // Fallback to local-only mode without backend
      console.log('Running in local-only mode (no backend connection)')
      return false
    }
  } catch (error) {
    console.warn('Failed to initialize chat session:', error)
    return false
  }
}

// Generate UUID for visitor tracking
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// ============ SEND MESSAGE FUNCTION ============
const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return

  const userMessage = userInput.value.trim()
  const detectedLang = detectUserLanguage(userMessage)
  currentLanguage.value = detectedLang
  
  // Add user message to UI
  messages.value.push({ role: 'user', content: userMessage })
  userInput.value = ''
  isLoading.value = true
  scrollToBottom()

  try {
    let assistantMessage = ''
    
    // Try to use backend if session exists
    if (chatSessionId.value && userId.value) {
      const apiBase = useRuntimeConfig?.().public?.apiBase || 'http://localhost:8000'
      
      const response = await $fetch(`${apiBase}api/v2/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          SESSION_ID: chatSessionId.value,
          USER_ID: userId.value,
          MESSAGE: userMessage,
          CONTEXT: {
            PAGE: typeof window !== 'undefined' ? window.location.pathname : '',
            REFERRER: typeof document !== 'undefined' ? document.referrer : ''
          }
        }
      }).catch(error => {
        console.error('Backend API error:', error)
        return null
      })
      
      if (response && response.SUCCESS) {
        assistantMessage = response.MESSAGE
        trackUserEngagement(userMessage, assistantMessage)
      } else {
        // Fallback to direct OpenRouter call
        assistantMessage = await callOpenRouterDirect(userMessage, detectedLang)
      }
    } else {
      // No backend session, call OpenRouter directly
      assistantMessage = await callOpenRouterDirect(userMessage, detectedLang)
    }
    
    messages.value.push({ role: 'assistant', content: assistantMessage })
    
  } catch (error) {
    console.error('Chat error:', error)
    messages.value.push({ 
      role: 'assistant', 
      content: tBy({
        en: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.',
        km: 'សូមទោស ខ្ញុំកំពុងមានបញ្ហាក្នុងការតភ្ជាប់។ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។'
      })
    })
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

// ============ DIRECT OPENROUTER CALL (Fallback) ============
const callOpenRouterDirect = async (userMessage, detectedLang) => {
  try {
    const systemPrompt = `You are an AI assistant for RamaGallery, an artist's personal website.
    
    LANGUAGE REQUIREMENTS:
    - The user's message language is: ${detectedLang === 'km' ? 'Khmer (ភាសាខ្មែរ)' : 'English'}
    - You MUST respond in EXACTLY the same language as the user
    - For Khmer language: use proper Khmer Unicode script, honorifics, and cultural context
    
    YOUR ROLE:
    - Help visitors with information about artworks, their meanings, and techniques
    - Navigate the gallery and understand the artist's style
    - Answer questions about blog posts, comments, and reactions
    - Provide insights into the creative process
    
    Be knowledgeable, friendly, and specific to RamaGallery. Keep responses concise.`

    // Get API key from runtime config or use environment variable
    const apiKey = useRuntimeConfig?.().public?.openRouterApiKey || process.env.OPENROUTER_API_KEY
    
    if (!apiKey) {
      console.warn('No OpenRouter API key found, using mock response')
      return getMockResponse(userMessage, detectedLang)
    }
    
    const response = await $fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://ramagallery.com',
        'X-Title': 'RamaGallery Chat'
      },
      body: {
        model: 'qwen/qwen-3.5-max',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 500
      }
    })
    
    return response.choices?.[0]?.message?.content || getMockResponse(userMessage, detectedLang)
    
  } catch (error) {
    console.error('OpenRouter API error:', error)
    return getMockResponse(userMessage, detectedLang)
  }
}

// ============ MOCK RESPONSE (When no API key) ============
const getMockResponse = (userMessage, detectedLang) => {
  if (detectedLang === 'km') {
    return "សូមអរគុណសម្រាប់សំណួររបស់អ្នក។ វិចិត្រសាលារាមារ៉ាមានស្នាដៃសិល្បៈខ្មែរសហសម័យ រួមទាំងគំនូររបាំអប្សរា ស្នាដៃអរូបី និងការតំឡើងចម្រុះ។ តើអ្នកចង់ដឹងបន្ថែមអំពីស្នាដៃប្រភេទណាមួយ?";
  }
  return `Thank you for your question about RamaGallery. Our gallery features contemporary Khmer art including traditional Apsara dance paintings, modern abstract works, and mixed media installations. Could you please provide more details about what specific artwork or information you're interested in?`
}

// ============ LOAD DOCUMENTS ============
const loadGalleryDocuments = async () => {
  try {
    const apiBase = useRuntimeConfig?.().public?.apiBase || 'http://localhost:8000'
    const documents = await $fetch(`${apiBase}api/v2/chat/documents`).catch(() => null)
    if (documents && documents.SUCCESS) {
      console.log(tBy({
        en: `Gallery documents loaded: ${documents.COUNT}`,
        km: `ផ្ទុកឯកសារវិចិត្រសាលាបានជោគជ័យ: ${documents.COUNT}`
      }))
    }
  } catch (error) {
    console.log(tBy({
      en: 'Failed to load documents',
      km: 'មិនអាចផ្ទុកឯកសារបានទេ។'
    }))
  }
}

// ============ LIFEHOOK ============
onMounted(async () => {
  await initChatSession()
  await loadGalleryDocuments()
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