<!-- components/LangSwitch.vue -->
<template>
  <div class="lang-switch" :class="{ open: isOpen }">
    <!-- Trigger -->
    <button
      class="lang-switch__trigger"
      type="button"
      @click="toggleMenu"
      :aria-expanded="isOpen"
      aria-haspopup="true"
    >
      <span class="lang-switch__flag"><img :src="current.flag" /></span>
    </button>

    <!-- Dropdown -->
    <transition name="lang-dropdown">
      <div v-if="isOpen" class="lang-switch__menu">
        <button
          v-for="locale in locales"
          :key="locale.code"
          class="lang-switch__item"
          :class="{ active: locale.code === localeCode }"
          @click="changeLocale(locale.code)"
        >
          <div class="lang-switch__flag"><img :src="locale.flag" /></div>
          <span class="lang-switch__name">{{ locale.name }}</span>
          <span class="lang-switch__check" v-if="locale.code === localeCode">
            <i class="ri-check-line"></i>
          </span>
        </button>
      </div>
    </transition>

  </div>
</template>
<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const { locale, locales, setLocale } = useI18n()

const isOpen = ref(false)

const localeCode = computed(() => locale.value)

const current = computed(() => {
  return (
    locales.value.find((item) => item.code === locale.value) || locales.value[0]
  )
})

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  isOpen.value = false
}

const setCookie = (name, value, days = 365) => {
  const expires = new Date(Date.now() + days * 86400000).toUTCString()
  document.cookie = `${name}=${value}; expires=${expires}; path=/`
}

const changeLocale = async (code) => {
  if (code === locale.value) {
    closeMenu()
    return
  }

  closeMenu()

  localStorage.setItem('locale', code)
  setCookie('i18n_redirected', code)

  await setLocale(code)

  window.location.reload()
}

const clickOutside = (e) => {
  if (!e.target.closest('.lang-switch')) {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', clickOutside)

  const saved = localStorage.getItem('locale')
  if (saved && saved !== locale.value) {
    locale.value = saved
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', clickOutside)
})
</script>

<style lang="scss" scoped>
.lang-switch {
  position: relative;
  display: inline-block;
  align-items: center;

  &__trigger {
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    border: none;
    border-radius: 12px;
    padding: 0.3rem;
    cursor: pointer;
    transition: all 0.25s ease;
    background: var(--card-bg);
    color: var(--text-color);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    img{
      width: 20px !important;
      height: 20px !important;
    }

    &:hover {
      background: var(--card-bg);
      transform: translateY(-1px);
    }
  }

  &__arrow {
    transition: transform 0.25s ease;
  }

  &.open &__arrow {
    transform: rotate(180deg);
  }

  &__menu {
    position: absolute;
    justify-content: center;
    align-items: center;
    text-align: center;
    top: calc(100% + 10px);
    right: 0;
    min-width: 100px;
    border-radius: 14px;
    overflow: hidden;
    padding: 10px 0;
    z-index: 50;
    background: var(--card-bg);
    color: var(--text-color);
    border: 1px solid var(--border-color);
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.12);
  }

  &__flag {
    width: 30px !important;
    height: 30px !important;
    border-radius: 50%;
    img{
      width: 20px !important;
      height: 20px !important;
      border-radius: 50%;
    }
  }
  &__item {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    
    gap: 0.25rem;
    padding: 0.2rem 1rem;
    border: none;
    background: transparent;
    color: inherit;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
      background: rgba(100, 100, 100, 0.08);
    }

    &.active {
      font-weight: 700;
    }
  }

  &__check {
    margin-left: auto;
  }

  &__loading {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: grid;
    place-items: center;
    background: rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(6px);
    color: #fff;
    text-align: center;
  }

  &__spinner {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    border: 4px solid rgba(255, 255, 255, 0.2);
    border-top-color: #fff;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 1rem;
  }
}

/* Light / Dark variables */
:root {
  --card-bg: #ffffff;
  --text-color: #111827;
  --border-color: #e5e7eb;
}

.dark {
  --card-bg: #111827;
  --text-color: #f9fafb;
  --border-color: #374151;
}

/* Dropdown transition */
.lang-dropdown-enter-active,
.lang-dropdown-leave-active {
  transition: all 0.22s ease;
}

.lang-dropdown-enter-from,
.lang-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.97);
}

/* Fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>