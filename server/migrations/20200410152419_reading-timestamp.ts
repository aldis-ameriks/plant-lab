import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  await knex.raw(`
    ALTER TABLE readings ALTER COLUMN timestamp SET DEFAULT CURRENT_TIMESTAMP;
    ALTER TABLE faulty_readings ALTER COLUMN timestamp SET DEFAULT CURRENT_TIMESTAMP;
  `);
}

export async function down(knex: Knex): Promise<any> {
  await knex.raw(`
    ALTER TABLE readings ALTER COLUMN timestamp DROP DEFAULT;
    ALTER TABLE faulty_readings ALTER COLUMN timestamp DROP DEFAULT;
  `);
}
