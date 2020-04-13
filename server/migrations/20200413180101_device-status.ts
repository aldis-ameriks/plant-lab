import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  await knex.raw(`
    CREATE TYPE device_status AS enum ('new', 'pairing', 'paired', 'reset');
    ALTER TABLE devices ADD COLUMN status device_status NOT NULL DEFAULT 'new';
`);
}

export async function down(knex: Knex): Promise<any> {
  await knex.raw(`
    ALTER TABLE devices DROP COLUMN status;
    DROP TYPE device_status;
  `);
}
