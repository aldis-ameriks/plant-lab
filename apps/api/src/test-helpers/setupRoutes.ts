import { FastifyInstance } from 'fastify'
import nock from 'nock'
import pino from 'pino'
import { config } from '../helpers/config'
import { Context, createContext } from '../helpers/context'
import { initApp } from '../helpers/initApp'
import { getTestKnex } from './getTestKnex'

nock.disableNetConnect()

export function setupRoutes(routes: (fastify: FastifyInstance) => Promise<void>) {
  const context = {
    config: structuredClone(config),
    log: pino({ enabled: false })
  } as Context

  const app = initApp({ context })
  const result = { app, context }

  const knexResult = getTestKnex()

  app.register(routes)

  beforeEach(() => {
    context.knex = knexResult.knex
    result.context = createContext({
      ...context,
      knex: knexResult.knex,
      config: structuredClone(config)
    })
  })

  afterAll(async () => {
    await app.close()
  })

  return result
}
