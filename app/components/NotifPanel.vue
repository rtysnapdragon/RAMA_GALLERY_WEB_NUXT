<template>
  <!-- Backdrop -->
  <Transition name="fade">
    <div v-if="ui.notifPanelOpen" class="notif-backdrop" @click="ui.notifPanelOpen = false" />
  </Transition>

  <!-- Panel -->
  <aside :class="['notif-panel', { open: ui.notifPanelOpen }]" aria-label="Notifications">
    <div class="notif-header">
      <h3 class="notif-title">{{ t('nav.notifications') }}</h3>
      <div class="notif-header-actions">
        <button class="btn btn-ghost btn-xs" @click="ui.markAllRead()">Mark all read</button>
        <button class="icon-close" @click="ui.notifPanelOpen = false" aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="notif-list">
      <div
        v-for="n in ui.notifications"
        :key="n.id"
        :class="['notif-item', { unread: !n.read }]"
        @click="ui.markRead(n.id)"
      >
        <div class="notif-icon" :class="`type-${n.type}`">
          <span v-if="n.type === 'like'">♥</span>
          <span v-else-if="n.type === 'follow'">+</span>
          <span v-else-if="n.type === 'comment'">💬</span>
          <span v-else-if="n.type === 'save'">🔖</span>
          <span v-else>✦</span>
        </div>
        <div class="notif-body">
          <p class="notif-msg">{{ n.message }}</p>
          <span class="notif-time">{{ formatTime(n.createdAt) }}</span>
        </div>
        <div v-if="!n.read" class="notif-dot" />
      </div>

      <div v-if="ui.notifications.length === 0" class="notif-empty">
        <p>No notifications yet</p>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
const { t } = useI18n()
const ui = useUIStore()

const formatTime = (iso: string) => {
  const d = new Date(iso)
  const now = new Date()
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000)
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}
</script>

<style scoped lang="scss">
.notif-backdrop {
  position: fixed;
  inset: 0;
  z-index: 150;
  background: rgba(0,0,0,0.3);
}

.notif-panel {
  position: fixed;
  top: var(--header-height);
  right: 0;
  width: 360px;
  max-height: calc(100vh - var(--header-height));
  overflow-y: auto;
  z-index: 200;
  background: var(--color-bg-card);
  border-left: 1px solid var(--color-border);
  box-shadow: -8px 0 32px rgba(0,0,0,0.12);
  transform: translateX(100%);
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);

  &.open { transform: translateX(0); }

  @media (max-width: 480px) { width: 100vw; }
}

.notif-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.25rem 1rem;
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  background: var(--color-bg-card);
  z-index: 1;
}

.notif-title {
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

.notif-header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-xs { padding: 0.25rem 0.625rem; font-size: 0.75rem; }

.icon-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all var(--transition);

  &:hover {
    background: var(--color-bg-secondary);
    color: var(--color-text-primary);
  }
}

.notif-list { padding: 0.5rem 0; }

.notif-item {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  padding: 1rem 1.25rem;
  cursor: pointer;
  transition: background var(--transition);
  position: relative;

  &:hover { background: var(--color-bg-secondary); }
  &.unread { background: rgba(200, 149, 28, 0.04); }
}

.notif-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  flex-shrink: 0;

  &.type-like { background: rgba(229, 62, 62, 0.12); color: #e53e3e; }
  &.type-follow { background: rgba(56, 161, 105, 0.12); color: #38a169; font-weight: 700; font-size: 1rem; }
  &.type-comment { background: rgba(49, 130, 206, 0.12); color: #3182ce; }
  &.type-save { background: rgba(159, 122, 234, 0.12); color: #9f7aea; }
  &.type-system { background: rgba(200, 149, 28, 0.12); color: var(--color-gold); }
}

.notif-body { flex: 1; min-width: 0; }

.notif-msg {
  font-size: 0.8125rem;
  color: var(--color-text-primary);
  line-height: 1.5;
  margin-bottom: 0.25rem;
}

.notif-time {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.notif-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-gold);
  flex-shrink: 0;
  margin-top: 4px;
}

.notif-empty {
  padding: 3rem 1.25rem;
  text-align: center;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
