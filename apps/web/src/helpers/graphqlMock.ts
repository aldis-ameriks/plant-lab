import dynamic from 'next/dynamic'
import React from 'react'

import { config } from './config'
import { setupMockWorkers } from '../test-helpers/mocks'

export function graphqlMock(Component: React.ComponentType): React.ComponentType {
  let ComponentToRender = Component

  if (config.mockGraphql) {
    // Disable SSR
    ComponentToRender = dynamic(() => Promise.resolve(Component), { ssr: false })
  }

  if (typeof window !== 'undefined' && config.mockGraphql) {
    setupMockWorkers()
  }

  return ComponentToRender
}
