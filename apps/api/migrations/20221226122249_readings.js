/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.raw(`
      ALTER TABLE readings ALTER COLUMN reading_id DROP NOT NULL;
  `)
}

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

}
