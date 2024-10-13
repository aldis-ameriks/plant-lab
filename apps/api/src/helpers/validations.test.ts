import assert from 'node:assert/strict'
import { test } from 'node:test'
import { regex } from './validations.ts'

test('regex - number', () => {
  let validNumber = '4444444444'
  let result = regex.number.test(validNumber)
  assert.ok(result)

  validNumber = '09452888173'
  result = regex.number.test(validNumber)
  assert.ok(result)

  const invalidNumber = 'xxx'
  result = regex.number.test(invalidNumber)
  assert.equal(result, false)
})
