/**
 * useWeb — RamaGallery HTTP composable
 * Wraps fetch with auth token injection, loading/error state, and auto-refresh.
 *
 * GET  → no body sent
 * POST → body required (create / update / list with filters)
 */

import { ref, readonly } from 'vue'

export interface UseWebOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: Record<string, unknown>
  auth?: boolean
  immediate?: boolean
}

export function useWeb<T = unknown>(url: string, options: UseWebOptions = {}) {
  const config = useRuntimeConfig()
  const { method = 'GET', body, auth = true, immediate = true } = options

  const data = ref<T | null>(null)
  const error = ref<string | null>(null)
  const loading = ref(false)

  const getToken = (): string | null => {
    if (import.meta.client) {
      return localStorage.getItem('rama_token')
    }
    return null
  }

  const execute = async (overrideBody?: Record<string, unknown>) => {
    loading.value = true
    error.value = null

    const baseUrl = config.public.apiBase
    const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }

    if (auth) {
      const token = getToken()
      if (token) headers['Authorization'] = `Bearer ${token}`
    }

    const fetchOptions: RequestInit = {
      method,
      headers,
    }

    // GET deletes body; POST/PUT/PATCH include it
    if (method !== 'GET' && method !== 'DELETE') {
      const payload = overrideBody ?? body
      if (payload) fetchOptions.body = JSON.stringify(payload)
    }

    try {
      const response = await fetch(fullUrl, fetchOptions)

      if (response.status === 401) {
        // Clear stale token and redirect
        if (import.meta.client) localStorage.removeItem('rama_token')
        error.value = 'Unauthorized. Please sign in.'
        return
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        error.value = errData.detail ?? errData.message ?? `Error ${response.status}`
        return
      }

      if (response.status === 204) {
        data.value = null
      } else {
        data.value = await response.json()
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Network error'
    } finally {
      loading.value = false
    }
  }

  if (immediate && method === 'GET') {
    execute()
  }

  return {
    data: readonly(data),
    error: readonly(error),
    loading: readonly(loading),
    execute,
    refresh: execute,
  }
}
