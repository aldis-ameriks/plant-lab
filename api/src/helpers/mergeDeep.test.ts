import { mergeDeep } from './mergeDeep'

test('multiple objects', () => {
  const result = mergeDeep({ foo: 'bar' }, { bar: 'foo' })
  expect(result).toEqual({ foo: 'bar', bar: 'foo' })
})

test('single objects', () => {
  const result = mergeDeep({ foo: 'bar' })
  expect(result).toEqual({ foo: 'bar' })
})

test('same object', () => {
  const result = mergeDeep({ foo: 'bar' }, { foo: 'bar' })
  expect(result).toEqual({ foo: 'bar' })
})

test('overwrites', () => {
  const result = mergeDeep({ foo: 'bar' }, { foo: 'bar2' })
  expect(result).toEqual({ foo: 'bar2' })
})

test('nested objects', () => {
  const result = mergeDeep({ foo: { one: 'one' } }, { foo: { two: 'two' } })
  expect(result).toEqual({ foo: { one: 'one', two: 'two' } })
})

test('not an object', () => {
  expect(() => {
    mergeDeep({ foo: { one: 'one' } }, 'string')
  }).toThrow('Not an object')
})

test('merging arrays', () => {
  let result = mergeDeep({ foo: ['one'] }, { bar: ['two'] })
  expect(result).toEqual({ foo: ['one'], bar: ['two'] })

  result = mergeDeep({ foo: ['one'] }, { foo: ['two'] })
  expect(result).toEqual({ foo: ['one', 'two'] })
})
