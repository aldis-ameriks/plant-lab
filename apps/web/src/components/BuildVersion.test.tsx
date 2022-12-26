import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'

import { BuildVersion } from './BuildVersion'
import { Provider } from './Provider'

describe('BuildVersion', () => {
  test('renders', async () => {
    render(
      <Provider>
        <BuildVersion />
      </Provider>
    )
    await waitFor(() => {
      expect(screen.getByTestId('build-version')).toBeInTheDocument()
    })
  })
})
