import { eq, not } from 'drizzle-orm'
import { PartialDeep } from 'type-fest'
import { devices } from '../../helpers/schema'
import { Resolvers } from '../../types/schema'
import { getDeviceQuery } from './helpers/getDeviceQuery'

export default {
  Query: {
    device: (_, args, context) =>
      getDeviceQuery(context.db)
        .where(eq(devices.id, +args.id))
        .limit(1)
        .then((result) => result[0]),
    devices: (_, args, context) =>
      getDeviceQuery(context.db)
        .where(not(eq(devices.test, true)))
        .orderBy(devices.id)
  }
} as PartialDeep<Resolvers>
