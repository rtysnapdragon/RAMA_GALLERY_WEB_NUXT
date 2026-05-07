export const useLocalData = () => {
  const { locale } = useI18n()

  /**
   * Helper to get localized string from an object.
   * Supports structures like:
   * 1. { en: 'Hello', km: 'សួស្តី' }
   * 2. obj.title and obj.title_km
   * 3. obj.name and obj.name_km
   */
  const tBy = (obj: any, key: string = '') => {
    if (!obj) return ''
    
    // If it's an object with { en, km } directly
    if (typeof obj === 'object' && ('en' in obj || 'km' in obj)) {
      return locale.value === 'km' && obj.km ? obj.km : obj.en || ''
    }

    // If a base key is provided (e.g., 'title' -> checks 'title' and 'title_km')
    if (key) {
      if (locale.value === 'km' && obj[`${key}_km`]) {
        return obj[`${key}_km`]
      }
      return obj[key] || ''
    }

    // Fallback
    return ''
  }

  return {
    tBy
  }
}
