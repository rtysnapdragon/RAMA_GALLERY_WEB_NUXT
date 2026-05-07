<template>
  <div class="mobile-navigate-bar" ref="navRef">
    <div class="nav-pill">
      <!-- Left: Language Switch (Expandable) -->
      <button class="lang-btn" @click="toggleLanguage">
        <img 
          :src="currentLang?.flag" 
          :alt="currentLang?.name" 
          class="flag-icon" 
        />
      </button>
      <!-- <button class="lang-btn" @click="toggleLanguage">
        <img 
          :src="nextLang?.flag" 
          :alt="nextLang?.name" 
          class="flag-icon" 
        />
      </button> -->

      <!-- Separator -->
      <div class="separator"></div>

      <!-- Middle: Home -->
      <NuxtLink to="/" class="nav-btn home-btn" @click="isLangExpanded = false" aria-label="Home">
        <i class="ri-home-5-line"></i>
      </NuxtLink>

      <!-- Separator -->
      <div class="separator"></div>

      <!-- Right: Owner -->
      <!-- <NuxtLink to="/admin" class="nav-btn owner-btn" @click="isLangExpanded = false" aria-label="Owner">
        <i class="ri-shield-user-line"></i>
      </NuxtLink> -->
      <button
          class="search-btn"
          :data-tooltip="t('search')"
          @click="ui.toggleSearch()"
          aria-label="Search"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
            <circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
const ui = useUIStore()
const { t, locale, setLocale } = useI18n()
const isLangExpanded = ref(false)
const navRef = ref<HTMLElement | null>(null)

const nextLang = computed(() =>
  languageOptions.find(l => l.code !== locale.value)
)
// const languageOptions = computed(() => [
//   { code: 'en', name: t('english'), flag: '/flags/gb.svg' },
//   { code: 'km', name: t('khmer'), flag: '/flags/kh.svg' },
// ])

const languageOptions = [
  { code: 'en', flag: '/flags/gb.svg', name: 'English' },
  { code: 'km', flag: '/flags/kh.svg', name: 'Khmer' },
]

const currentLang = computed(() =>
  languageOptions.find(l => l.code === locale.value)
)

const toggleLanguage = () => {
  const newLang = locale.value === 'en' ? 'km' : 'en'
  setLocale(newLang)
}
// Language options
const languageOptions1 = [
  { code: 'en', name: t('english'), flag: '/flags/gb.svg' },
  { code: 'km', name: t('khmer'), flag: '/flags/kh.svg' },
]

const handleClickOutside = (event: MouseEvent) => {
  if (isLangExpanded.value && navRef.value && !navRef.value.contains(event.target as Node)) {
    isLangExpanded.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style lang="scss" scoped>
.flag-icon {
  width: 20px;
  height: 14px;
  object-fit: cover;
  border-radius: 2px;
}

// .lang-btn {
//   padding: 4px;
//   border: none;
//   background: transparent;
//   cursor: pointer;
// }

.lang-btn.active {
  outline: 2px solid gold;
}

// Mobile responsive only (hidden on desktop)
@media (min-width: 768px) {
  .mobile-navigate-bar {
    display: none !important;
  }
}

// Default shown on mobile
.mobile-navigate-bar {
  position: fixed;
  bottom: 1.5rem; // Matches AIAssistantFloat bottom
  left: 50%;
  transform: translateX(-50%);
  z-index: 9998;
  display: block; 
}

.nav-pill {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  padding: 5px;
  background: var(--panel-bg);
  border: 1px solid var(--glass-border);
  border-radius: 99px;
  box-shadow: var(--glass-shadow);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.lang-switch {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);

  &.expanded {
    gap: 8px;
  }
}

.lang-btn, .nav-btn {
  width: 30px !important;
  height: 30px !important;
  border-radius: 50%;
  background: transparent;
  color: var(--color-text-secondary);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
  opacity: 1;
  transform: scale(1);
  flex-shrink: 0;
  text-decoration: none;

  &:hover:not(.hidden) {
    background: var(--color-bg-secondary);
    color: var(--color-text-primary);
  }

  &.active {
    background: var(--primary-color);
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(18, 116, 170, 0.3);
  }

}

.lang-btn {
  &.hidden {
    width: 0;
    opacity: 0;
    transform: scale(0.5);
    pointer-events: none;
    margin: 0;
    padding: 0;
    border: none;
  }
  &img{
    width: 25px !important;
    height: 15px !important;
    object-fit: cover !important;
    border-radius: 99px !important;
  }
}

.nav-btn {
  font-size: 16px; // Icon size

  &.router-link-active.home-btn {
    background: var(--primary-color);
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(18, 116, 170, 0.3);
  }
}

.separator {
  width: 1px;
  height: 18px;
  background: var(--glass-border);
  margin: 0 4px;
}


.search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition);
  position: relative;

  &:hover {
    background: var(--color-bg-secondary);
    color: var(--color-text-primary);
  }
}

// For dark mode toggle btn shadow logic if we want them to feel integrated
:root.dark .lang-btn.active, :root.dark .nav-btn.router-link-active {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.6);
}
</style>
