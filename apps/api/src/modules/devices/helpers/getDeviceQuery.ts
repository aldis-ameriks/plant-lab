import { type Context } from '../../../helpers/context.ts'
import { devices } from '../../../helpers/schema.ts'

export function getDeviceQuery(db: Context['db']) {
  return db.select().from(devices).$dynamic()
}
