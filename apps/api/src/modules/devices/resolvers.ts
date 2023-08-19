import { PartialDeep } from 'type-fest'
import { Resolvers } from '../../types/schema'
import { getDeviceQuery } from './helpers/getDeviceQuery'

export default {
  Query: {
    device: (_, args, context) => getDeviceQuery(context.knex).where('id', args.id).first(),
    devices: (_, args, context) => getDeviceQuery(context.knex).whereNot('test', true).orderBy('id')
  }
} as PartialDeep<Resolvers>
