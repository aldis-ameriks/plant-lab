/* node:coverage disable */
import { drizzle } from 'drizzle-orm/postgres-js'
import Postgres from 'postgres'
import * as schema from './schema.ts'
import { config } from './config.ts'

export const postgres = Postgres({
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.database,
  ssl: config.db.ssl,
  max: config.db.pool
})

export const db = drizzle(postgres, { schema })
