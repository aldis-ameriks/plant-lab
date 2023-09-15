import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'

import { ThemeSwitcher } from './ThemeSwitcher'
import { Provider } from '../Provider'

test('renders', async () => {
  render(
    <Provider>
      <ThemeSwitcher />
    </Provider>
  )
  await waitFor(() => {
    expect(screen.getByTestId('theme-switcher')).toBeVisible()
  })
})
