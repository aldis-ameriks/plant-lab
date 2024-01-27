import '@testing-library/jest-dom'
import { setupServer } from 'msw/node'

import { handlers } from './mocks'

// https://github.com/vercel/next.js/discussions/18373
process.env = {
  ...process.env,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  __NEXT_IMAGE_OPTS: {
    deviceSizes: [320, 420, 768, 1024, 1200],
    imageSizes: [],
    iconSizes: [],
    domains: ['plant.aldisameriks.dev'],
    path: '/_next/image',
    loader: 'default'
  }
}

// Setup requests interception using the given handlers.
export const server = setupServer(...handlers)

beforeAll(() => {
  // Enable mocking in tests.
  server.listen()
})

afterEach(() => {
  // Reset any runtime handlers tests may use.
  server.resetHandlers()
})

afterAll(() => {
  // Clean up once the tests are done.
  server.close()
})

// https://github.com/jsdom/jsdom/issues/3363
global.structuredClone = (val) => val
