import { useEffect, useState } from 'react'
import { readStorage, writeStorage } from '../utils/storage.js'

// Part 4: light / dark theme. All colours are CSS variables in index.css, so switching the
// data-theme attribute on <html> recolours every page and chart at once.
const THEME_KEY = 'goout-theme'
const darkQuery = '(prefers-color-scheme: dark)'

const systemTheme = () => window.matchMedia?.(darkQuery).matches ? 'dark' : 'light'
const savedTheme = () => {
  const saved = readStorage(THEME_KEY, null)
  return saved === 'dark' || saved === 'light' ? saved : null
}

export default function useTheme() {
  // A saved choice wins; otherwise follow the operating system setting.
  const [theme, setTheme] = useState(() => savedTheme() ?? systemTheme())

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  // Until the user picks a theme themselves, keep following system changes.
  useEffect(() => {
    const media = window.matchMedia?.(darkQuery)
    if (!media) return
    const onChange = () => {
      if (!savedTheme()) setTheme(media.matches ? 'dark' : 'light')
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    writeStorage(THEME_KEY, next)
    setTheme(next)
  }

  return { theme, toggleTheme }
}
