import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  await knex.raw(`
    ALTER TABLE users ADD COLUMN roles VARCHAR(255)[];
  `);
}

export async function down(knex: Knex): Promise<any> {
  await knex.raw(`
    ALTER TABLE users DROP COLUMN roles;
  `);
}
