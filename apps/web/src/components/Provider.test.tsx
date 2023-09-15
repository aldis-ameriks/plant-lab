import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'

import { Provider } from './Provider'

test('renders', async () => {
  render(<Provider />)
  await waitFor(() => {
    expect(screen.getByTestId('provider')).toBeVisible()
  })
})
