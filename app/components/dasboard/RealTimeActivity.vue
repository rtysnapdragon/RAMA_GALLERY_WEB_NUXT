<template>
  <div class="real-time-activity">
    <div class="real-time-activity__header">
      <h3>Real-time Activity</h3>
      <div class="live-badge">
        <span class="live-badge__dot"></span>
        LIVE
      </div>
    </div>
    
    <div class="real-time-activity__list">
      <div
        v-for="activity in activities"
        :key="activity.id"
        class="activity-item"
        :class="`activity-item--${activity.type}`"
      >
        <div class="activity-item__icon">
          <Icon :name="getActivityIcon(activity.type)" :size="20" />
        </div>
        <div class="activity-item__content">
          <p class="activity-item__text">
            <strong>{{ activity.username }}</strong>
            {{ getActivityText(activity.type) }}
            <span v-if="activity.details" class="activity-item__details">
              "{{ activity.details }}"
            </span>
          </p>
          <span class="activity-item__time">{{ formatTime(activity.timestamp) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Activity {
  id: string
  type: string
  username: string
  details?: string
  timestamp: string
}

const activities = ref<Activity[]>([])
let ws: WebSocket | null = null

const getActivityIcon = (type: string): string => {
  const icons: Record<string, string> = {
    like: 'heroicons:heart',
    comment: 'heroicons:chat-bubble-left',
    view: 'heroicons:eye',
    upload: 'heroicons:arrow-up-tray',
    login: 'heroicons:arrow-right-on-rectangle'
  }
  return icons[type] || 'heroicons:bell'
}

const getActivityText = (type: string): string => {
  const texts: Record<string, string> = {
    like: 'liked a photo',
    comment: 'commented on a photo',
    view: 'viewed a photo',
    upload: 'uploaded a new photo',
    login: 'logged in'
  }
  return texts[type] || 'performed an action'
}

const formatTime = (timestamp: string): string => {
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000)
  
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

const addActivity = (activity: Activity) => {
  activities.value.unshift(activity)
  if (activities.value.length > 50) {
    activities.value.pop()
  }
}

const connectWebSocket = () => {
  ws = new WebSocket('ws://localhost:8000/ws/dashboard')
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if (data.type === 'activity') {
      addActivity(data.activity)
    }
  }
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error)
    setTimeout(connectWebSocket, 5000)
  }
}

onMounted(() => {
  connectWebSocket()
})

onUnmounted(() => {
  if (ws) {
    ws.close()
  }
})
</script>

<style scoped lang="scss">
.real-time-activity {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: $border-radius-lg;
  overflow: hidden;
  
  &__header {
    padding: $spacing-lg;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h3 {
      font-size: 1.125rem;
      font-weight: 600;
    }
  }
  
  &__list {
    max-height: 500px;
    overflow-y: auto;
  }
}

.live-badge {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  background: rgba($danger-color, 0.1);
  padding: $spacing-xs $spacing-md;
  border-radius: $border-radius-full;
  font-size: 0.75rem;
  font-weight: 600;
  color: $danger-color;
  
  &__dot {
    width: 8px;
    height: 8px;
    background: $danger-color;
    border-radius: 50%;
    animation: pulse 1.5s infinite;
  }
}

.activity-item {
  display: flex;
  gap: $spacing-md;
  padding: $spacing-md;
  border-bottom: 1px solid var(--border-color);
  transition: background-color $transition-fast;
  
  &:hover {
    background: var(--hover-bg);
  }
  
  &__icon {
    width: 36px;
    height: 36px;
    border-radius: $border-radius-full;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  
  &--like &__icon {
    background: rgba($danger-color, 0.1);
    color: $danger-color;
  }
  
  &--comment &__icon {
    background: rgba($info-color, 0.1);
    color: $info-color;
  }
  
  &--view &__icon {
    background: rgba($primary-color, 0.1);
    color: $primary-color;
  }
  
  &__content {
    flex: 1;
  }
  
  &__text {
    font-size: 0.875rem;
    margin-bottom: $spacing-xs;
    
    strong {
      font-weight: 600;
    }
  }
  
  &__details {
    color: var(--text-secondary);
    font-style: italic;
  }
  
  &__time {
    font-size: 0.75rem;
    color: var(--text-secondary);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>