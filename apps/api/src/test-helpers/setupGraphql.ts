import pino from 'pino'
import { config } from '../helpers/config'
import { Context, createContext } from '../helpers/context'
import { initApp } from '../helpers/initApp'
import { initGraphql } from '../helpers/initGraphql'
import { getTestKnex } from './getTestKnex'

export function setupGraphql() {
  const context = {
    config: structuredClone(config),
    log: pino({ enabled: false })
  } as Context

  const app = initApp({ context })
  const result = { app, context }
  const knexResult = getTestKnex()

  initGraphql({ app })

  beforeEach(async () => {
    context.knex = knexResult.knex
    result.context = createContext({
      ...result.context,
      knex: knexResult.knex,
      config: structuredClone(config)
    })
  })

  afterAll(async () => {
    await app.close()
  })

  return result
}
