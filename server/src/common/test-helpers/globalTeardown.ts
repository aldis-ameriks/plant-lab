import Knex from 'knex';

import { getTestKnexConfig, testDatabaseName } from './testDb';

module.exports = async function globalTeardown() {
  const knex = Knex(getTestKnexConfig());
  try {
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
  } catch (e) {
    console.error(e);
  }
};
