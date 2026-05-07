<template>
  <aside class="sidebar">
    <!-- LOGO -->
    <NuxtLink :to="localePath('/')" class="sidebar__logo">
      RamaGallery
    </NuxtLink>
    <!-- NAV -->
    <nav  class="sidebar__nav">
      <RALink v-for="item in items" :key="item.to" :to="item.to" class="nav-item">
        <template #label>
          <i :class="item.icon"></i>
          <span>{{ $t(item.label) }}</span>
        </template>
      </RALink>
    </nav>
  </aside>
</template>
<script setup lang="ts">


const items = [
  { to: '/dashboard', label: 'overview', icon: 'ri-dashboard-line' },
  { to: '/dashboard/upload', label: 'upload', icon: 'ri-upload-line' },
  { to: '/dashboard/artworks', label: 'artworks', icon: 'ri-gallery-line' },
  { to: '/dashboard/analytics', label: 'analytics', icon: 'ri-bar-chart-line' },
  { to: '/dashboard/ai', label: 'ai_tools', icon: 'ri-robot-line' },
  { to: '/dashboard/profile', label: 'profile', icon: 'ri-user-line' },
  { to: '/dashboard/notifications', label: 'notifications', icon: 'ri-notification-3-line' },
  { to: '/dashboard/settings', label: 'settings', icon: 'ri-settings-3-line' },
]

definePageMeta({
  layout: 'dashboard',
})
</script>

<style lang="scss" scoped>
.sidebar {
  width: 280px;
  height: 100vh;

  position: sticky;
  top: 0;

  padding: 24px;

  background: var(--bg-sidebar);
  border-right: 1px solid var(--border);

  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* LOGO */
.sidebar__logo {
  font-size: 20px;
  font-weight: 700;
  color: var(--text);
  text-decoration: none;
  letter-spacing: 0.5px;
}

/* NAV */
.sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* ITEM */
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;

  padding: 10px 12px;
  border-radius: 10px;

  color: var(--muted);
  text-decoration: none;

  transition: 0.2s ease;

  i {
    font-size: 18px;
  }

  &:hover {
    background: var(--glass);
    color: var(--text);
  }

  &.active {
    background: rgba(99, 102, 241, 0.15);
    color: #6366f1;
    font-weight: 500;
  }
}
</style>