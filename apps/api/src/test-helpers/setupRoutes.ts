import { FastifyInstance } from 'fastify'
import nock from 'nock'
import pino from 'pino'
import { config } from '../helpers/config'
import { Context, createContext } from '../helpers/context'
import { initApp } from '../helpers/initApp'
import { getTestDb } from './getTestDb'

nock.disableNetConnect()

export function setupRoutes(routes: (fastify: FastifyInstance) => Promise<void>) {
  const context = {
    config: structuredClone(config),
    log: pino({ enabled: false })
  } as Context

  const app = initApp({ context })
  const result = { app, context }

  const dbResult = getTestDb()

  app.register(routes)

  beforeEach(() => {
    context.db = dbResult.db
    result.context = createContext({
      ...context,
      db: dbResult.db,
      config: structuredClone(config)
    })
  })

  afterAll(async () => {
    await app.close()
  })

  return result
}
