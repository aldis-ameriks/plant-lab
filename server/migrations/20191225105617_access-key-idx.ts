import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  await knex.raw(`
    CREATE UNIQUE INDEX access_key_idx ON users_access_keys (access_key);
  `);
}

export async function down(knex: Knex): Promise<any> {
  await knex.raw(`
    DROP INDEX access_key_idx;
  `);
}
