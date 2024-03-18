import pino from 'pino'
import { config } from '../helpers/config'
import { Context, createContext } from '../helpers/context'
import { initApp } from '../helpers/initApp'
import { initGraphql } from '../helpers/initGraphql'
import { getTestDb } from './getTestDb'

export function setupGraphql() {
  const context = {
    config: structuredClone(config),
    log: pino({ enabled: false })
  } as Context

  const app = initApp({ context })
  const result = { app, context }
  const dbResult = getTestDb()

  initGraphql({ app })

  beforeEach(async () => {
    context.db = dbResult.db
    context.postgres = dbResult.sql
    result.context = createContext({
      ...result.context,
      db: dbResult.db,
      config: structuredClone(config)
    })
  })

  afterAll(async () => {
    await app.close()
  })

  return result
}
