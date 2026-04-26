/**
 * useTBy — Inline bilingual helper
 * Usage:
 * const tBy = useTBy()
 * tBy({ en: 'Hello', km: 'សួស្តី' })
 */

import { useI18n } from 'vue-i18n'

type TByInput = {
  en: string
  km: string
}

export const tBy = (obj: TByInput): string => {
  // guard: ensure we're in Vue setup context
  try {
    const i18n = useI18n()

    return i18n.locale?.value === 'km'
      ? obj.km
      : obj.en
  } catch {
    // fallback for SSR / invalid context
    return obj.en
  }
}