<template>
  <div class="ai-float-root">
    <!-- Chat panel -->
    <Transition name="slide-fade ai-panel">
      <div v-if="ui.aiAssistantOpen" class="ai-panel">
        <div class="ai-panel-header">
          <div class="ai-header-left">
            <div class="ai-avatar">ར</div>
            <div>
              <p class="ai-name">RamaAI</p>
              <p class="ai-status">
                <span class="status-dot" />
                Online
              </p>
            </div>
          </div>
          <button class="ai-close" @click="ui.aiAssistantOpen = false" aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div ref="messagesEl" class="ai-messages">
          <div
            v-for="(msg, i) in messages"
            :key="i"
            :class="['ai-msg', msg.role]"
          >
            <div v-if="msg.role === 'assistant'" class="msg-avatar">ར</div>
            <div class="msg-bubble">{{ msg.content }}</div>
          </div>

          <div v-if="loading" class="ai-msg assistant">
            <div class="msg-avatar">ར</div>
            <div class="msg-bubble typing">
              <span /><span /><span />
            </div>
          </div>
        </div>

        <!-- Quick prompts -->
        <div v-if="messages.length <= 1" class="ai-quick">
          <button v-for="q in quickPrompts" :key="q" class="quick-btn" @click="sendMessage(q)">
            {{ q }}
          </button>
        </div>

        <div class="ai-input-row">
          <input
            v-model="input"
            type="text"
            class="ai-input"
            :placeholder="t('ai.placeholder')"
            @keydown.enter="sendMessage()"
          />
          <button class="ai-send" :disabled="!input.trim() || loading" @click="sendMessage()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
    </Transition>

    <!-- Floating button -->
    <button
      class="ai-fab"
      :class="{ open: ui.aiAssistantOpen }"
      :aria-label="$t('assistant')"
      :data-tooltip="!ui.aiAssistantOpen ? $t('assistant') : undefined"
      @click="ui.toggleAIAssistant()"
    >
      <span v-if="!ui.aiAssistantOpen" class="fab-icon">✦</span>
      <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M18 6 6 18M6 6l12 12"/>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const ui = useUIStore()

interface Message { role: 'user' | 'assistant'; content: string }

const messages = ref<Message[]>([
  {
    role: 'assistant',
    content: locale.value === 'km'
      ? 'សួស្តី! ខ្ញុំជា RamaAI — ជំនួយការ AI របស់ RamaGallery។ ខ្ញុំអាចជួយអ្នករុករកវិចិត្រសាល ណែនាំស្នាដៃ ឬឆ្លើយសំណួររបស់អ្នកបាន!'
      : 'Hello! I\'m RamaAI — your guide to RamaGallery. I can help you explore artworks, find artists, or answer any questions about the platform!'
  }
])
const input = ref('')
const loading = ref(false)
const messagesEl = ref<HTMLElement | null>(null)

const quickPrompts = computed(() => locale.value === 'km' ? [
  'ណែនាំស្នាដៃដ៏ពេញនិយម',
  'តើអ្នកណាជាវិចិត្រករល្អបំផុត?',
  'ខ្ញុំចង់ចូលរួម RamaGallery',
] : [
  'Show me featured artworks',
  'Who are the top artists?',
  'How do I join as an artist?',
])

const aiResponses: Record<string, string> = {
  default: "Great question! RamaGallery features hundreds of artworks by Cambodia's finest artists — from traditional Apsara paintings to cutting-edge digital creations. Try browsing the Gallery or searching for a specific style!",
  artwork: "I recommend checking out 'Apsara in Gold' by Sophea Khun — it's one of our most celebrated pieces. You can also filter by category in the Gallery page!",
  artist: "Some of our top artists include Sophea Khun (painting), Dara Meng (photography), and Pisey Ros (digital art). Visit the Artists page to see their full portfolios!",
  join: "Joining is easy! Click 'Join' in the header to create an account. As an artist, you'll get a full portfolio page, AI tools, analytics, and access to our collector network.",
}

const getResponse = (q: string): string => {
  const lower = q.toLowerCase()
  if (lower.includes('artwork') || lower.includes('featured') || lower.includes('show')) return aiResponses.artwork
  if (lower.includes('artist') || lower.includes('top') || lower.includes('best')) return aiResponses.artist
  if (lower.includes('join') || lower.includes('register') || lower.includes('artist')) return aiResponses.join
  return aiResponses.default
}

const sendMessage = async (text?: string) => {
  const content = text ?? input.value.trim()
  if (!content || loading.value) return

  messages.value.push({ role: 'user', content })
  input.value = ''
  loading.value = true

  await nextTick()
  messagesEl.value?.scrollTo({ top: messagesEl.value.scrollHeight, behavior: 'smooth' })

  await new Promise(r => setTimeout(r, 900 + Math.random() * 600))

  messages.value.push({ role: 'assistant', content: getResponse(content) })
  loading.value = false

  await nextTick()
  messagesEl.value?.scrollTo({ top: messagesEl.value.scrollHeight, behavior: 'smooth' })
}
</script>

<style scoped lang="scss">
.ai-float-root {
  position: fixed;
  bottom: 2rem;
  right: 1.5rem;
  z-index: 180;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1rem;
}

.ai-fab {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-gold), var(--color-gold-dark));
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(200, 149, 28, 0.4);
  transition: all var(--transition);
  animation: float 6s ease-in-out infinite;

  .fab-icon {
    font-size: 1.25rem;
    line-height: 1;
  }

  &:hover {
    transform: scale(1.08) translateY(-2px);
    box-shadow: 0 8px 32px rgba(200, 149, 28, 0.5);
    animation-play-state: paused;
  }

  &.open {
    animation: none;
    background: var(--color-text-primary);
  }
}

.ai-panel {
  width: 340px;
  height: 480px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  box-shadow: 0 16px 48px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 480px) {
    width: calc(100vw - 3rem);
    height: 420px;
  }
}

.ai-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1rem 0.875rem;
  border-bottom: 1px solid var(--color-border);
  background: linear-gradient(135deg, rgba(200, 149, 28, 0.08), transparent);
}

.ai-header-left { display: flex; align-items: center; gap: 0.75rem; }

.ai-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-gold), var(--color-gold-dark));
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-family: var(--font-display);
  font-size: 1rem;
}

.ai-name { font-size: 0.875rem; font-weight: 600; color: var(--color-text-primary); }
.ai-status {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.7rem;
  color: #38a169;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #38a169;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.ai-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all var(--transition);
  &:hover { background: var(--color-bg-secondary); color: var(--color-text-primary); }
}

.ai-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.ai-msg {
  display: flex;
  gap: 0.625rem;
  align-items: flex-end;

  &.user {
    flex-direction: row-reverse;
    .msg-bubble {
      background: var(--color-gold);
      color: #fff;
      border-radius: 18px 18px 4px 18px;
    }
  }

  &.assistant .msg-bubble {
    background: var(--color-bg-secondary);
    color: var(--color-text-primary);
    border-radius: 18px 18px 18px 4px;
  }
}

.msg-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-gold), var(--color-gold-dark));
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-family: var(--font-display);
  font-size: 0.75rem;
  flex-shrink: 0;
}

.msg-bubble {
  max-width: 240px;
  padding: 0.625rem 0.875rem;
  font-size: 0.8125rem;
  line-height: 1.55;

  &.typing {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 0.75rem 1rem;

    span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--color-text-muted);
      animation: bounce 1.2s ease-in-out infinite;

      &:nth-child(2) { animation-delay: 0.2s; }
      &:nth-child(3) { animation-delay: 0.4s; }
    }
  }
}

@keyframes bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-6px); }
}

.ai-quick {
  padding: 0 0.875rem 0.625rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.quick-btn {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition);

  &:hover {
    border-color: var(--color-gold);
    color: var(--color-gold);
    background: rgba(200, 149, 28, 0.06);
  }
}

.ai-input-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-top: 1px solid var(--color-border);
}

.ai-input {
  flex: 1;
  padding: 0.625rem 0.875rem;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  font-family: var(--font-sans);
  font-size: 0.8125rem;
  color: var(--color-text-primary);
  outline: none;
  transition: border-color var(--transition);

  &:focus { border-color: var(--color-gold); }
  &::placeholder { color: var(--color-text-muted); }
}

.ai-send {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-gold);
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition);
  flex-shrink: 0;

  &:hover:not(:disabled) { background: var(--color-gold-dark); transform: scale(1.05); }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
}

.ai-panel-enter-active,
.ai-panel-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.ai-panel-enter-from,
.ai-panel-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.97);
}

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
