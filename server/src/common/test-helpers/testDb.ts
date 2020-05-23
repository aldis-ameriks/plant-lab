import Knex from 'knex';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const knexfile = require('../../knexfile');

export const testDatabaseName = `test_${knexfile.connection.database}`;

export async function dropDatabase(knex: Knex) {
  await knex.raw(
    `
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = :database
      AND pid <> pg_backend_pid();
    `,
    { database: testDatabaseName }
  );
  await knex.raw('DROP DATABASE :database:', { database: testDatabaseName });
}

export async function createDatabase(knex: Knex) {
  await knex.raw('CREATE DATABASE :database:', { database: testDatabaseName });
}

export async function runMigrations(knex: Knex) {
  let result = await knex
    .raw(`SELECT tablename FROM pg_tables WHERE schemaname = 'public'`)
    .then((res) => res.rows.map((row) => row.tablename));

  if (result.length) {
    throw new Error('Existing tables before migration');
  }

  await knex.migrate.latest();

  result = await knex
    .raw(`SELECT tablename FROM pg_tables WHERE schemaname = 'public'`)
    .then((res) => res.rows.map((row) => row.tablename));
  if (!result.length) {
    throw new Error('No tables after migration');
  }
}

export function getTestKnexConfig(database?: string) {
  return {
    ...knexfile,
    connection: { ...knexfile.connection, database },
  };
}
