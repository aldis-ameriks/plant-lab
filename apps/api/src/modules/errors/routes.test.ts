import { count, eq } from 'drizzle-orm'
import { FastifyInstance } from 'fastify'
import { Context } from '../../helpers/context'
import { errors } from '../../helpers/schema'
import { setupRoutes } from '../../test-helpers/setupRoutes'
import errorRoutes from './routes'

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
  expect(result1).toBe(0)

  const response = await app.inject({
    url: '/error',
    method: 'POST',
    payload: [{ foo: 'bar' }, { foo: 'bar2' }]
  })

  expect(response.body).toBe('OK')
  expect(response.statusCode).toBe(200)

  const result2 = await context.db.query.errors.findMany({ where: eq(errors.source, 'web') })
  expect(result2.length).toBe(2)
  expect(result2[0].content).toEqual({ foo: 'bar' })
  expect(result2[0].source).toBe('web')
  expect(result2[1].content).toEqual({ foo: 'bar2' })
  expect(result2[1].source).toBe('web')
})
