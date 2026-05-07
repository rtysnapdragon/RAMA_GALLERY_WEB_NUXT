// composables/useWebSocket.ts
import { ref, onUnmounted } from 'vue'

export const useWebSocket = () => {
  const ws = ref<WebSocket | null>(null)
  const isConnected = ref(false)
  const connectionStatus = ref('Disconnected')
  const lastMessage = ref<any>(null)
  
  const connect = () => {
    const config = useRuntimeConfig()
    ws.value = new WebSocket(`${config.public.wsUrl}/ws/dashboard/`)
    
    ws.value.onopen = () => {
      isConnected.value = true
      connectionStatus.value = 'Connected'
      console.log('WebSocket connected')
    }
    
    ws.value.onmessage = (event) => {
      const data = JSON.parse(event.data)
      lastMessage.value = data
      
      const dashboardStore = useDashboardStore()
      
      if (data.type === 'dashboard_update' || data.type === 'realtime_stats') {
        dashboardStore.updateRealtimeData(data.data)
      }
    }
    
    ws.value.onerror = (error) => {
      console.error('WebSocket error:', error)
      connectionStatus.value = 'Error'
    }
    
    ws.value.onclose = () => {
      isConnected.value = false
      connectionStatus.value = 'Disconnected'
      console.log('WebSocket disconnected')
      
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        connect()
      }, 3000)
    }
  }
  
  const sendMessage = (message: any) => {
    if (ws.value && isConnected.value) {
      ws.value.send(JSON.stringify(message))
    }
  }
  
  const disconnect = () => {
    if (ws.value) {
      ws.value.close()
    }
  }
  
  // Auto-connect on mount
  connect()
  
  onUnmounted(() => {
    disconnect()
  })
  
  return {
    isConnected,
    connectionStatus,
    lastMessage,
    sendMessage,
    disconnect
  }
}