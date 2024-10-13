import { count, eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import assert from 'node:assert/strict'
import { beforeEach, test } from 'node:test'
import { type Context } from '../../helpers/context.ts'
import { errors } from '../../helpers/schema.ts'
import { setupRoutes } from '../../test-helpers/setupRoutes.ts'
import errorRoutes from './routes.ts'

const route = setupRoutes(errorRoutes)

let context: Context
let app: FastifyInstance

beforeEach(() => {
  app = route.app
  context = route.context
})

test('posting error works', async () => {
  const result1 = await context.db
    .select({ count: count() })
    .from(errors)
    .then((result) => result[0].count)
  assert.equal(result1, 0)

  const response = await app.inject({
    url: '/error',
    method: 'POST',
    payload: [{ foo: 'bar' }, { foo: 'bar2' }]
  })

  assert.equal(response.body, 'OK')
  assert.equal(response.statusCode, 200)

  const result2 = await context.db.query.errors.findMany({ where: eq(errors.source, 'web') })
  assert.equal(result2.length, 2)
  assert.deepEqual(result2[0].content, { foo: 'bar' })
  assert.equal(result2[0].source, 'web')
  assert.deepEqual(result2[1].content, { foo: 'bar2' })
  assert.equal(result2[1].source, 'web')
})
