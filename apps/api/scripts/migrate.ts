import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { join } from 'node:path'
import Postgres from 'postgres'
import { config } from '../src/helpers/config'

export const postgres = Postgres({
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.database,
  ssl: config.db.ssl,
  max: 1
})

const db = drizzle(postgres)

;(async () => {
  await migrate(db, { migrationsFolder: join(__dirname, '../migrations') })
  await postgres.end()
})()
