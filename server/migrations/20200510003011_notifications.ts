import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  await knex.raw(`
    CREATE TYPE notification_type AS enum('low_moisture', 'low_battery');
    CREATE TABLE notifications (
        id serial8 PRIMARY KEY,
        user_id int2 REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE NOT NULL,
        device_id int2 REFERENCES devices(id) ON DELETE RESTRICT ON UPDATE CASCADE,
        created_at timestamptz NOT NULL DEFAULT current_timestamp,
        sent_at timestamptz,
        type notification_type NOT NULL,
        title text NOT NULL,
        body text NOT NULL 
    );
`);
}

export async function down(knex: Knex): Promise<any> {
  await knex.raw(`
      DROP TABLE notifications;
      DROP TYPE notification_type;
  `);
}
