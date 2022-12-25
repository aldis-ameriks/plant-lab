/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.raw(`
      SELECT *
      FROM abusers;
      CREATE EXTENSION IF NOT EXISTS timescaledb_toolkit;

      CREATE TYPE device_version AS enum ('hub_10', 'sensor_10');
      CREATE TYPE device_status AS enum ('new', 'pairing', 'paired', 'reset');
      CREATE TYPE device_type AS enum ('hub', 'sensor');

      CREATE TABLE devices (
          id int8 NOT NULL PRIMARY KEY,
          name text NOT NULL,
          room text,
          firmware text NOT NULL,
          address inet,
          last_seen_at timestamptz,
          version device_version NOT NULL,
          status device_status NOT NULL DEFAULT 'new',
          type device_type NOT NULL
      );

      CREATE TABLE readings (
          time timestamptz NOT NULL,
          reading_id text NOT NULL,
          device_id int8 NOT NULL REFERENCES devices (id) ON UPDATE CASCADE ON DELETE CASCADE,
          hub_id int8 REFERENCES devices (id) ON UPDATE CASCADE ON DELETE CASCADE,
          moisture numeric,
          moisture_raw numeric,
          moisture_max numeric,
          moisture_min numeric,
          temperature numeric,
          light numeric,
          battery_voltage numeric,
          signal numeric
      );

      SELECT create_hypertable('readings', 'time');
      CREATE INDEX ON readings (device_id, time DESC);
      CREATE INDEX ON readings (reading_id, time DESC);
  `)
}

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (_knex) {}
