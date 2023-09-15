import { render, screen } from '@testing-library/react'
import React from 'react'

import { ThemeProvider } from './ThemeProvider'

test('renders', () => {
  render(<ThemeProvider>child</ThemeProvider>)
  expect(screen.getByTestId('theme-provider')).toBeVisible()
})
