import nock from 'nock'
import pino from 'pino'
import { config as globalConfig } from '../helpers/config'
import { Context, createContext } from '../helpers/context'
import { getTestDb } from './getTestDb'

nock.disableNetConnect()

export function getTestContext(): (config?: Partial<typeof globalConfig>) => Context {
  const result = getTestDb()
  return (config?: Partial<typeof globalConfig>) =>
    createContext({
      db: result.db,
      postgres: result.sql,
      log: pino({ enabled: false }),
      config: structuredClone({ ...globalConfig, ...config })
    })
}
