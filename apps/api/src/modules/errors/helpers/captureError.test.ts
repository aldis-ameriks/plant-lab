import { randomUUID } from 'crypto'
import { Context } from '../../../helpers/context'
import { getTestContext } from '../../../test-helpers/getTestContext'
import { captureError } from './captureError'

const getContext = getTestContext()
let context: Context

beforeEach(() => {
  context = getContext()
})

test('payload is error with message', async () => {
  const message = randomUUID()
  await captureError(context, 'api', new Error(message), { ip: '127.0.0.1', headers: {}, reqId: 'reqId' })
  const res = await context.db.query.errors.findMany()

  expect(res.length).toBe(1)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect((res[0].content as any).error).toBe(message)
  expect(res[0].reqId).toBe('reqId')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect((res[0].content as any).stack).toBeTruthy()
})

test('payload is a string', async () => {
  const message = randomUUID()
  await captureError(context, 'api', message, { ip: '127.0.0.1', headers: {} })
  const res = await context.db.query.errors.findMany()
  expect(res.length).toBe(1)
})

test('payload is an object', async () => {
  const message = randomUUID()
  await captureError(context, 'api', { foo: message }, { ip: '127.0.0.1', headers: {} })
  const res = await context.db.query.errors.findMany()
  expect(res.length).toBe(1)
})

test('invalid ip address that throws db error', async () => {
  const message = randomUUID()
  await captureError(context, 'api', new Error(message), { ip: 'xxx', headers: {} })
})
