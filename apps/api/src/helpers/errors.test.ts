import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Forbidden, TechnicalError, UserInputError } from './errors.ts'

test('UserInputError', () => {
  const error = new UserInputError()
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
  const error = new Forbidden()
  assert.ok(error instanceof Forbidden)
  assert.equal(error.message, 'Forbidden')
})

test('Forbidden error with custom error', () => {
  const error = new Forbidden('foo')
  assert.ok(error instanceof Forbidden)
  assert.equal(error.message, 'foo')
})
