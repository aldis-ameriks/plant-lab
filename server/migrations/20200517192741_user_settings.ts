import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  await knex.raw(`
      CREATE TABLE user_settings
      (
          user_id int2 REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE,
          name    varchar(255) NOT NULL,
          value   varchar(255) NOT NULL
      );
      CREATE UNIQUE INDEX user_settings_uniq ON user_settings (user_id, name);
  `);
}

export async function down(knex: Knex): Promise<any> {
  await knex.raw(`
      DROP TABLE user_settings;
  `);
}
