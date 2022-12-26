import { Knex } from 'knex'
import { getTestContext } from '../test-helpers/getTestContext'
import { ErrorInsertEntity, Tables } from '../types/entities'
import { insert } from './sql'

const getContext = getTestContext()
let knex: Knex

beforeEach(() => {
  const context = getContext()
  knex = context.knex
})

test('works', async () => {
  const result = await knex('errors')
    .where('source', 'bulkInsert')
    .count()
    .first()
    .then((result) => result?.count)
  expect(result).toBe('0')

  await insert<ErrorInsertEntity>(knex, 'errors', [
    { content: { message: 'one' }, source: 'bulkInsert' },
    { content: { message: 'two' }, source: 'bulkInsert' }
  ])

  const result2 = await knex('errors').where('source', 'bulkInsert')
  expect(result2.length).toBe(2)
  expect(result2?.[0].content).toEqual({ message: 'one' })
  expect(result2?.[1].content).toEqual({ message: 'two' })
})

test('works with numbers', async () => {
  await knex.raw(`
      CREATE TABLE IF NOT EXISTS test_table_numbers (
          id int4,
          data numeric
      );
  `)

  let result = await knex('test_table_numbers')
  expect(result.length).toBe(0)

  await insert(knex, 'test_table_numbers' as Tables, [
    { id: 2, data: 100.5 },
    { id: 3, data: 101 }
  ])

  result = await knex('test_table_numbers')
  expect(result.length).toBe(2)

  await knex.raw(`DROP TABLE test_table_numbers`)
})

test('works with passing tail', async () => {
  const result = await knex('errors')
    .where('source', 'bulkInsert2')
    .count()
    .first()
    .then((result) => result?.count)
  expect(result).toBe('0')

  await insert<ErrorInsertEntity>(
    knex,
    'errors',
    [
      { content: { message: 'one' }, source: 'bulkInsert2' },
      { content: { message: 'two' }, source: 'bulkInsert2' }
    ],
    'on conflict do nothing'
  )

  const result2 = await knex('errors').where('source', 'bulkInsert2')
  expect(result2.length).toBe(2)
  expect(result2.find((entry) => entry.content.message === 'one')).toBeTruthy()
  expect(result2.find((entry) => entry.content.message === 'two')).toBeTruthy()
})

test('works with large array', async () => {
  const data: { content: { message: string }; source: string }[] = []
  for (let i = 0; i < 10000; i++) {
    data.push({ content: { message: 'large' }, source: 'bulkInsert' })
  }

  const result = await knex('errors')
    .where('source', 'bulkInsert')
    .count()
    .first()
    .then((result) => result?.count)
  expect(result).toBe('0')

  await insert(knex, 'errors', data)

  const result2 = await knex('errors').where('source', 'bulkInsert')
  expect(result2.length).toBe(10000)
  expect(result2?.[0].content).toEqual({ message: 'large' })
  expect(result2?.[10000 - 1].content).toEqual({ message: 'large' })
})

test('works with empty data', async () => {
  const res = await insert(knex, 'errors', [])
  expect(res).toEqual([])
})

test('works when passing falsy value', async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await insert(knex, 'errors', undefined as any)
  expect(res).toEqual([])
})

test('works with nulls', async () => {
  const res = await insert(knex, 'errors', [{ content: { message: 'null' }, source: null }])
  expect(res.length).toBe(0)
  const result = await knex('errors').where('content', '@>', JSON.stringify({ message: 'null' }))
  expect(result.length).toBe(1)
})

test('returning id', async () => {
  const res = await insert<ErrorInsertEntity>(
    knex,
    'errors',
    [{ content: { message: 'null' }, source: null, id: undefined }],
    'RETURNING id'
  )

  const result = await knex('errors').where('content', '@>', JSON.stringify({ message: 'null' }))
  expect(result.length).toBe(1)
  expect(result[0].id).toBe(res[0].id)
})

test('returning all', async () => {
  const res = await insert<ErrorInsertEntity>(
    knex,
    'errors',
    [{ content: { message: 'null' }, source: null }],
    'RETURNING *'
  )

  const result = await knex('errors').where('content', '@>', JSON.stringify({ message: 'null' }))
  expect(result.length).toBe(1)
  expect(result[0].id).toBe(res[0].id)
})

test('handles conflicts', async () => {
  await knex.raw(`
      CREATE TABLE IF NOT EXISTS test_table_unique (
          id int4 PRIMARY KEY,
          data text
      );
  `)

  const res = await insert(
    knex,
    'test_table_unique' as Tables,
    [
      {
        id: 2,
        data: '100'
      },
      {
        id: 2,
        data: '101'
      }
    ],
    'ON CONFLICT DO NOTHING RETURNING *'
  )
  expect(res.length).toBe(1)
  expect(res[0].data).toBe('100')
  await knex.raw(`DROP TABLE test_table_unique`)
})

test('camel case', async () => {
  await knex.raw(`
      CREATE TABLE IF NOT EXISTS "TestTable" (
          id serial4,
          "camelName" text
      );
  `)

  let result = await insert(knex, 'TestTable' as Tables, { camelName: 'name' }, 'RETURNING *')
  expect(result.length).toBe(1)
  expect(result[0].camelName).toBe('name')

  result = await knex('TestTable')
  expect(result.length).toBe(1)
  expect(result[0].camelName).toBe('name')

  await knex.raw(`DROP TABLE "TestTable"`)
})
