import 'dotenv/config'
import { appendFileSync } from 'fs'
import { join } from 'path'
import generate, { SchemaResult, TypeResult } from 'pg-typegen'
;(async () => {
  const output = join(__dirname, '../src/types/entities.ts')
  let schema: SchemaResult = null as unknown as SchemaResult
  let types: TypeResult = null as unknown as TypeResult

  const { API_DATABASE_USERNAME, API_DATABASE_PASSWORD, API_DATABASE_HOST, API_DATABASE_PORT, API_DATABASE_NAME } =
    process.env

  await generate({
    connection: `postgres://${API_DATABASE_USERNAME}:${API_DATABASE_PASSWORD}@${API_DATABASE_HOST}:${API_DATABASE_PORT}/${API_DATABASE_NAME}`,
    type: true,
    tableNames: true,
    comments: true,
    insertTypes: true,
    header: '/* eslint-disable @typescript-eslint/no-explicit-any */',
    exclude: ['logs', 'log_level', 'knex_migrations', 'knex_migrations_lock'],
    output,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    onSchema: (s: SchemaResult) => {
      schema = s
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    onTypes: (t: TypeResult) => {
      types = t
    }
  })

  let result = ''
  for (const table of schema.tables) {
    const full = types.typeMapping[table.name]
    const insert = types.insertTypeMapping[table.name] ?? 'never'
    result += `${table.name}: Knex.CompositeTableType<${full}, ${insert}, ${
      table.isView ? 'never' : `Partial<${full}>`
    }>;\n`
  }

  appendFileSync(
    output,
    `
      import { Knex } from 'knex';
      declare module 'knex/types/tables' { interface Tables { ${result} } }
  `
  )
})()
