import { type FastifyInstance } from 'fastify'
import { beforeEach, after } from 'node:test'
import nock from 'nock'
import pino from 'pino'
import { config } from '../helpers/config.ts'
import { type Context, createContext } from '../helpers/context.ts'
import { initApp } from '../helpers/initApp.ts'
import { getTestDb } from './getTestDb.ts'

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

  after(async () => {
    await app.close()
  })

  return result
}
