import nock from 'nock'
import pino from 'pino'
import { config as globalConfig } from '../helpers/config.ts'
import { type Context, createContext } from '../helpers/context.ts'
import { getTestDb } from './getTestDb.ts'

nock.disableNetConnect()

export function getTestContext(): (config?: Partial<typeof globalConfig>) => Context {
  const result = getTestDb()
  return (config?: Partial<typeof globalConfig>) =>
    createContext({
      db: result.db,
      sql: result.sql,
      log: pino({ enabled: false }),
      config: structuredClone({ ...globalConfig, ...config })
    })
}
