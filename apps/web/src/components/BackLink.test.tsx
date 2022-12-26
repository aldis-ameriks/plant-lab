import { render } from '@testing-library/react'
import React from 'react'

import { BackLink } from './BackLink'

describe('BackLink', () => {
  it('renders', () => {
    const result = render(<BackLink />)
    expect(result.getByTestId('back-link')).toBeVisible()
  })
})
