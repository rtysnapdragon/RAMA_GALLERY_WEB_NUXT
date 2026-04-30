/**
 * useWeb — RamaGallery HTTP composable (Axios version)
 */

import { ref, readonly } from 'vue'
import axios, { type AxiosRequestConfig } from 'axios'

export interface UseWebOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: Record<string, unknown>
  auth?: boolean
  immediate?: boolean
  headers?: Record<string, string>
}

export function useWeb<T = unknown>(url: string, options: UseWebOptions = {}) {
  const config = useRuntimeConfig()

  const {
    method = 'GET',
    body,
    auth = true,
    immediate = true,
    headers: customHeaders,
  } = options

  const data = ref<T | null>(null)
  const error = ref<string | null>(null)
  const loading = ref(false)

  const getToken = (): string | null => {
    if (import.meta.client) {
      return localStorage.getItem('rama_token')
    }
    return null
  }

  const instance = axios.create({
    baseURL: config.public.apiBase,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  const execute = async (overrideBody?: Record<string, unknown>) => {
    loading.value = true
    error.value = null

    try {
      const headers: Record<string, string> = {
        ...(customHeaders || {}),
      }

      if (auth) {
        const token = getToken()
        if (token) {
          headers.Authorization = `Bearer ${token}`
        }
      }

      const requestConfig: AxiosRequestConfig = {
        url,
        method,
        headers,
      }

      const payload = overrideBody ?? body

      if (method !== 'GET' && method !== 'DELETE' && payload) {
        requestConfig.data = payload
      }

      const response = await instance.request<T>(requestConfig)

      data.value = response.data
    } catch (err: any) {
      if (err?.response?.status === 401) {
        if (import.meta.client) {
          localStorage.removeItem('rama_token')
        }
        error.value = 'Unauthorized. Please sign in.'
        return
      }

      error.value =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err.message ||
        'Network error'
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