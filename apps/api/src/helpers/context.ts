import { FastifyBaseLogger } from 'fastify/types/logger'
import { IncomingHttpHeaders } from 'http'
import { Knex } from 'knex'
import type { config } from './config'

type User = {
  id: string
  roles: string[]
}

export type Context = {
  knex: Knex
  log: FastifyBaseLogger
  config: typeof config
}

export type RequestContext = Context & {
  user?: User
  ip: string
  headers: IncomingHttpHeaders
  reqId: string
}

export async function createRequestContext(context: RequestContext): Promise<RequestContext> {
  const accessKey = context.headers['x-access-key'] || context.headers['access-key']
  if (accessKey) {
    context.user = await context
      .knex('user_access_keys')
      .select({ id: 'user_access_keys.user_id', roles: 'user_access_keys.roles' })
      .where('user_access_keys.access_key', accessKey)
      .first()
  }
  return context
}

export function createContext({ knex, log, config }: Pick<Context, 'knex' | 'log' | 'config'>): Context {
  return { log, knex, config }
}
