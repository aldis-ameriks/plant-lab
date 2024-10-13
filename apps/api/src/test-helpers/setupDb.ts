import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { join } from 'node:path'
import Postgres from 'postgres'
import { config } from '../helpers/config.ts'
import { type Context } from '../helpers/context.ts'
import * as schema from '../helpers/schema.ts'

import { insertSeeds } from './seeds.ts'

const testDatabaseName = `test_${config.db.database}`

let sqlWithoutDatabase: Postgres.Sql | null = null
let sql: Postgres.Sql | null = null

export async function dropConnections(sql: Postgres.Sql): Promise<void> {
  await sql`
        SELECT pg_terminate_backend(pg_stat_activity.pid)
        FROM pg_stat_activity
        WHERE pg_stat_activity.datname = ${testDatabaseName}
          AND pid <> pg_backend_pid();
    `
}

export async function dropDatabase(sql: Postgres.Sql): Promise<void> {
  await dropConnections(sql)
  await sql`DROP DATABASE ${sql(testDatabaseName)}`
}

export async function createDatabase(sql: Postgres.Sql): Promise<void> {
  await sql`CREATE DATABASE ${sql(testDatabaseName)}`
}

export async function runMigrations(sql: Postgres.Sql, db: Context['db']): Promise<void> {
  let result = await sql`SELECT tablename
                           FROM pg_tables
                           WHERE schemaname = 'public'
    `.then((res) => res.map((row) => row.tablename))

  if (result.length) {
    throw new Error('Existing tables before migration')
  }

  await migrate(db, { migrationsFolder: join(import.meta.dirname, '../../migrations') })

  result = await sql`SELECT tablename
                       FROM pg_tables
                       WHERE schemaname = 'public'`.then((res) => res.map((row) => row.tablename))
  if (!result.length) {
    throw new Error('No tables after migration')
  }
}

export function runSeeds(db: Context['db']): Promise<void> {
  return insertSeeds(db)
}

function getTestDbConfig(database?: string) {
  return {
    host: config.db.host,
    port: config.db.port,
    username: config.db.username,
    password: config.db.password,
    database,
    ssl: config.db.ssl,
    max: 1
  }
}

export function getTestDbWithoutDatabase() {
  if (sqlWithoutDatabase) {
    // Return existing client
    return { sqlWithoutDatabase, db: drizzle(sqlWithoutDatabase, { schema }) }
  }

  sqlWithoutDatabase = Postgres(getTestDbConfig())
  return { sqlWithoutDatabase, db: drizzle(sqlWithoutDatabase, { schema }) }
}

export function getTestDbClient() {
  if (sql) {
    // Return existing client
    return { sql, db: drizzle(sql, { schema }) }
  }

  sql = Postgres(getTestDbConfig(testDatabaseName))
  return { sql, db: drizzle(sql, { schema }) }
}

export function clearTestDb() {
  sql = null
  sqlWithoutDatabase = null
}
