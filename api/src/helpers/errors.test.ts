import { Forbidden, TechnicalError, UserInputError } from './errors'

test('UserInputError', () => {
  const error = new UserInputError()
  expect(error instanceof UserInputError).toBeTruthy()
})

test('TechnicalError', () => {
  const error = new TechnicalError()
  expect(error instanceof TechnicalError).toBeTruthy()
  expect(error.message).toBe('Technical Error')
})

test('TechnicalError custom message', () => {
  const error = new TechnicalError('foo')
  expect(error instanceof TechnicalError).toBeTruthy()
  expect(error.message).toBe('foo')
})

test('Forbidden error', () => {
  const error = new Forbidden()
  expect(error instanceof Forbidden).toBeTruthy()
  expect(error.message).toBe('Forbidden')
})

test('Forbidden error with custom error', () => {
  const error = new Forbidden('foo')
  expect(error instanceof Forbidden).toBeTruthy()
  expect(error.message).toBe('foo')
})
