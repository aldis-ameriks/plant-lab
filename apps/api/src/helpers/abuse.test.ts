import { eq } from 'drizzle-orm'
import { FastifyRequest } from 'fastify'
import { getTestContext } from '../test-helpers/getTestContext'
import { handleAbuse } from './abuse'
import { Context } from './context'
import { abusers } from './schema'

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
  expect(result).toBeUndefined()

  const params = {
    ip,
    log: context.log,
    url: '/url',
    method: 'POST',
    headers: { 'content-type': 'application/json' }
  } as unknown as FastifyRequest

  await handleAbuse(context, params)

  result = await context.db.query.abusers.findFirst({ where: eq(abusers.ip, ip) })
  expect(result?.createdAt).not.toBeUndefined()
  const createdAt = result?.createdAt
  await handleAbuse(context, params)

  result = await context.db.query.abusers.findFirst({ where: eq(abusers.ip, ip) })
  expect(result?.createdAt).not.toBeUndefined()
  expect(result?.createdAt).toEqual(createdAt)
})
