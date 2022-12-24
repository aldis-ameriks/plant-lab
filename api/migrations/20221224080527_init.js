/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.raw(`
      CREATE TABLE errors (
          id int8 GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          time timestamptz DEFAULT now() NOT NULL,
          sent_at timestamptz,
          source text,
          content jsonb NOT NULL,
          headers jsonb,
          ip inet,
          req_id text CHECK (char_length(req_id) <= 100)
      );

      CREATE TABLE abusers (
          id int8 GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          ip inet NOT NULL,
          created_at timestamptz DEFAULT now() NOT NULL,
          url text NOT NULL,
          method text NOT NULL,
          headers jsonb NOT NULL
      );

      CREATE TABLE crons (
          id int8 NOT NULL PRIMARY KEY,
          name text NOT NULL,
          executed_at timestamp WITH TIME ZONE DEFAULT now() NOT NULL,
          next_execution_at timestamp WITH TIME ZONE NOT NULL
      );
  `)
}

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {}
