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
        <h3 class="notif-title">{{ $t('notifications') }}</h3>
        <p class="notif-subtitle">
          {{ notification.unreadCount === 1 ? '1 ' + $t('unread') : $t('unread_notifications') }}
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

      <button
        class="tab"
        :class="{ active: notification.filter === 'all' }"
        @click="notification.setFilter('all')"
      >
        {{ $t('all') }}
        <span class="count">{{ notification.typeCounts.all }}</span>
      </button>

      <button
        class="tab"
        :class="{ active: notification.filter === 'unread' }"
        @click="notification.setFilter('unread')"
      >
        {{ $t('unread') }}
        <span class="count">{{ notification.typeCounts.unread }}</span>
      </button>

      <button
        class="tab"
        :class="{ active: notification.filter === 'read' }"
        @click="notification.setFilter('read')"
      >
        {{ $t('read') }}
        <span class="count">{{ notification.typeCounts.read }}</span>
      </button>
      <!-- 
      <button
        class="tab"
        :class="{ active: notification.filter === 'system' }"
        @click="notification.setFilter('system')"
      >
        {{ $t('system') }}
        <span class="count">{{ notification.typeCounts.system }}</span>
      </button> -->

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
            <!-- 
            <span
              v-if="n.actionLabel"
              class="notif-action"
            >
              {{ $t(n.ActionLabel) }}
            </span> -->
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

const { lock, unlock } = useScrollLock()

onMounted(() => {
  watch(
    () => ui.notifPanelOpen,
    (isOpen) => {
      if (isOpen) lock()
      else unlock()
    },
    { immediate: true }
  )
})

const headerHeight = computed(() => {
  const h = 0.1
  return h > 0 ? `${h}px` : '72px'
})

const closePanel = () => {
  ui.notifPanelOpen = false
}

</script>

<style scoped lang="scss">
.notif-backdrop{
  position:fixed;
  inset:0;
  z-index:1000 !important;
  background:rgba(15,23,42,.42);
  backdrop-filter:blur(2px);
}

.notif-panel{
  position:fixed;
  top:var(--header-height,100px);
  right:0;
  width:390px;
  max-width:100vw;
  height:calc(100vh - 0.01px);
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
  gap:.55rem;
  padding:.8rem 1rem;
  border-bottom:1px solid var(--color-border,#ececec);
  overflow-x:auto;
}

.tab{
  position:relative;
  padding:.62rem 1rem;
  min-width:88px;
  border-radius:999px;
  font-size:.78rem;
  font-weight:700;
  white-space:nowrap;
  background:transparent;
  color:var(--color-text-primary);
  transition:
    color .28s ease,
    transform .28s ease,
    background .28s ease;
  overflow:hidden;
}

/* horizontal fill animation */
.tab::before{
  content:'';
  position:absolute;
  // inset:0;
  border-radius:999px;
  background:linear-gradient(90deg,#6366f1,#8b5cf6,#ec4899);
  transform:scaleX(0);
  transform-origin:left center;
  transition:transform .35s cubic-bezier(.2,.8,.2,1);
  z-index:0;
  background:linear-gradient(90deg,#00ffff,#4cff4c,#ffff4c); 
}

/* vertical glow animation */
.tab::after{
  content:'';
  position:absolute;
  left:50%;
  top:50%;
  width:0;
  height:0;
  border-radius:50%;
  background:rgba(255,255,255,.18);
  transform:translate(-50%,-50%);
  transition:
    width .35s ease,
    height .35s ease,
    opacity .35s ease;
  opacity:0;
  z-index:1;
}

.tab{
  position:relative;
  overflow:hidden;
  isolation:isolate; /* important */
}

.tab span{
  position:relative;
  z-index:3;
}

.tab::before{
  z-index:1;
}

.tab::after{
  z-index:2;
}
.tab:hover{
  transform:translateY(-2px);
}

/* ACTIVE */
.tab.active{
  color:var(--color-text-primary);
  background-color: var(--color-bg-card-hover);
  box-shadow:0 10px 25px rgba(99,102,241,.22);
}

// .tab.active::before{
//   transform:scaleX(1);
// }

// .tab.active::after{
//   width:160%;
//   height:220%;
//   opacity:1;
// }

// /* click bounce */
// .tab:active{
//   transform:scale(.96);
// }

.notif-tabs::-webkit-scrollbar{
  height:6px;
}
.notif-tabs::-webkit-scrollbar-thumb{
  border-radius:999px;
  background:rgba(100,116,139,.28);
}
.notif-list{
  overflow:auto; //Prevent scroll inside background but allow panel scroll
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


// ── Scrollbar ─────────────────────────────
.notif-list::-webkit-scrollbar {
    width: 1px;
}

.notif-list::-webkit-scrollbar-track {
    // background: var(--color-bg-secondary);
    background: transparent;
}

.notif-list::-webkit-scrollbar-thumb {
    background: var(--primary-color);
    border-radius: 3px;
}
</style>