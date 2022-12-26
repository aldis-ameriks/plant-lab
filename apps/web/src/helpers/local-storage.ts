export function getItem(key: string): string | null {
  if (typeof window === 'undefined' || !localStorage) {
    return null
  }

  try {
    return localStorage.getItem(key)
  } catch (e) {
    return null
  }
}

export function setItem(key: string, value: string): void {
  if (typeof window === 'undefined' || !localStorage) {
    return
  }

  try {
    localStorage.setItem(key, value)
    // eslint-disable-next-line no-empty
  } catch {}
}

export function removeItem(key: string): void {
  if (typeof window === 'undefined' || !localStorage) {
    return
  }

  try {
    localStorage.removeItem(key)
    // eslint-disable-next-line no-empty
  } catch {}
}
