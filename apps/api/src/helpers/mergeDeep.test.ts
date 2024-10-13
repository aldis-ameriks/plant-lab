import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mergeDeep } from './mergeDeep.ts'

test('multiple objects', () => {
  const result = mergeDeep({ foo: 'bar' }, { bar: 'foo' })
  assert.deepEqual(result, { foo: 'bar', bar: 'foo' })
})

test('single objects', () => {
  const result = mergeDeep({ foo: 'bar' })
  assert.deepEqual(result, { foo: 'bar' })
})

test('same object', () => {
  const result = mergeDeep({ foo: 'bar' }, { foo: 'bar' })
  assert.deepEqual(result, { foo: 'bar' })
})

test('overwrites', () => {
  const result = mergeDeep({ foo: 'bar' }, { foo: 'bar2' })
  assert.deepEqual(result, { foo: 'bar2' })
})

test('nested objects', () => {
  const result = mergeDeep({ foo: { one: 'one' } }, { foo: { two: 'two' } })
  assert.deepEqual(result, { foo: { one: 'one', two: 'two' } })
})

test('not an object', () => {
  assert.throws(() => mergeDeep({ foo: { one: 'one' } }, 'string'), /Not an object/)
})

test('merging arrays', () => {
  let result = mergeDeep({ foo: ['one'] }, { bar: ['two'] })
  assert.deepEqual(result, { foo: ['one'], bar: ['two'] })

  result = mergeDeep({ foo: ['one'] }, { foo: ['two'] })
  assert.deepEqual(result, { foo: ['one', 'two'] })
})
