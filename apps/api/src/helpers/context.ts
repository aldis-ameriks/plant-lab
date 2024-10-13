import { eq } from 'drizzle-orm'
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver'
import type { IncomingHttpHeaders } from 'node:http'
import type { Logger } from 'pino'
import Postgres from 'postgres'
import type { config } from './config.ts'
import * as schema from './schema.ts'
import { userAccessKeys } from './schema.ts'

type User = {
  id: (typeof userAccessKeys.$inferSelect)['userId']
  roles: (typeof userAccessKeys.$inferSelect)['roles']
}

export type Context = {
  postgres: Postgres.Sql
  db: PostgresJsDatabase<typeof schema>
  log: Logger
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

  if (accessKey && typeof accessKey === 'string') {
    context.user = (
      await context.db
        .select({ id: userAccessKeys.userId, roles: userAccessKeys.roles })
        .from(userAccessKeys)
        .where(eq(userAccessKeys.accessKey, accessKey))
        .limit(1)
    )[0]
  }

  return context
}

export function createContext({
  postgres,
  db,
  log,
  config
}: Pick<Context, 'postgres' | 'db' | 'log' | 'config'>): Context {
  return { log, db, postgres, config }
}
