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

export function createRequestContext(context: RequestContext): RequestContext {
  return context
}

export function createContext({ knex, log, config }: Pick<Context, 'knex' | 'log' | 'config'>): Context {
  return { log, knex, config }
}
