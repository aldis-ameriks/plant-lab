/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.raw(`
      CREATE TABLE users (
          id int8 GENERATED ALWAYS AS IDENTITY PRIMARY KEY
      );

      CREATE TABLE user_access_keys (
          user_id int8 NOT NULL REFERENCES users ON UPDATE CASCADE ON DELETE CASCADE,
          access_key text NOT NULL UNIQUE,
          roles text[] NOT NULL
      );

      CREATE TABLE users_devices (
          user_id int8 NOT NULL REFERENCES users ON UPDATE CASCADE ON DELETE RESTRICT,
          device_id int8 NOT NULL REFERENCES devices (id) ON UPDATE CASCADE ON DELETE RESTRICT,
          PRIMARY KEY (user_id, device_id)
      );
  `)
}

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {}
