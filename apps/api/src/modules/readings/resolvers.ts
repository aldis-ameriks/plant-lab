import { and, eq } from 'drizzle-orm'
import assert from 'node:assert/strict'
import { ForbiddenError, UserInputError } from '../../helpers/errors'
import { devices, readings, usersDevices } from '../../helpers/schema.ts'
import { ajv } from '../../helpers/validations.ts'
import { type Resolvers } from '../../types/graphql.ts'
import { readingsSchema } from './routes/reading.ts'

const validator = ajv.compile(readingsSchema)

export default {
  Mutation: {
    saveReading: async (_, args, context) => {
      assert.ok(context.user?.id)

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

      assert.ok(device_id)

      // hub_id is found by looking at devices
      const input: Omit<typeof readings.$inferInsert, 'hub_id'> = {
        deviceId: +device_id,
        moisture,
        moistureMax: moisture_max,
        moistureMin: moisture_min,
        moistureRaw: moisture_raw,
        temperature,
        light,
        batteryVoltage: battery_voltage,
        signal,
        readingId: reading_id,
        time: new Date()
      }

      const isValid = validator([input])
      if (!isValid) {
        context.log.error(`received invalid input: ${validator.errors?.join(', ')}`)
        throw new UserInputError('Invalid input')
      }

      const userDevice = await context.db.query.usersDevices.findFirst({
        where: and(eq(usersDevices.userId, context.user.id), eq(usersDevices.deviceId, +device_id))
      })

      if (!userDevice) {
        context.log.error(`user: ${context.user?.id} does not own device: ${device_id}`)
        throw new ForbiddenError()
      }

      await context.db.update(devices).set({ lastSeenAt: new Date() }).where(eq(devices.id, +device_id))
      await context.db.insert(readings).values(input)

      return 'success'
    }
  }
} as Resolvers
