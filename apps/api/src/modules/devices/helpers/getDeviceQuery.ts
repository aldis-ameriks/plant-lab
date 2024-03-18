import { Context } from '../../../helpers/context'
import { devices } from '../../../helpers/schema'

export function getDeviceQuery(db: Context['db']) {
  return db.select().from(devices).$dynamic()
}
