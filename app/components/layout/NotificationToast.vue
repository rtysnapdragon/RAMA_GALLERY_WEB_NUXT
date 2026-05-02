<template>
  <Teleport to="body">
    <div class="toast-stack" aria-live="polite">
      <TransitionGroup name="toast">
        <div
          v-for="toast in notification.toasts"
          :key="toast.id"
          class="toast-item"
          :class="`toast-${toast.type}`"
          @click="dismiss(toast.id)"
        >
          <!-- Icon -->
          <span class="toast-icon">
            <i v-if="toast.type === 'like'"    class="ri-heart-3-fill"></i>
            <i v-else-if="toast.type === 'follow'"  class="ri-user-follow-fill"></i>
            <i v-else-if="toast.type === 'comment'" class="ri-chat-3-fill"></i>
            <i v-else-if="toast.type === 'save'"    class="ri-bookmark-fill"></i>
            <i v-else                               class="ri-notification-3-fill"></i>
          </span>

          <!-- Text -->
          <span class="toast-msg">{{ toast.message }}</span>

          <!-- Progress bar (CSS animation) -->
          <span class="toast-progress"></span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const notification = useNotificationStore()

function dismiss(id: number) {
  notification.toasts = notification.toasts.filter(t => t.id !== id)
}
</script>

<style scoped lang="scss">
.toast-stack {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  z-index: 9999;
  pointer-events: none;

  @media (max-width: 480px) {
    bottom: 1rem;
    right: 0.75rem;
    left: 0.75rem;
  }
}

.toast-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.75rem 1rem;
  border-radius: 14px;
  min-width: 260px;
  max-width: 340px;
  pointer-events: all;
  cursor: pointer;
  overflow: hidden;
  background: var(--color-bg-card, #fff);
  border: 1px solid var(--color-border, #ececec);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);

  @media (max-width: 480px) {
    min-width: unset;
    max-width: 100%;
  }
}

/* ── Type accent colours ── */
.toast-like    { border-left: 3px solid #f43f5e; }
.toast-follow  { border-left: 3px solid #22c55e; }
.toast-comment { border-left: 3px solid #3b82f6; }
.toast-save    { border-left: 3px solid #a855f7; }
.toast-system  { border-left: 3px solid #f59e0b; }

.toast-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 0.9rem;
  flex-shrink: 0;

  .toast-like    & { background: rgba(244, 63, 94, 0.12);  color: #f43f5e; }
  .toast-follow  & { background: rgba(34, 197, 94, 0.12);  color: #22c55e; }
  .toast-comment & { background: rgba(59, 130, 246, 0.12); color: #3b82f6; }
  .toast-save    & { background: rgba(168, 85, 247, 0.12); color: #a855f7; }
  .toast-system  & { background: rgba(245, 158, 11, 0.12); color: #f59e0b; }
}

/* use parent class to tint icon properly */
.toast-like    .toast-icon { background: rgba(244,63,94,.12);  color: #f43f5e; }
.toast-follow  .toast-icon { background: rgba(34,197,94,.12);  color: #22c55e; }
.toast-comment .toast-icon { background: rgba(59,130,246,.12); color: #3b82f6; }
.toast-save    .toast-icon { background: rgba(168,85,247,.12); color: #a855f7; }
.toast-system  .toast-icon { background: rgba(245,158,11,.12); color: #f59e0b; }

.toast-msg {
  flex: 1;
  font-size: 0.84rem;
  font-weight: 600;
  line-height: 1.35;
  color: var(--color-text-primary);
}

/* ── Animated progress bar ── */
.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 100%;
  transform-origin: left;
  animation: progress 4.5s linear forwards;

  .toast-like    & { background: #f43f5e; }
  .toast-follow  & { background: #22c55e; }
  .toast-comment & { background: #3b82f6; }
  .toast-save    & { background: #a855f7; }
  .toast-system  & { background: #f59e0b; }
}

.toast-like    .toast-progress { background: #f43f5e; }
.toast-follow  .toast-progress { background: #22c55e; }
.toast-comment .toast-progress { background: #3b82f6; }
.toast-save    .toast-progress { background: #a855f7; }
.toast-system  .toast-progress { background: #f59e0b; }

@keyframes progress {
  from { transform: scaleX(1); }
  to   { transform: scaleX(0); }
}

/* ── TransitionGroup ── */
.toast-enter-active {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(60px) scale(0.9);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(60px) scale(0.95);
}
.toast-move {
  transition: transform 0.3s ease;
}
</style>
