import pino from 'pino'
import { beforeEach, after } from 'node:test'
import { config } from '../helpers/config.ts'
import { type Context, createContext } from '../helpers/context.ts'
import { initApp } from '../helpers/initApp.ts'
import { initGraphql } from '../helpers/initGraphql.ts'
import { getTestDb } from './getTestDb.ts'

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

  after(async () => {
    await app.close()
  })

  return result
}
