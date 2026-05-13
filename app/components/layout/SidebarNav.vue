<template>
  <div class="sidebar-inner">
    <!-- Logo -->
    <div class="sidebar-logo">
      <div class="sidebar-logo__icon">
        <span>RG</span>
      </div>
      <div class="sidebar-logo__text">
        <div class="sidebar-logo__name">RamaGallery</div>
        <div class="sidebar-logo__sub">Admin v1.0</div>
      </div>
    </div>

    <!-- Live indicator -->
    <div class="sidebar-live">
      <span class="pulse-dot" />
      <span class="sidebar-live__text">Live Dashboard</span>
      <span class="sidebar-live__count">{{ store.activeUsers }}</span>
    </div>

    <!-- Nav -->
    <nav class="sidebar-nav">
      <div v-for="section in navSections" :key="section.label" class="sidebar-section">
        <div class="sidebar-section__label">{{ section.label }}</div>
        <NuxtLink
          v-for="item in section.items"
          :key="item.path"
          :to="item.path"
          class="sidebar-nav__item"
          :class="{ 'sidebar-nav__item--active': isActive(item.path) }"
        >
          <span class="sidebar-nav__icon">{{ item.icon }}</span>
          <span class="sidebar-nav__label">{{ item.label }}</span>
          <span v-if="item.badge" class="sidebar-nav__badge">{{ item.badge }}</span>
        </NuxtLink>
      </div>
    </nav>

    <!-- Bottom -->
    <div class="sidebar-footer">
      <div class="sidebar-footer__user">
        <div class="avatar avatar--md">A</div>
        <div class="sidebar-footer__info">
          <div class="sidebar-footer__name">Admin</div>
          <div class="sidebar-footer__role">ADMIN</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDashboardStore } from '~/stores/dashboard'

const store = useDashboardStore()
const route = useRoute()

const navSections = [
  {
    label: 'Overview',
    items: [
      { path: '/',         icon: '▦',  label: 'Dashboard'  },
      { path: '/realtime', icon: '◉',  label: 'Realtime'   },
      { path: '/analytics',icon: '∿',  label: 'Analytics'  },
    ]
  },
  {
    label: 'Content',
    items: [
      { path: '/content',  icon: '⊞',  label: 'All Content' },
      { path: '/users',    icon: '◎',  label: 'Users'       },
      { path: '/comments', icon: '◈',  label: 'Comments'    },
    ]
  },
  {
    label: 'Engagement',
    items: [
      { path: '/likes',    icon: '♡',  label: 'Likes'    },
      { path: '/views',    icon: '◻',  label: 'Views'    },
      { path: '/chat',     icon: '◫',  label: 'Chat'     },
    ]
  },
  {
    label: 'System',
    items: [
      { path: '/logs',     icon: '≡',  label: 'Logs'     },
      { path: '/settings', icon: '⊙',  label: 'Settings' },
    ]
  }
]

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<style lang="scss">
@use "@/assets/styles/_variables.scss" as *;

.sidebar-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: $space-md;
  overflow: hidden;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: $space-sm;
  padding: $space-md 0 $space-lg;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: $space-md;

  &__icon {
    width: 36px; height: 36px;
    background: var(--accent);
    border-radius: $radius-sm;
    display: flex; align-items: center; justify-content: center;
    font-family: $font-display;
    font-size: 0.65rem;
    font-weight: 700;
    color: white;
    letter-spacing: .05em;
    flex-shrink: 0;
  }

  &__name {
    font-family: $font-display;
    font-size: 0.8125rem;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1;
  }

  &__sub {
    font-size: 0.65rem;
    color: var(--text-muted);
    margin-top: 2px;
    font-family: $font-mono;
  }
}

.sidebar-live {
  display: flex;
  align-items: center;
  gap: $space-sm;
  padding: 8px 10px;
  background: rgba($color-success, .08);
  border: 1px solid rgba($color-success, .15);
  border-radius: $radius-md;
  margin-bottom: $space-md;

  &__text {
    font-size: 0.7rem;
    font-weight: 600;
    color: $color-success;
    flex: 1;
  }

  &__count {
    font-family: $font-mono;
    font-size: 0.7rem;
    font-weight: 700;
    color: $color-success;
    background: rgba($color-success, .15);
    padding: 1px 6px;
    border-radius: 99px;
  }
}

.sidebar-section {
  margin-bottom: $space-md;

  &__label {
    font-size: 0.625rem;
    font-weight: 700;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: var(--text-muted);
    padding: 0 $space-sm $space-xs;
    margin-bottom: 2px;
  }
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;

  &__item {
    display: flex;
    align-items: center;
    gap: $space-sm;
    padding: 8px 10px;
    border-radius: $radius-md;
    text-decoration: none;
    color: var(--text-secondary);
    font-size: 0.8125rem;
    font-weight: 500;
    transition: all $transition-fast;
    margin-bottom: 2px;

    &:hover {
      background: var(--bg-hover);
      color: var(--text-primary);
    }

    &--active {
      background: var(--bg-active);
      color: var(--accent);
      font-weight: 600;

      .sidebar-nav__icon { color: var(--accent); }
    }
  }

  &__icon {
    font-size: 1rem;
    width: 20px;
    text-align: center;
    flex-shrink: 0;
    color: var(--text-muted);
  }

  &__label { flex: 1; }

  &__badge {
    font-size: 0.625rem;
    font-weight: 700;
    padding: 1px 5px;
    border-radius: 99px;
    background: var(--accent);
    color: white;
  }
}

.sidebar-footer {
  border-top: 1px solid var(--border-color);
  padding-top: $space-md;
  margin-top: auto;

  &__user {
    display: flex;
    align-items: center;
    gap: $space-sm;
  }

  &__name {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  &__role {
    font-size: 0.65rem;
    color: var(--accent);
    font-family: $font-mono;
    font-weight: 600;
  }
}
</style>
