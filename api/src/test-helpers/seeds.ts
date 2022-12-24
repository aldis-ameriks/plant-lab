import { Knex } from 'knex'

export async function insertSeeds(_knex: Knex): Promise<void> {
  //
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function insertWithIdentityColumn(knex: Knex, table: string, value: Record<string, unknown>): Promise<void> {
  const sql = await knex(table).insert(value).toSQL()
  sql.sql = sql.sql.replace(' values ', ' overriding system value values ')
  await knex.raw(sql.sql, sql.bindings)
}
