import { createContext, useContext } from 'react'

export type Theme = 'light' | 'dark'
export const ThemeContext = createContext<{
  theme: Theme
  toggleTheme: () => void
} | null>(null)

export const useTheme = () => {
  const value = useContext(ThemeContext)
  if (!value) throw new Error('ThemeProvider is missing.')
  return value
}
