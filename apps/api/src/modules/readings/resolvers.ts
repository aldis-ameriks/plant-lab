import { ajv } from '../../helpers/validations'
import { DeviceEntity, ReadingEntity, UsersDeviceEntity } from '../../types/entities'
import { Resolvers } from '../../types/schema'
import { readingsSchema } from './routes/reading'

const validator = ajv.compile(readingsSchema)

export default {
  Mutation: {
    saveReading: async (_, args, context) => {
      // ** DEPRECATED **
      context.log.info(`received input: ${args.input}`)
      const parsedInput = args.input.split(';')
      const device_id = parsedInput[0]
      const moisture_raw = parsedInput[1]
      const moisture = parsedInput[2]
      const moisture_min = parsedInput[3]
      const moisture_max = parsedInput[4]
      const temperature = parsedInput[5]
      const light = parsedInput[6] || null // Some of the devices have their light sensor covered and send 0
      const battery_voltage = parsedInput[7]
      const signal = parsedInput[8]
      const reading_id = parsedInput[9]
      // const firmware = parsedInput[10]

      // hub_id is found by looking at devices
      const input: Omit<ReadingEntity, 'hub_id'> = {
        device_id,
        moisture,
        moisture_max,
        moisture_min,
        moisture_raw,
        temperature,
        light,
        battery_voltage,
        signal,
        reading_id,
        time: new Date()
      }

      const isValid = validator([input])
      if (!isValid) {
        context.log.error(`received invalid input: ${validator.errors?.join(', ')}`)
        throw new Error('Invalid input')
      }

      const userDevice = await context
        .knex<UsersDeviceEntity>('users_devices')
        .where('user_id', context.user?.id)
        .where('device_id', device_id)
        .first()

      if (!userDevice) {
        context.log.error(`user: ${context.user?.id} does not own device: ${device_id}`)
        throw new Error('Forbidden')
      }

      await context.knex<DeviceEntity>('devices').update({ last_seen_at: new Date() }).where('id', device_id)
      await context.knex<ReadingEntity>('readings').insert(input)

      return 'success'
    }
  }
} as Resolvers
