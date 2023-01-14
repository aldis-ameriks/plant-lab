import React, { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'

import { theme, themeDark } from './theme'

export type Theme = 'light' | 'dark'

type ThemeContextType = {
  selectedTheme: Theme
  setSelectedTheme: (t: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [selectedTheme, setSelectedTheme] = useState<Theme>('light')

  const themes: Record<Theme, typeof theme> = useMemo(
    () => ({
      light: theme,
      dark: themeDark
    }),
    []
  )

  const context = useMemo(
    () => ({
      selectedTheme,
      setSelectedTheme
    }),
    [selectedTheme]
  )

  return (
    <ThemeContext.Provider value={context}>
      <StyledThemeProvider theme={themes[selectedTheme]}>
        <div data-testid="theme-provider">{children}</div>
      </StyledThemeProvider>
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
