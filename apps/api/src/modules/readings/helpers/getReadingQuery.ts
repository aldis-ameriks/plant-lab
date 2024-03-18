import { Context } from '../../../helpers/context'
import { readings } from '../../../helpers/schema'

export function getReadingQuery(db: Context['db']) {
  return db.select().from(readings).$dynamic()
}
