<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div
        v-for="t in notification.toasts"
        :key="t.id"
        class="toast"
      >
        <div class="icon" :class="t.type">
          <i v-if="t.type === 'like'" class="ri-heart-fill"></i>
          <i v-else-if="t.type === 'comment'" class="ri-chat-3-fill"></i>
          <i v-else-if="t.type === 'follow'" class="ri-user-follow-fill"></i>
          <i v-else class="ri-notification-3-fill"></i>
        </div>

        <div class="content">
          {{ t.message }}
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
const notification = useNotificationStore()
</script>

<style scoped lang="scss">
.toast-container {
  position: fixed;
  top: 90px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 9999;
}

.toast {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 12px 14px;
  border-radius: 14px;
  background: rgba(20,20,30,.95);
  color: white;
  min-width: 260px;
  box-shadow: 0 10px 30px rgba(0,0,0,.25);
  backdrop-filter: blur(10px);
}

.icon {
  font-size: 18px;
}

.icon.like { color: #ff2d55 }
.icon.comment { color: #3b82f6 }
.icon.follow { color: #22c55e }

.toast-enter-active,
.toast-leave-active {
  transition: all .35s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(60px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(60px);
}
</style>