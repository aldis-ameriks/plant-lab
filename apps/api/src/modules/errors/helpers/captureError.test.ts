import assert from 'node:assert/strict'
import { beforeEach, test } from 'node:test'
import { randomUUID } from 'crypto'
import { type Context } from '../../../helpers/context.ts'
import { getTestContext } from '../../../test-helpers/getTestContext.ts'
import { captureError } from './captureError.ts'

const getContext = getTestContext()
let context: Context

beforeEach(() => {
  context = getContext()
})

test('payload is error with message', async () => {
  const message = randomUUID()
  await captureError(context, 'api', new Error(message), { ip: '127.0.0.1', headers: {}, reqId: 'reqId' })
  const res = await context.db.query.errors.findMany()

  assert.equal(res.length, 1)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  assert.equal((res[0].content as any).error, message)
  assert.equal(res[0].reqId, 'reqId')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  assert.ok((res[0].content as any).stack)
})

test('payload is a string', async () => {
  const message = randomUUID()
  await captureError(context, 'api', message, { ip: '127.0.0.1', headers: {} })
  const res = await context.db.query.errors.findMany()
  assert.equal(res.length, 1)
})

test('payload is an object', async () => {
  const message = randomUUID()
  await captureError(context, 'api', { foo: message }, { ip: '127.0.0.1', headers: {} })
  const res = await context.db.query.errors.findMany()
  assert.equal(res.length, 1)
})

test('invalid ip address that throws db error', async () => {
  const message = randomUUID()
  await captureError(context, 'api', new Error(message), { ip: 'xxx', headers: {} })
})
