import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  await knex.raw(`
      CREATE UNIQUE INDEX unique_users_devices_idx ON users_devices (user_id, device_id);
  `);
}

export async function down(knex: Knex): Promise<any> {
  await knex.raw(`
      DROP INDEX unique_users_devices_idx;
  `);
}
