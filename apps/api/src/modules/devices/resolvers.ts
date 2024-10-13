import { eq, ne } from 'drizzle-orm'
import type { PartialDeep } from 'type-fest'
import { devices } from '../../helpers/schema.ts'
import { type Resolvers } from '../../types/graphql.ts'
import { getDeviceQuery } from './helpers/getDeviceQuery.ts'

export default {
  Query: {
    device: (_, args, context) =>
      getDeviceQuery(context.db)
        .where(eq(devices.id, +args.id))
        .limit(1)
        .then((result) => result[0]),
    devices: (_, _args, context) => getDeviceQuery(context.db).where(ne(devices.test, true)).orderBy(devices.id)
  }
} as PartialDeep<Resolvers>
