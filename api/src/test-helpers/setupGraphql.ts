import fastify from 'fastify'
import { Knex } from 'knex'
import mercurius from 'mercurius'
import pino from 'pino'
import { config } from '../helpers/config'
import { Context, createContext, createRequestContext } from '../helpers/context'
import modules from '../modules'
import { getTestKnex } from './getTestKnex'

const { loaders, resolvers, schema } = modules

export function setupGraphql() {
  const app = fastify()
  const result = { app, context: {} as Context, knex: {} as Knex }
  const knexResult = getTestKnex()

  app.register(mercurius, {
    schema,
    resolvers,
    loaders,
    context: (req) => createRequestContext({ ...result.context, headers: req.headers, ip: req.ip, reqId: '0' })
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
