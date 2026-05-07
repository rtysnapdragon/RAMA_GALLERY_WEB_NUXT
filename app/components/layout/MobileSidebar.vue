<template>
  <div class="mobile-sidebar-wrapper">
    <!-- Backdrop -->
    <Transition name="fade">
      <div v-if="ui.mobileMenuOpen" class="sidebar-backdrop" @click="ui.mobileMenuOpen = false"></div>
    </Transition>

    <!-- Sidebar Panel -->
    <Transition name="slide-left">
      <div v-if="ui.mobileMenuOpen" class="sidebar-panel">
        <div class="sidebar-header">
          <NuxtLink :to="localePath('/')" class="logo-wrap" @click="ui.mobileMenuOpen = false">
            <span class="logo-text">RAMA<span class="text-gold">GALLERY</span></span>
          </NuxtLink>
          <button class="close-btn" @click="ui.mobileMenuOpen = false">
            <i class="ri-close-line"></i>
          </button>
        </div>

        <div class="sidebar-content">
          <nav class="sidebar-nav">
            <div v-for="item in navItems" :key="item.key" class="nav-item-wrap">
              <!-- Item with Children -->
              <div v-if="item.children" class="has-submenu">
                <button 
                  class="nav-link dropdown-toggle" 
                  :class="{ 'is-active': activeSubmenu === item.key }"
                  @click="toggleSubmenu(item.key)"
                >
                  <span>{{ $t(item.key) }}</span>
                  <i class="ri-arrow-down-s-line" :class="{ 'rotate-180': activeSubmenu === item.key }"></i>
                </button>
                
                <Transition name="dropdown">
                  <div v-if="activeSubmenu === item.key" class="submenu">
                    <NuxtLink
                      v-for="child in item.children"
                      :key="child.key"
                      :to="localePath(child.href)"
                      class="submenu-link"
                      @click="ui.mobileMenuOpen = false"
                    >
                      {{ $t(child.key) }}
                    </NuxtLink>
                  </div>
                </Transition>
              </div>

              <!-- Direct Link -->
              <NuxtLink
                v-else
                :to="localePath(item.href)"
                class="nav-link"
                @click="ui.mobileMenuOpen = false"
              >
                {{ $t(item.key) }}
              </NuxtLink>
            </div>
          </nav>

          <div class="sidebar-footer">
            <div v-if="!auth.isLoggedIn" class="auth-buttons">
              <NuxtLink :to="localePath('/login')" class="btn btn-login" @click="ui.mobileMenuOpen = false">
                {{ $t('login') }}
              </NuxtLink>
              <NuxtLink :to="localePath('/register')" class="btn btn-register" @click="ui.mobileMenuOpen = false">
                {{ $t('register') }}
              </NuxtLink>
            </div>
            <div v-else class="user-profile">
              <NuxtLink :to="localePath('/dashboard')" class="user-link" @click="ui.mobileMenuOpen = false">
                <img :src="auth.user?.Avatar || '/images/default-avatar.png'" alt="Avatar" class="user-avatar" />
                <div class="user-info">
                  <span class="user-name">{{ auth.user?.DisplayName }}</span>
                  <span class="user-role">{{ $t(auth.user?.Role || 'visitor') }}</span>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import navbarData from '~/assets/json/navbar.json'

const { t } = useI18n()
const localePath = useLocalePath()
const ui = useUIStore()
const auth = useAuthStore()

const navItems = navbarData.items
const activeSubmenu = ref(null)

const toggleSubmenu = (key) => {
  if (activeSubmenu.value === key) {
    activeSubmenu.value = null
  } else {
    activeSubmenu.value = key
  }
}
</script>

<style scoped lang="scss">
.mobile-sidebar-wrapper {
  position: relative;
  z-index: 2000;
}

.sidebar-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 9999;
}

.sidebar-panel {
  position: fixed;
  inset: 0 auto 0 0; // top:0, bottom:0, left:0
  width: 300px;
  max-width: 85vw;
  bottom: 0;
  display: flex;
  flex-direction: column;
height: 100%;
  background: var(--bg-card);
  border-right: 1px solid var(--border);
  z-index: 11111;
  box-shadow: 10px 0 30px rgba(0, 0, 0, 0.1);
  min-height: 0;
}

.sidebar-header {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);

  .logo-text {
    font-size: 1.25rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--text-primary);
  }
  .text-gold { color: var(--color-gold); }

  .close-btn {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-secondary);
    color: var(--text-secondary);
    font-size: 1.5rem;
    transition: all 0.2s ease;

    &:hover {
      background: var(--border);
      color: var(--text-primary);
    }
  }
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
   /* important */
  min-height: 0;

    scroll-behavior: smooth;
  overscroll-behavior: contain;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  color: var(--text-secondary);
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover, &.is-active {
    background: var(--bg-secondary);
    color: var(--color-gold);
  }

  &.router-link-active {
    color: var(--color-gold);
    background: rgba(200, 149, 28, 0.05);
  }
}

.dropdown-toggle i {
  transition: transform 0.3s ease;
}

.submenu {
  margin-left: 1rem;
  margin-top: 0.25rem;
  border-left: 1px solid var(--border);
  padding-left: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.submenu-link {
  padding: 0.75rem 1rem;
  border-radius: 10px;
  color: var(--text-muted);
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    color: var(--text-primary);
    background: var(--bg-secondary);
  }

  &.router-link-active {
    color: var(--color-gold);
  }
}

.sidebar-footer {
  margin-top: auto;
  padding-top: 2rem;
}

.auth-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  .btn {
    width: 100%;
    padding: 0.875rem;
    border-radius: 12px;
    font-weight: 600;
    text-align: center;
    transition: all 0.2s ease;
  }

  .btn-login {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border);
  }

  .btn-register {
    background: var(--color-gold);
    color: #000;
  }
}

.user-profile {
  .user-link {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: var(--bg-secondary);
    border-radius: 16px;
    border: 1px solid var(--border);
  }

  .user-avatar {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    object-fit: cover;
  }

  .user-info {
    display: flex;
    flex-direction: column;
  }

  .user-name {
    font-weight: 700;
    color: var(--text-primary);
  }

  .user-role {
    font-size: 0.75rem;
    color: var(--text-muted);
    text-transform: capitalize;
  }
}

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-left-enter-active, .slide-left-leave-active { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-left-enter-from, .slide-left-leave-to { transform: translateX(-100%); }

.dropdown-enter-active, .dropdown-leave-active { transition: all 0.3s ease; max-height: 200px; overflow: hidden; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; max-height: 0; transform: translateY(-10px); }

.rotate-180 { transform: rotate(180deg); }
</style>
