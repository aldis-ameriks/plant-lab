import { Knex } from 'knex'
import { Tables } from '../types/entities'

// eslint-disable-next-line @typescript-eslint/ban-types
export async function insert<T extends {} = Record<string, unknown>, P = T>(
  knex: Knex,
  tableName: Tables,
  data: Array<T> | T,
  tail = ''
): Promise<P[]> {
  if (!data) {
    return []
  }

  if (!Array.isArray(data)) {
    data = [data]
  }

  // TODO: Use generator and yield results of intermediate inserts
  if (!data.length) {
    return []
  }

  const columnArr = Object.keys(data[0])
  const columns = columnArr.map((col) => `"${col}"`).join(', ')
  let payload: string[] = []
  const result: P[] = []

  for (let i = 0; i < data.length; i++) {
    const values = columnArr.map((column) => {
      const val: unknown = data[i][column]
      if (val === null) {
        return 'NULL'
      } else if (val === undefined) {
        return 'DEFAULT'
      } else if (typeof val === 'object') {
        return `'${JSON.stringify(val)}'`
      } else {
        return `'${val}'`
      }
    })

    payload.push(`(${values.join(',')})`)

    if (payload.length >= 100 || i === data.length - 1) {
      const batchResult = await knex.raw(
        `
            INSERT
            INTO :tableName: (${columns})
            VALUES
            ${payload.join(', ')}
            ${tail};
        `,
        { tableName }
      )

      if (batchResult.rows.length) {
        result.push(...batchResult.rows)
      }

      payload = []
    }
  }

  return result
}
