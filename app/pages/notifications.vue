<template>
  <div class="notifications-page">
    <div class="container">
      <div class="page-header animate-on-scroll">
        <div>
          <p class="section-label">{{ tBy({ en: 'Your Activity', km: 'សកម្មភាពរបស់អ្នក' }) }}</p>
          <h1 class="page-title">{{ t('nav.notifications') }}</h1>
        </div>
        <button v-if="ui.unreadCount > 0" class="btn btn-outline" @click="ui.markAllRead()">
          {{ tBy({ en: 'Mark all read', km: 'សម្គាល់ទាំងអស់ថាបានអាន' }) }}
        </button>
      </div>

      <div class="notif-list card animate-on-scroll">
        <div v-if="ui.notifications.length === 0" class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" stroke-width="1"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <p>{{ tBy({ en: 'No notifications yet', km: 'មិនទាន់មានការជូនដំណឹង' }) }}</p>
        </div>

        <div
          v-for="n in ui.notifications"
          :key="n.id"
          class="notif-item"
          :class="{ unread: !n.read }"
          @click="ui.markRead(n.id)"
        >
          <div class="notif-icon-wrap" :class="`type-${n.type}`">
            <svg v-if="n.type === 'like'" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <svg v-else-if="n.type === 'follow'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <svg v-else-if="n.type === 'comment'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>

          <div class="notif-content">
            <p class="notif-message">{{ n.message }}</p>
            <span class="notif-time">{{ timeAgo(n.createdAt) }}</span>
          </div>

          <div v-if="!n.read" class="unread-dot" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { t } = useI18n()
const ui = useUIStore()
useScrollAnimation()

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

useSeoMeta({ title: 'Notifications — RamaGallery' })
</script>

<style scoped lang="scss">
.notifications-page { padding: 3rem 0 6rem; }
.page-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 2rem; gap: 1rem; }
.page-title { font-size: 2.5rem; margin-top: 0.5rem; }

.notif-list { overflow: hidden; }
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; padding: 5rem; color: var(--color-text-muted); font-size: 0.95rem; }

.notif-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  transition: background var(--transition);
  position: relative;

  &:last-child { border-bottom: none; }
  &:hover { background: var(--color-bg-secondary); }
  &.unread { background: rgba(200, 149, 28, 0.03); }
}

.notif-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &.type-like { background: rgba(239,68,68,0.12); color: #ef4444; }
  &.type-follow { background: rgba(200,149,28,0.12); color: var(--color-gold); }
  &.type-comment { background: rgba(59,130,246,0.12); color: #3b82f6; }
  &.type-system { background: rgba(16,185,129,0.12); color: #10b981; }
}

.notif-content { flex: 1; }
.notif-message { font-size: 0.9rem; color: var(--color-text-primary); line-height: 1.5; }
.notif-time { font-size: 0.75rem; color: var(--color-text-muted); margin-top: 0.3rem; display: block; }
.unread-dot { width: 8px; height: 8px; background: var(--color-gold); border-radius: 50%; flex-shrink: 0; margin-top: 6px; }
</style>
