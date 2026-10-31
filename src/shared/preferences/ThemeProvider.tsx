import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import { ThemeContext } from './themeContext'
import type { Theme } from './themeContext'
const themeKey = 'fastcart-theme'
const readTheme = (): Theme => {
  try {
    return localStorage.getItem(themeKey) === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(readTheme)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.style.colorScheme = theme
    try {
      localStorage.setItem(themeKey, theme)
    } catch {
      return
    }
  }, [theme])
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === themeKey)
        setTheme(event.newValue === 'dark' ? 'dark' : 'light')
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])
  return (
    <ThemeContext
      value={{
        theme,
        toggleTheme: () =>
          setTheme((value) => (value === 'dark' ? 'light' : 'dark')),
      }}
    >
      {children}
    </ThemeContext>
  )
}
