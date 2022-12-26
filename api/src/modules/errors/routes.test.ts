import { FastifyInstance } from 'fastify'
import { Knex } from 'knex'
import { setupRoutes } from '../../test-helpers/setupRoutes'
import { ErrorEntity } from '../../types/entities'
import errorRoutes from './routes'

const route = setupRoutes(errorRoutes)

let knex: Knex
let app: FastifyInstance

beforeEach(() => {
  knex = route.knex
  app = route.app
})

describe('error', () => {
  test('posting error works', async () => {
    const count = await knex('errors')
      .where('source', 'frontend')
      .count()
      .first()
      .then((res) => (res ? +res.count : 0))
    expect(count).toBe(0)

    const response = await app.inject({
      url: '/error',
      method: 'POST',
      payload: [{ foo: 'bar' }, { foo: 'bar2' }]
    })

    expect(response.body).toBe('OK')
    expect(response.statusCode).toBe(200)

    const errors = await knex<ErrorEntity>('errors').where('source', 'frontend')
    expect(errors.length).toBe(2)

    expect(errors[0].content).toEqual({ foo: 'bar' })
    expect(errors[0].source).toBe('frontend')
    expect(errors[1].content).toEqual({ foo: 'bar2' })
    expect(errors[1].source).toBe('frontend')
  })
})