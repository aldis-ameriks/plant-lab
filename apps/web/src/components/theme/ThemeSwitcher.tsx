import React, { useCallback, memo } from 'react'
import { Theme, useTheme } from './ThemeProvider'

const themes: Theme[] = ['light', 'dark']

export const ThemeSwitcher = memo(() => {
  const { setSelectedTheme } = useTheme()

  const changeTheme = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedTheme(e.target.value as Theme)
    },
    [setSelectedTheme]
  )

  return (
    <select defaultValue={themes[0]} onChange={changeTheme} data-testid="theme-switcher">
      {themes.map((theme) => (
        <option key={theme} value={theme}>
          {theme}
        </option>
      ))}
    </select>
  )
})
