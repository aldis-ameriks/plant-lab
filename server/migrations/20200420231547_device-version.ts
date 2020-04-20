import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  await knex.raw(`
      ALTER TABLE devices RENAME type TO version;
      ALTER TYPE device_type RENAME TO device_version;

      CREATE TYPE device_type AS enum ('hub', 'sensor');
      ALTER TABLE devices ADD COLUMN type device_type NOT NULL DEFAULT 'sensor';
  `);
}

export async function down(knex: Knex): Promise<any> {
  await knex.raw(`
      ALTER TABLE devices RENAME version TO type;
      ALTER TYPE device_version RENAME TO device_type;

      ALTER TABLE devices DROP COLUMN type;
      DROP TYPE device_type;
  `);
}
