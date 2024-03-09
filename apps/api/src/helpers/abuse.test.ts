import { FastifyRequest } from 'fastify'
import { Knex } from 'knex'
import { getTestContext } from '../test-helpers/getTestContext'
import { AbuserEntity } from '../types/entities'
import { handleAbuse } from './abuse'

const getContext = getTestContext()
let knex: Knex
let log
let context

beforeEach(() => {
  context = getContext()
  knex = context.knex
  log = context.log
})

test('stores abuser', async () => {
  const ip = '127.0.3.1'
  let result = await knex<AbuserEntity>('abusers').where('ip', ip)
  expect(result.length).toBe(0)

  const params = {
    ip,
    log,
    url: '/url',
    method: 'POST',
    headers: { 'content-type': 'application/json' }
  } as unknown as FastifyRequest

  await handleAbuse(context, params)

  result = await knex<AbuserEntity>('abusers').where('ip', ip)
  expect(result.length).toBe(1)
  const createdAt = result[0].created_at
  await handleAbuse(context, params)

  result = await knex<AbuserEntity>('abusers').where('ip', ip)
  expect(result.length).toBe(1)
  expect(result[0].created_at).toEqual(createdAt)
})
