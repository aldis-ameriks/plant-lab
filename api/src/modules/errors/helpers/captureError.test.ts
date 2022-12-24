import { randomUUID } from 'crypto'
import { Knex } from 'knex'
import { Context } from '../../../helpers/context'
import { getTestContext } from '../../../test-helpers/getTestContext'
import { captureError } from './captureError'

const getContext = getTestContext()
let knex: Knex
let context: Context

beforeEach(() => {
  context = getContext()
  knex = context.knex
})

test('payload is error with message', async () => {
  const message = randomUUID()
  await captureError(context, 'api', new Error(message), { ip: '127.0.0.1', headers: {}, req_id: 'reqId' })
  const res = await knex
    .raw(
      `
          SELECT *
          FROM errors
          WHERE content ->> 'error' = :message
      `,
      { message }
    )
    .then((result) => result.rows)
  expect(res.length).toBe(1)
  expect(res[0].content.error).toBe(message)
  expect(res[0].req_id).toBe('reqId')
  expect(res[0].content.stack).toBeTruthy()
})

test('payload is a string', async () => {
  const message = randomUUID()
  await captureError(context, 'api', message, { ip: '127.0.0.1', headers: {} })
  const res = await knex
    .raw(
      `
          SELECT *
          FROM errors
          WHERE content ->> 'error' = :message
      `,
      { message }
    )
    .then((result) => result.rows)
  expect(res.length).toBe(1)
})

test('payload is an object', async () => {
  const message = randomUUID()
  await captureError(context, 'api', { foo: message }, { ip: '127.0.0.1', headers: {} })
  const res = await knex
    .raw(
      `
          SELECT *
          FROM errors
          WHERE content ->> 'foo' = :message
      `,
      { message }
    )
    .then((result) => result.rows)
  expect(res.length).toBe(1)
})

test('invalid ip address that throws db error', async () => {
  const message = randomUUID()
  await captureError(context, 'api', new Error(message), { ip: 'xxx', headers: {} })
})
