import fastify, { FastifyInstance } from 'fastify'
import { Knex } from 'knex'
import nock from 'nock'
import pino from 'pino'
import { config } from '../helpers/config'
import { Context, createContext, createRequestContext } from '../helpers/context'
import { getTestKnex } from './getTestKnex'

nock.disableNetConnect()

export function setupRoutes(routes: (fastify: FastifyInstance) => Promise<void>) {
  const app = fastify({ trustProxy: true })
  const result = { app, context: {} as Context, knex: {} as Knex }
  const knexResult = getTestKnex()

  app.register(routes)

  app.addHook('preHandler', (req, reply, done) => {
    req.ctx = createRequestContext({ ...result.context, headers: req.headers, ip: req.ip, reqId: '0' })
    done()
  })

  beforeEach(async () => {
    result.knex = knexResult.knex
    result.context = createContext({
      knex: result.knex,
      log: pino({ enabled: false }),
      config: JSON.parse(JSON.stringify({ ...config }))
    })
  })

  afterAll(async () => {
    await app.close()
  })

  return result
}
