<!-- components/Navbar.vue -->
<template>
  <nav class="glass-navbar">
    <div class="navbar-container">
      <!-- Logo -->
      <div class="logo">
        <NuxtLink :to="localePath('/')">
          RamaGallery
        </NuxtLink>
      </div>

      <!-- Desktop Navigation -->
      <ul class="nav-links">
        <li><NuxtLink :to="localePath('/about')">About</NuxtLink></li>
        <li><NuxtLink :to="localePath('/gallery')">Gallery</NuxtLink></li>
        <li><NuxtLink :to="localePath('/exhibitions')">Exhibitions</NuxtLink></li>
        <li><NuxtLink :to="localePath('/shop')">Shop</NuxtLink></li>
        <li><NuxtLink :to="localePath('/contact')">Contact</NuxtLink></li>
      </ul>

      <!-- Right Side Controls -->
      <div class="nav-controls">
        <!-- Language Switch -->
        <div class="language-switch">
          <select v-model="currentLang" @change="changeLanguage" class="lang-select">
            <option value="en">EN</option>
            <option value="id">ID</option>
            <option value="fr">FR</option>
          </select>
        </div>

        <!-- Dark/Light Mode Toggle -->
        <button
          @click="toggleDarkMode"
          class="theme-toggle"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <i class="ri-sun-line" v-if="isDark"></i>
          <i class="ri-moon-line" v-else></i>
        </button>

        <!-- Profile -->
        <button class="profile-btn" @click="toggleProfile">
          <i class="ri-user-line profile-avatar"> </i>
        </button>
      </div>

      <!-- Mobile Menu Button -->
      <button class="mobile-menu-btn" @click="toggleMobileMenu">
        <i class="ri-menu-line"></i>
      </button>
    </div>

    <!-- Mobile Menu -->
    <div v-if="isMobileMenuOpen" class="mobile-menu">
      <ul class="mobile-nav-links">
        <li><NuxtLink :to="localePath('/about')" @click="toggleMobileMenu">About</NuxtLink></li>
        <li><NuxtLink :to="localePath('/gallery')" @click="toggleMobileMenu">Gallery</NuxtLink></li>
        <li><NuxtLink :to="localePath('/exhibitions')" @click="toggleMobileMenu">Exhibitions</NuxtLink></li>
        <li><NuxtLink :to="localePath('/shop')" @click="toggleMobileMenu">Shop</NuxtLink></li>
        <li><NuxtLink :to="localePath('/contact')" @click="toggleMobileMenu">Contact</NuxtLink></li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isDark = ref(false)
const currentLang = ref('en')
const isMobileMenuOpen = ref(false)

const toggleDarkMode = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

const changeLanguage = () => {
  // Implement your i18n logic here (e.g. use nuxt-i18n)
  console.log('Language changed to:', currentLang.value)
}

const toggleProfile = () => {
  // Open profile modal / dropdown
  alert('Profile menu would open here')
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// Close mobile menu on route change
const router = useRouter()
router.afterEach(() => {
  isMobileMenuOpen.value = false
})

onMounted(() => {
  // Respect system preference
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
})
</script>

<style lang="scss" scoped>
:root {
  --nav-bg: rgba(255, 255, 255, 0.75);
  --nav-border: rgba(255, 255, 255, 0.4);
  --text-color: #1f2937;
  --shadow-color: 0 10px 30px -10px rgba(0, 0, 0, 0.15);
}

.dark {
  --nav-bg: rgba(15, 23, 42, 0.75);
  --nav-border: rgba(255, 255, 255, 0.1);
  --text-color: #e2e8f0;
  --shadow-color: 0 10px 30px -10px rgba(0, 0, 0, 0.4);
}

.glass-navbar {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: calc(100% - 40px);
  max-width: 1200px;
  border-radius: 9999px;
  padding: 12px 24px;
  background: var(--nav-bg);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--nav-border);
  box-shadow: var(--shadow-color);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.2);
  }
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text-color);

  a {
    text-decoration: none;
    color: inherit;
  }
}

.nav-links {
  display: none;
  gap: 2.25rem;
  list-style: none;
  margin: 0;
  padding: 0;

  @media (min-width: 768px) {
    display: flex;
    align-items: center;
  }

  li a {
    color: var(--text-color);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;

    &:hover {
      color: #8b5cf6;
    }
  }
}

.nav-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.language-switch {
  .lang-select {
    background: rgba(255, 255, 255, 0.6);
    border: 1px solid var(--nav-border);
    border-radius: 9999px;
    padding: 6px 12px;
    font-size: 0.875rem;
    color: var(--text-color);
    cursor: pointer;
    backdrop-filter: blur(10px);

    .dark & {
      background: rgba(15, 23, 42, 0.6);
    }
  }
}

.theme-toggle,
.profile-btn {
  width: 42px;
  height: 42px;
  border-radius: 9999px;
  border: none;
  background: rgba(255, 255, 255, 0.7);
  color: var(--text-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(10px);
  border: 1px solid var(--nav-border);

  &:hover {
    transform: scale(1.05);
    background: rgba(255, 255, 255, 0.9);
  }

  .dark & {
    background: rgba(15, 23, 42, 0.7);
  }
}

.mobile-menu-btn {
  display: block;
  width: 42px;
  height: 42px;
  border-radius: 9999px;
  border: none;
  background: rgba(255, 255, 255, 0.7);
  color: var(--text-color);
  font-size: 1.5rem;
  cursor: pointer;
  backdrop-filter: blur(10px);
  border: 1px solid var(--nav-border);

  @media (min-width: 768px) {
    display: none;
  }
}

.mobile-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 12px;
  background: var(--nav-bg);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid var(--nav-border);
  padding: 1.5rem;
  box-shadow: var(--shadow-color);

  .mobile-nav-links {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      margin-bottom: 1rem;

      a {
        color: var(--text-color);
        font-size: 1.1rem;
        text-decoration: none;
      }
    }
  }
}

/* Extra floating effect */
.glass-navbar::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background: linear-gradient(
    145deg,
    rgba(255,255,255,0.15),
    rgba(255,255,255,0)
  );
  pointer-events: none;
  z-index: -1;
}
</style>