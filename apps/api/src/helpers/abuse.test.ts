import { eq } from 'drizzle-orm'
import { type FastifyRequest } from 'fastify'
import assert from 'node:assert/strict'
import { beforeEach, test } from 'node:test'
import { getTestContext } from '../test-helpers/getTestContext.ts'
import { handleAbuse } from './abuse.ts'
import { type Context } from './context.ts'
import { abusers } from './schema.ts'

const getContext = getTestContext()
let context: Context

beforeEach(() => {
  context = getContext()
})

test('stores abuser', async () => {
  await context.db.insert(abusers).values({
    headers: {},
    ip: '127.0.0.1',
    method: '',
    url: ''
  })

  const ip = '127.0.3.1'
  let result = await context.db.query.abusers.findFirst({ where: eq(abusers.ip, ip) })
  assert.ok(result === undefined)

  const params = {
    ip,
    log: context.log,
    url: '/url',
    method: 'POST',
    headers: { 'content-type': 'application/json' }
  } as unknown as FastifyRequest

  await handleAbuse(context, params)

  result = await context.db.query.abusers.findFirst({ where: eq(abusers.ip, ip) })
  assert.ok(result?.createdAt)
  const createdAt = result?.createdAt
  await handleAbuse(context, params)

  result = await context.db.query.abusers.findFirst({ where: eq(abusers.ip, ip) })
  assert.ok(result?.createdAt)
  assert.equal(result?.createdAt.getTime(), createdAt.getTime())
})
