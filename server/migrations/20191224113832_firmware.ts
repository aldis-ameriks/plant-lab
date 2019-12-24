import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  await knex.raw(`
    ALTER TABLE devices ADD COLUMN firmware VARCHAR(255);
  `);
}

export async function down(knex: Knex): Promise<any> {
  await knex.raw(`
    ALTER TABLE devices DROP COLUMN firmware;
  `);
}
