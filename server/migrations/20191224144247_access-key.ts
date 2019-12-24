import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  await knex.raw(`
    CREATE TABLE users_access_keys
    (
        user_id    SMALLINT REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE,
        access_key VARCHAR(255),
        roles      VARCHAR(255)[]
    );
    
    ALTER TABLE users DROP COLUMN access_key;
    ALTER TABLE users DROP COLUMN roles;
  `);
}

export async function down(knex: Knex): Promise<any> {
  await knex.raw(`
    DROP TABLE users_access_keys;
    ALTER TABLE users ADD COLUMN roles VARCHAR(255)[]; 
    ALTER TABLE users ADD COLUMN access_key VARCHAR(255);
  `);
}
