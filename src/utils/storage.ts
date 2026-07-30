const STORAGE_PREFIX = 'kidlearn:'

export function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = uni.getStorageSync(STORAGE_PREFIX + key)
    if (raw === '' || raw === undefined || raw === null) return fallback
    return typeof raw === 'string' ? (JSON.parse(raw) as T) : (raw as T)
  } catch {
    return fallback
  }
}

export function setItem<T>(key: string, value: T): void {
  try {
    uni.setStorageSync(STORAGE_PREFIX + key, JSON.stringify(value))
  } catch (e) {
    console.warn('storage set failed', key, e)
  }
}

export function removeItem(key: string): void {
  try {
    uni.removeStorageSync(STORAGE_PREFIX + key)
  } catch {
    /* ignore */
  }
}

export function clearAll(): void {
  try {
    const info = uni.getStorageInfoSync()
    info.keys
      .filter((k) => k.startsWith(STORAGE_PREFIX))
      .forEach((k) => uni.removeStorageSync(k))
  } catch {
    /* ignore */
  }
}
