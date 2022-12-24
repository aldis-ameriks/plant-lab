import { Knex, knex as initKnex } from 'knex'

import * as knexfile from '../helpers/knexfile'
import { insertSeeds } from './seeds'

const testDatabaseName = `test_${knexfile.connection.database}`

let knexWithoutDatabase: Knex
let knex: Knex

export async function dropConnections(knex: Knex): Promise<void> {
  await knex.raw(
    `
        SELECT pg_terminate_backend(pg_stat_activity.pid)
        FROM pg_stat_activity
        WHERE pg_stat_activity.datname = :database
          AND pid <> pg_backend_pid();
    `,
    { database: testDatabaseName }
  )
}

export async function dropDatabase(knex: Knex): Promise<void> {
  await dropConnections(knex)
  await knex.raw('DROP DATABASE :database:', { database: testDatabaseName })
}

export async function createDatabase(knex: Knex): Promise<void> {
  await knex.raw('CREATE DATABASE :database:', { database: testDatabaseName })
}

export async function runMigrations(knex: Knex): Promise<void> {
  let result = await knex
    .raw(
      `SELECT tablename
          FROM pg_tables
          WHERE schemaname = 'public'`
    )
    .then((res) => res.rows.map((row) => row.tablename))

  if (result.length) {
    throw new Error('Existing tables before migration')
  }

  await knex.migrate.latest()

  result = await knex
    .raw(
      `SELECT tablename
          FROM pg_tables
          WHERE schemaname = 'public'`
    )
    .then((res) => res.rows.map((row) => row.tablename))
  if (!result.length) {
    throw new Error('No tables after migration')
  }
}

export function runSeeds(knex: Knex): Promise<void> {
  return insertSeeds(knex)
}

function getTestKnexConfig(database?: string) {
  return {
    ...knexfile,
    pool: {
      afterCreate: function (conn, done) {
        conn.on('notice', function (msg) {
          // Migrations are causing these notices, e.g. drop if exists. Ignoring to reduce spam.
          if (!msg.message.includes('does not exist') && !msg.message.includes('truncate cascade')) {
            console.log('received notice', msg.message)
          }
        })
        done(null, conn)
      }
    },
    connection: { ...knexfile.connection, database }
  }
}

export function getTestKnexWithoutDatabase(): Knex {
  if (knexWithoutDatabase) {
    if (!knexWithoutDatabase.client.pool || knexWithoutDatabase.client.pool.destroyed) {
      knexWithoutDatabase.initialize()
    }
    return knexWithoutDatabase
  }

  knexWithoutDatabase = initKnex(getTestKnexConfig())
  return knexWithoutDatabase
}

export function getTestKnexClient(): Knex {
  if (knex) {
    if (!knex.client.pool || knex.client.pool.destroyed) {
      knex.initialize()
    }
    return knex
  }

  knex = initKnex(getTestKnexConfig(testDatabaseName))
  return knex
}
