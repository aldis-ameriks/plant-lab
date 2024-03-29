import { render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { useRouter } from 'next/router'
import React from 'react'
import { config } from '../helpers/config'
import { server } from '../test-helpers/setupTests'
import { NoData } from './NoData'

jest.mock('next/router', () => ({ useRouter: jest.fn() }))

beforeEach(() => {
  const mockRouter = { pathname: 'some-path' }
  ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
})

test('capture error is disabled', async () => {
  const captureErrorMock = jest.fn()
  server.use(
    http.post(`${config.api.baseUrl}/error`, ({ request }) => {
      captureErrorMock(JSON.stringify(request.body))
      return HttpResponse.json({})
    })
  )

  const errorKey = 'key'
  render(<NoData errorKey={errorKey} data-testid="test-id" />)

  expect(screen.getByTestId('test-id')).toBeInTheDocument()
  expect(screen.getByTestId('test-id')).toHaveTextContent('')

  await waitFor(async () => {
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(captureErrorMock).toHaveBeenCalledTimes(0)
  })
})

test('captures error', async () => {
  const captureErrorMock = jest.fn()
  server.use(
    http.post(`${config.api.baseUrl}/error`, async ({ request }) => {
      captureErrorMock(await request.json())
      return HttpResponse.json({})
    })
  )

  const errorKey = 'key'
  config.captureErrors = true
  render(<NoData errorKey={errorKey} data-testid="test-id" />)
  config.captureErrors = false

  expect(screen.getByTestId('test-id')).toBeInTheDocument()
  expect(screen.getByTestId('test-id')).toHaveTextContent('')

  await waitFor(
    () => {
      expect(captureErrorMock).toHaveBeenCalledTimes(1)
      expect(captureErrorMock).toHaveBeenCalledWith([
        { error: 'Error: Unexpected rendering of no data, errorKey: key, path: some-path' }
      ])
    },
    { timeout: 1000 }
  )
})
