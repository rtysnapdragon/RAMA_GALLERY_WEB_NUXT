<template>
  <header class="glass-navbar" 
    :class="{ 
      scrolled: isScrolled ,
      hidden: !navbarVisible,
    }">
    <div class="navbar-container">
      <!-- Logo -->
      <NuxtLink :to="localePath('/')" class="logo" @click="ui.closeAll()">
        <span class="logo-icon">ར</span>
        <span class="logo-text">RamaGallery</span>
      </NuxtLink>

      <!-- Desktop Nav — from navbar.json -->
      <!-- <ul class="nav-desktop">
        <li v-for="link in navItems" :key="link.key">
          <NuxtLink
            :to="localePath(link.href)"
            class="nav-link gold-underline"
            :class="{ 'nav-link--active': route.path === localePath(link.href) || (link.href !== '/' && route.path.startsWith(link.href)) }"
          >
            {{ $t(`${link.key}`) }} 
          </NuxtLink>
        </li>
      </ul> -->
      
      <nav class="nav-desktop" aria-label="Main navigation">
        <NuxtLink
          v-for="item in navItems"
          :key="item.key"
          :to="localePath(item.href)"
          class="nav-link gold-underline"
          :class="{ active: isActive(item.href) }"
        >
          {{ $t(`${item.key}`) }}
        </NuxtLink>
      </nav>

      <!-- Right controls -->
      <div class="header-actions">
        <!-- Search -->
        <button
          class="icon-btn search-btn"
          :data-tooltip="t('search')"
          @click="ui.toggleSearch()"
          aria-label="Search"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
            <circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </button>

        <!-- Language toggle -->
        <LangSwitch />

        <!-- Theme toggle -->
        <button
          class="icon-btn theme-toggle"
          :data-tooltip="themeStore.isDark ? t('common.light_mode') : t('common.dark_mode')"
          @click="themeStore.toggle()"
          aria-label="Toggle theme"
        >
          <svg v-if="themeStore.isDark" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
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
          :data-tooltip="t('notifications')"
          @click="ui.toggleNotifPanel()"
          aria-label="Notifications"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span v-if="notification.unreadCount > 0" class="notif-badge">{{ notification.unreadCount }}</span>
        </button>
        <!-- <NotifPanel1 /> -->
        <!-- <NavProfile /> -->
                 <!-- Mobile hamburger -->
        <button class="hamburger icon-btn" @click="ui.toggleMobileMenu()" aria-label="Menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
            <line v-if="!ui.mobileMenuOpen" x1="3" y1="6" x2="21" y2="6"/>
            <line v-if="!ui.mobileMenuOpen" x1="3" y1="12" x2="21" y2="12"/>
            <line v-if="!ui.mobileMenuOpen" x1="3" y1="18" x2="21" y2="18"/>
            <path v-if="ui.mobileMenuOpen" d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
        <!-- Auth buttons -->
        <template v-if="!auth.isLoggedIn">
          <NuxtLink :to="localePath('/login')" class="btn btn-ghost btn-sm">{{ t('login') }}</NuxtLink>
          <NuxtLink :to="localePath('/register')" class="btn btn-primary btn-sm">{{ t('register') }}</NuxtLink>
        </template>

        <!-- User avatar (logged in) -->
        <template v-else>
          <div class="profile-user-container"><ProfileUser /></div>
        </template>
      </div>
    </div>

    <!-- Mobile Sidebar -->
    <MobileSidebar />
  </header>
</template>

<script setup>
import navbarData from '~/assets/json/navbar.json'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const themeStore = useThemeStore()
const notification = useNotificationStore()
const ui = useUIStore()
const auth = useAuthStore()

const navItems = navbarData.items
const userMenuOpen = ref(false)

/* ---------------------------------
   useScroll composable
--------------------------------- */
// Scroll composable
const { y } = useScroll()
const navbarVisible = ref(true)
const lastScrollY = ref(0)
const isScrolled = computed(() => y.value > 30)

// Smooth hide/show logic
watch(y, (currentY) => {
  const scrollDown = currentY > lastScrollY.value
  // top of page = always show
  if (currentY <= 30) {
    // Always show at the top
    navbarVisible.value = true
    // lastY.value = currentY
    // return
  }
  else if (scrollDown && currentY > 150) {
    // Hide when scrolling down (after a small threshold)
    navbarVisible.value = false
  }
  else {
      // Show when scrolling up
      navbarVisible.value = true
  }
  lastScrollY.value = currentY
})

/* ---------------------------------
   active route
--------------------------------- */
const isActive = (href) => {
  return route.path === href || route.path.startsWith(href + '/')
}

/* ---------------------------------
   logout
--------------------------------- */
const handleLogout = () => {
  auth.logout()
  userMenuOpen.value = false
  router.push(localePath('/'))
}

</script>

<style scoped lang="scss">
:root {
  --nav-bg: rgba(255, 255, 255, 0.75);
  --nav-border: rgba(255, 255, 255, 0.4);
  --text-color: #1f2937;
  --shadow-color: 0 10px 30px -10px rgba(0, 0, 0, 0.15);
}

.dark {
  --nav-bg: rgba(75, 76, 78, 0.75);
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
  max-width: 1400px;
  border-radius: 9999px;
  padding: 12px 24px;
  background: var(--nav-bg);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--nav-border);
  box-shadow: var(--shadow-color);
  
/* Smooth transitions */
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  /* Extra subtle lift when visible */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 9999px;
    // background: linear-gradient(145deg, rgba(255,255,255,0.18), transparent);
    pointer-events: none;
    z-index: -1;
    opacity: 0.6;
    transition: opacity 0.4s ease;
    background: linear-gradient(
      145deg,
      rgba(255,255,255,0.15),
      rgba(255,255,255,0)
    );
  }

  &:hover {
    box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.2);
  }

/* Hidden State - Smooth slide up */
  &.hidden {
    transform: translate(-50%, -120px); /* slides completely out of view */
    opacity: 0;
    pointer-events: none;
  }

/* Scrolled State */
  &.scrolled {
    border-color: color-mix(in srgb, var(--color-gold), transparent 85%);
    top: 12px;
    padding: 12px 26px;
    background: rgba(var(--bg-rgb, 255 255 255), 0.85);
    box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.18);
  }

&:hover:not(.hidden) {
    box-shadow: 0 22px 45px -12px rgba(0, 0, 0, 0.22);
    transform: translateX(-50%) translateY(-2px); /* subtle lift */
  }
  &:not(.scrolled) {
    background: transparent;
  }
}

/* Container */
.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;           /* Important for absolute centering fallback */
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  text-decoration: none;
  flex-shrink: 0;
  z-index: 2;
  &-icon {
    font-size: 1.5rem;
    color: var(--color-gold);
    font-family: var(--font-900);
    line-height: 1;
  }

  &-text {
    font-family: var(--font-900);
    font-size: 1.25rem;
    font-weight: 900;
    color: var(--color-text-primary);
    letter-spacing: 0.02em;
  }
}

.nav-desktop {
  font-family: var(--font-900) !important;
  font-weight: 900;
  display: flex;
  align-items: center;
  flex: 1;
  letter-spacing: 0.04em;
  gap: 0.5rem; 
margin: 0 3rem;           /* Creates breathing room */
  @media (max-width: 900px) { display: none; }
}

.nav-link {
  padding: 0.5rem 0.875rem;
  font-size: 0.8125rem;
  color: var(--secondary-color);
  text-decoration: none;
  transition: color var(--transition);
  border-radius: 4px;

  &:hover, &.active {
    color: var(--primary-color);
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

 // Mobile responsive only (hidden on desktop)
@media (max-width: 768px) {
  .theme-toggle, .search-btn {
    display: none !important;
  }
}
/* Optional: Make nav links closer together on smaller wide screens */
@media (max-width: 1100px) {
  .nav-desktop {
    gap: 1.75rem;
  }
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
  color: var(--secondary-color);
  cursor: pointer;
  transition: all var(--transition);
  position: relative;

  &:hover {
    background: var(--color-bg-secondary);
    color: var(--secondary-color);
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
