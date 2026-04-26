<template>
  <header class="header backdrop-blur-lg" :class="{ scrolled: isScrolled }">
    <div class="header-inner">
      <!-- Logo -->
      <NuxtLink to="/" class="logo" @click="ui.closeAll()">
        <span class="logo-icon">ར</span>
        <span class="logo-text">RamaGallery</span>
      </NuxtLink>

      <!-- Desktop Nav — from navbar.json -->
      <nav class="nav-desktop" aria-label="Main navigation">
        <NuxtLink
          v-for="item in navItems"
          :key="item.key"
          :to="localePath(item.href)"
          class="nav-link gold-underline"
          :class="{ active: isActive(item.href) }"
        >
          {{ $t(`nav.${item.key}`) }}
        </NuxtLink>
      </nav>

      <!-- Right controls -->
      <div class="header-actions">
        <!-- Search -->
        <button
          class="icon-btn"
          :data-tooltip="t('nav.search')"
          @click="ui.toggleSearch()"
          aria-label="Search"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
            <circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </button>

        <!-- Language toggle -->
        <button
          class="lang-btn icon-btn"
          @click="toggleLocale()"
          :data-tooltip="currentLocale === 'en' ? 'ភាសាខ្មែរ' : 'English'"
        >
          <i class="ri-translate-2"></i>
          <span>{{ currentLocale === 'en' ? 'KM' : 'EN' }}</span>
        </button>

        <!-- Theme toggle -->
        <button
          class="icon-btn"
          :data-tooltip="ui.isDark ? t('common.light_mode') : t('common.dark_mode')"
          @click="ui.toggleTheme()"
          aria-label="Toggle theme"
        >
          <svg v-if="ui.isDark" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
          </svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>

        <!-- Notifications (auth only) -->
        <button
          v-if="auth.isLoggedIn"
          class="icon-btn notif-btn"
          :data-tooltip="t('nav.notifications')"
          @click="ui.toggleNotifPanel()"
          aria-label="Notifications"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span v-if="ui.unreadCount > 0" class="notif-badge">{{ ui.unreadCount }}</span>
        </button>
        <!-- <NavProfile /> -->
        <!-- Auth buttons -->
        <template v-if="!auth.isLoggedIn">
          <NuxtLink :to="localePath('/login')" class="btn btn-ghost btn-sm">{{ t('nav.login') }}</NuxtLink>
          <NuxtLink :to="localePath('/register')" class="btn btn-primary btn-sm">{{ t('nav.register') }}</NuxtLink>
        </template>

        <!-- User avatar (logged in) -->
        <template v-else>
          <div class="user-menu" @click.stop="userMenuOpen = !userMenuOpen">
            <img
              :src="auth.user?.avatar ?? ''"
              :alt="auth.displayName"
              class="user-avatar"
            />
            <div v-if="userMenuOpen" class="user-dropdown">
              <NuxtLink :to="localePath('/dashboard')" @click="userMenuOpen = false">{{ t('nav.dashboard') }}</NuxtLink>
              <NuxtLink :to="localePath('/profile')" @click="userMenuOpen = false">{{ t('nav.profile') }}</NuxtLink>
              <NuxtLink :to="localePath('/settings')" @click="userMenuOpen = false">{{ t('common.edit') }}</NuxtLink>
              <hr />
              <button @click="handleLogout">{{ t('nav.logout') }}</button>
            </div>
          </div>
        </template>

        <!-- Mobile hamburger -->
        <button class="hamburger icon-btn" @click="ui.toggleMobileMenu()" aria-label="Menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
            <line v-if="!ui.mobileMenuOpen" x1="3" y1="6" x2="21" y2="6"/>
            <line v-if="!ui.mobileMenuOpen" x1="3" y1="12" x2="21" y2="12"/>
            <line v-if="!ui.mobileMenuOpen" x1="3" y1="18" x2="21" y2="18"/>
            <path v-if="ui.mobileMenuOpen" d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <Transition name="mobile-menu">
      <div v-if="ui.mobileMenuOpen" class="mobile-nav">
        <NuxtLink
          v-for="item in navItems"
          :key="item.key"
          :to="localePath(item.href)"
          class="mobile-nav-link"
          @click="ui.mobileMenuOpen = false"
        >
          {{ t(`nav.${item.key}`) }}
        </NuxtLink>
        <div class="mobile-nav-actions">
          <NuxtLink v-if="!auth.isLoggedIn" :to="localePath('/login')" class="btn btn-outline" @click="ui.mobileMenuOpen = false">{{ t('nav.login') }}</NuxtLink>
          <NuxtLink v-if="!auth.isLoggedIn" :to="localePath('/register')" class="btn btn-primary" @click="ui.mobileMenuOpen = false">{{ t('nav.register') }}</NuxtLink>
          <NuxtLink v-if="auth.isLoggedIn" :to="localePath('/dashboard')" class="btn btn-primary" @click="ui.mobileMenuOpen = false">{{ t('nav.dashboard') }}</NuxtLink>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import navbarData from '~/assets/json/navbar.json'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const router = useRouter()
const ui = useUIStore()
const auth = useAuthStore()

const navItems = navbarData.items
const isScrolled = ref(false)
const userMenuOpen = ref(false)
const currentLocale = computed(() => locale.value)

const isActive = (href) => route.path === href || route.path.startsWith(href + '/')

const toggleLocale = () => {
  const newLocale = locale.value === 'en' ? 'km' : 'en'
  locale.value = newLocale
  if (import.meta.client) localStorage.setItem('rama_locale', newLocale)
}

const handleLogout = () => {
  auth.logout()
  userMenuOpen.value = false
  router.push(localePath('/'))
}
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

</script>

<style scoped lang="scss">
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: var(--header-height);
  transition: all var(--transition);

  &.scrolled {
    border-bottom: 1px solid var(--color-border);
  }

  &:not(.scrolled) {
    background: transparent;
  }
}

.header-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  text-decoration: none;
  flex-shrink: 0;

  &-icon {
    font-size: 1.5rem;
    color: var(--color-gold);
    font-family: var(--font-display);
    line-height: 1;
  }

  &-text {
    font-family: var(--font-display);
    font-size: 1.25rem;
    font-weight: 500;
    color: var(--color-text-primary);
    letter-spacing: 0.02em;
  }
}

.nav-desktop {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex: 1;

  @media (max-width: 900px) { display: none; }
}

.nav-link {
  padding: 0.5rem 0.875rem;
  font-size: 0.8125rem;
  font-weight: 400;
  letter-spacing: 0.04em;
  color: var(--color-text-secondary);
  text-decoration: none;
  // transition: color var(--transition);
  border-radius: 4px;

  &:hover, &.active {
    color: var(--color-text-primary);
  }

  &.active {
    font-weight: 500;
    color: var(--color-gold);
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
}

.icon-btn {
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

.lang-btn {
  display: flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  border-radius: 2px;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-secondary);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition);

  &:hover {
    border-color: var(--color-gold);
    color: var(--color-gold);
  }
}

.notif-btn { position: relative; }
.notif-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 16px;
  height: 16px;
  background: var(--color-gold);
  color: #fff;
  border-radius: 50%;
  font-size: 0.6rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.btn-sm {
  padding: 0.5rem 1.25rem;
  font-size: 0.8125rem;
}

.user-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-gold);
  cursor: pointer;
  transition: all var(--transition);

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 0 3px rgba(200, 149, 28, 0.2);
  }
}

.user-menu {
  position: relative;
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 180px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  z-index: 50;

  a, button {
    display: block;
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    text-decoration: none;
    background: transparent;
    border: none;
    text-align: left;
    cursor: pointer;
    transition: all var(--transition);

    &:hover {
      background: var(--color-bg-secondary);
      color: var(--color-text-primary);
    }
  }

  hr {
    border: none;
    border-top: 1px solid var(--color-border);
    margin: 0;
  }
}

.hamburger {
  display: none;
  @media (max-width: 900px) { display: flex; }
}

// Mobile nav
.mobile-nav {
  position: absolute;
  top: var(--header-height);
  left: 0;
  right: 0;
  background: var(--color-bg-card);
  border-bottom: 1px solid var(--color-border);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  z-index: 99;

  @media (min-width: 901px) { display: none; }
}

.mobile-nav-link {
  padding: 0.875rem 1rem;
  font-size: 1rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  border-radius: 4px;
  transition: all var(--transition);

  &:hover {
    background: var(--color-bg-secondary);
    color: var(--color-text-primary);
  }
}

.mobile-nav-actions {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem 0 0.25rem;
  border-top: 1px solid var(--color-border);
  margin-top: 0.5rem;
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}



.lang-btn {
  position: relative;
}

/* Tooltip base */
.lang-btn::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: -6px;            /* anchor below button */
  left: 50%;
  transform: translate(-50%, 100%);
  
  background: #111;
  color: #fff;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
  white-space: nowrap;

  opacity: 0;
  pointer-events: none;
  transition: 0.2s ease;
}

/* Arrow (optional) */
.lang-btn::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  
  border: 5px solid transparent;
  border-bottom-color: #111;

  opacity: 0;
  transition: 0.2s ease;
}

/* Show on hover */
.lang-btn:hover::after,
.lang-btn:hover::before {
  opacity: 1;
}
</style>
