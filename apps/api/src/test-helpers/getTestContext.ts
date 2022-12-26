import nock from 'nock'
import pino from 'pino'
import { config as globalConfig } from '../helpers/config'
import { Context, createContext } from '../helpers/context'
import { getTestKnex } from './getTestKnex'

nock.disableNetConnect()

export function getTestContext(): (config?: Partial<typeof globalConfig>) => Context {
  const result = getTestKnex()
  return (config?: Partial<typeof globalConfig>) =>
    createContext({
      knex: result.knex,
      log: pino({ enabled: false }),
      config: JSON.parse(JSON.stringify({ ...globalConfig, ...config }))
    })
}
