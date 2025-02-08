import assert from 'node:assert/strict'
import { test } from 'node:test'
import { ForbiddenError, TechnicalError, UserInputError } from './errors.ts'

test('UserInputError', () => {
  const error = new UserInputError('foo')
  assert.ok(error instanceof UserInputError)
})

test('TechnicalError', () => {
  const error = new TechnicalError()
  assert.ok(error instanceof TechnicalError)
  assert.equal(error.message, 'Technical Error')
})

test('TechnicalError custom message', () => {
  const error = new TechnicalError('foo')
  assert.ok(error instanceof TechnicalError)
  assert.equal(error.message, 'foo')
})

test('Forbidden error', () => {
  const error = new ForbiddenError()
  assert.ok(error instanceof ForbiddenError)
  assert.equal(error.message, 'Forbidden')
})

test('Forbidden error with custom error', () => {
  const error = new ForbiddenError('foo')
  assert.ok(error instanceof ForbiddenError)
  assert.equal(error.message, 'foo')
})
