<template>
  <!-- Backdrop -->
  <Transition name="fade">
    <div
      v-if="ui.notifPanelOpen"
      class="notif-backdrop"
      @click="closePanel"
    />
  </Transition>

  <!-- Panel -->
  <aside
    :class="['notif-panel', { open: ui.notifPanelOpen }]"
    :style="{
      top: headerHeight,
      maxHeight: `calc(100vh - ${headerHeight})`
    }"
    aria-label="Notifications"
  >
    <!-- Header -->
    <div class="notif-header">
      <div>
        <h3 class="notif-title">{{ t('notifications') }}</h3>
        <p class="notif-subtitle">
          {{ notification.unreadCount === 1 ? '1 unread' : 'unread notifications' }}
        </p>
      </div>

      <div class="notif-header-actions">
        <button
          class="btn btn-ghost btn-xs"
          @click="notification.markAllRead()"
        >
          {{ t('mark_all_read') }}
        </button>

        <button
          class="icon-close"
          @click="closePanel"
          aria-label="Close"
        >
          <i class="ri-close-line"></i>
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="notif-tabs">
      <button class="tab active"  @click="notification.setFilter('all')" > {{ $t('all') }} </button>
      <button class="tab" @click="notification.setFilter('unread')">{{ $t('unread') }}</button>
      <button class="tab" @click="notification.setFilter('read')">{{ $t('read') }}</button>
      <button class="tab"  @click="notification.setFilter('mentions')" > {{ $t('mentions') }} </button>
      <button class="tab" @click="notification.setFilter('system')" > {{ $t('system') }} </button>
    </div> 

    <!-- List -->
    <div class="notif-list">
      <button
        v-for="n in notification.filteredNotifications"
        :key="n.Id"
        class="notif-item"
        :class="{ unread: !n.IsRead }"
        @click="notification.openNotification(n)"
      >
        <!-- Avatar / Icon -->
        <div
          class="notif-icon"
          :class="`type-${n.Type}`"
        >
          <i v-if="n.Type === 'like'" class="ri-heart-3-fill"></i>
          <i v-else-if="n.Type === 'follow'" class="ri-user-follow-fill"></i>
          <i v-else-if="n.Type === 'comment'" class="ri-chat-3-fill"></i>
          <i v-else-if="n.Type === 'save'" class="ri-bookmark-fill"></i>
          <i v-else class="ri-notification-3-fill"></i>
        </div>

        <!-- Content -->
        <div class="notif-body">
          <p class="notif-msg">
            {{ n.Message }}
          </p>

          <div class="notif-meta">
            <span class="notif-time">
              {{ notification.formatTime(n.CreatedAt) }}
            </span>

            <span
              v-if="n.actionLabel"
              class="notif-action"
            >
              {{ $t(n.ActionLabel) }}
            </span>
          </div>
        </div>

        <!-- Dot -->
        <span
          v-if="!n.IsRead"
          class="notif-dot"
        ></span>
      </button>

      <!-- Empty -->
      <div
        v-if="notification.notifications.length === 0"
        class="notif-empty"
      >
        <i class="ri-notification-off-line"></i>
        <p>{{ t('no_notifications') }}</p>
      </div>

    </div>
  </aside>
</template>

<script setup lang="ts">
const { t } = useI18n()
const ui = useUIStore()
const notification = useNotificationStore()

const unreadCount = computed(() =>
  notification.notifications.filter(n => !n.IsRead).length
)

const headerHeight = computed(() => {
  const h = 40
  return h > 0 ? `${h}px` : '72px'
})
const closePanel = () => {
  ui.notifPanelOpen = false
}

const openNotification = (n:any) => {
  notification.openNotification(n)
}

const openNotification11 = (n:any) => {
  notification.markRead(n.id)

  if (n.href) {
    navigateTo(n.href)
  }
}

const formatTime = (iso:string) => {
  const d = new Date(iso)
  const now = new Date()
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000)

  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`

  return d.toLocaleDateString()
}
</script>

<style scoped lang="scss">
.notif-backdrop{
  position:fixed;
  inset:0;
  z-index:900;
  background:rgba(15,23,42,.42);
  backdrop-filter:blur(2px);
}

.notif-panel{
  position:fixed;
  top:var(--header-height,72px);
  right:0;
  width:390px;
  max-width:100vw;
  height:calc(100vh - var(--header-height,72px));
  background:var(--color-bg-card,#fff);
  border-left:1px solid var(--color-border,#ececec);
  box-shadow:-12px 0 42px rgba(0,0,0,.14);
  transform:translateX(100%);
  transition:transform .35s cubic-bezier(.4,0,.2,1);
  z-index:1000;
  display:flex;
  flex-direction:column;

  &.open{
    transform:translateX(0);
  }

  @media (max-width:480px){
    width:100%;
  }
}

.notif-header{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:1rem;
  padding:1.1rem 1rem;
  border-bottom:1px solid var(--color-border,#ececec);
  background:var(--color-bg-card,#fff);
}

.notif-title{
  font-size:1rem;
  font-weight:800;
}

.notif-subtitle{
  font-size:.75rem;
  opacity:.6;
  margin-top:.2rem;
}

.notif-header-actions{
  display:flex;
  gap:.5rem;
  align-items:center;
}

.btn-xs{
  padding:.45rem .7rem;
  border-radius:10px;
  font-size:.75rem;
  border:1px solid var(--color-border,#ececec);
}

.icon-close{
  width:34px;
  height:34px;
  border-radius:50%;
  display:grid;
  place-items:center;
}

.notif-tabs{
  display:flex;
  gap:.5rem;
  padding:.75rem 1rem;
  border-bottom:1px solid var(--color-border,#ececec);
}

.tab{
  padding:.45rem .8rem;
  border-radius:999px;
  font-size:.75rem;
  background:transparent;
}

.tab.active{
  background:#111827;
  color:#fff;
}

.notif-list{
  overflow:auto;
  flex:1;
}

.notif-item{
  width:100%;
  display:flex;
  gap:.9rem;
  align-items:flex-start;
  padding:1rem;
  text-align:left;
  border-bottom:1px solid rgba(0,0,0,.04);
  transition:.2s ease;
  position:relative;

  &:hover{
    background:rgba(0,0,0,.025);
  }

  &.unread{
    background:rgba(99,102,241,.05);
  }
}

.notif-icon{
  width:42px;
  height:42px;
  border-radius:50%;
  display:grid;
  place-items:center;
  font-size:1rem;
  flex-shrink:0;
}

.type-like{
  background:rgba(244,63,94,.12);
  color:#f43f5e;
}

.type-follow{
  background:rgba(34,197,94,.12);
  color:#22c55e;
}

.type-comment{
  background:rgba(59,130,246,.12);
  color:#3b82f6;
}

.type-save{
  background:rgba(168,85,247,.12);
  color:#a855f7;
}

.type-system{
  background:rgba(245,158,11,.12);
  color:#f59e0b;
}

.notif-body{
  flex:1;
  min-width:0;
}

.notif-msg{
  font-size:.875rem;
  line-height:1.45;
  font-weight:600;
}

.notif-meta{
  display:flex;
  gap:.6rem;
  margin-top:.35rem;
  align-items:center;
  flex-wrap:wrap;
}

.notif-time{
  font-size:.74rem;
  opacity:.55;
}

.notif-action{
  font-size:.72rem;
  padding:.18rem .45rem;
  border-radius:999px;
  background:rgba(99,102,241,.08);
  color:#6366f1;
}

.notif-dot{
  width:8px;
  height:8px;
  border-radius:50%;
  background:#6366f1;
  margin-top:.4rem;
}

.notif-empty{
  padding:4rem 1rem;
  text-align:center;
  opacity:.55;

  i{
    font-size:2rem;
    display:block;
    margin-bottom:.8rem;
  }
}

.fade-enter-active,
.fade-leave-active{
  transition:opacity .25s ease;
}

.fade-enter-from,
.fade-leave-to{
  opacity:0;
}
</style>