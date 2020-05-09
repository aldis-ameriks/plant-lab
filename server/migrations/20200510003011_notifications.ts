import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  await knex.raw(`
    CREATE TABLE notifications (
        id serial8,
        user_id int2 REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE NOT NULL ,
        device_id int2 REFERENCES devices(id) ON DELETE RESTRICT ON UPDATE CASCADE,
        created_at timestamptz NOT NULL DEFAULT current_timestamp,
        sent_at timestamptz,
        title text NOT NULL,
        body text NOT NULL 
    );
`);
}

export async function down(knex: Knex): Promise<any> {
  await knex.raw(`
      DROP TABLE notifications;
  `);
}
