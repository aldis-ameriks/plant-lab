import { throttle } from './throttle'

afterEach(() => {
  jest.restoreAllMocks()
})

test('works', () => {
  const now = Date.now()
  jest.spyOn(global.Date, 'now').mockImplementation(() => now)

  const mock = jest.fn()
  const fn = throttle(mock, 1000)
  fn()
  fn()
  expect(mock).toBeCalledTimes(1)

  jest.spyOn(global.Date, 'now').mockImplementation(() => now + 500)
  fn()
  expect(mock).toBeCalledTimes(1)

  jest.spyOn(global.Date, 'now').mockImplementation(() => now + 1001)
  fn()
  expect(mock).toBeCalledTimes(2)
})
