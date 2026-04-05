import { useState, useEffect } from 'react'

const STORAGE_KEY = 'repx_theme'

function resolveInitial() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved !== null) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  } catch {
    return false
  }
}

/**
 * Manages dark/light theme preference.
 * Applies `.dark` class to <html> immediately on change.
 * Persists to localStorage so the inline script in index.html
 * can restore it before React mounts (no flash).
 */
export function useTheme() {
  const [isDark, setIsDark] = useState(resolveInitial)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    try {
      localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light')
    } catch {}
  }, [isDark])

  const toggle = () => setIsDark(v => !v)

  return { isDark, toggle }
}
