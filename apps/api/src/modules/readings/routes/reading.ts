import { JSONSchemaType } from 'ajv'
import { FastifyInstance } from 'fastify'
import { ajv } from '../../../helpers/validations'
import { DeviceEntity, ReadingEntity, UsersDeviceEntity } from '../../../types/entities'

export const readingsSchema: JSONSchemaType<ReadingEntity[]> = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      battery_voltage: { type: 'string', minLength: 1, maxLength: 1000 },
      moisture: { type: 'string', minLength: 1, maxLength: 1000 },
      moisture_min: { type: 'string', minLength: 1, maxLength: 1000 },
      moisture_max: { type: 'string', minLength: 1, maxLength: 1000 },
      moisture_raw: { type: 'string', minLength: 1, maxLength: 1000 },
      temperature: { type: 'string', minLength: 1, maxLength: 1000 },
      light: { type: 'string', minLength: 1, maxLength: 1000 },
      signal: { type: 'string', minLength: 1, maxLength: 1000 },
      device_id: { type: 'string', minLength: 1, maxLength: 1000 },
      reading_id: { type: 'string', minLength: 1, maxLength: 1000 },
      hub_id: { type: 'string', minLength: 1, maxLength: 1000 },
      time: {
        type: 'object',
        required: []
      }
    },
    required: [
      'battery_voltage',
      'moisture',
      'moisture_min',
      'moisture_max',
      'moisture_raw',
      'temperature',
      'light',
      'signal',
      'device_id',
      'time'
    ],
    additionalProperties: false
  }
}

const validator = ajv.compile(readingsSchema)

export default function readings(fastify: FastifyInstance) {
  fastify.post<{ Body: string }>(
    '/reading',
    {
      preHandler: async (req, reply) => {
        if (!req.ctx.user || !req.ctx.user.roles.includes('HUB')) {
          reply.code(403).type('text/plain').send('Forbidden')
        }
      },
      schema: {
        body: {
          type: 'string'
        }
      }
    },
    async (req, reply) => {
      req.log.info(`received input: ${req.body}`)
      const parsedInput = req.body.split(';')
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
        req.log.error(`received invalid input: ${validator.errors?.join(', ')}`)
        reply.code(400).send('Invalid input')
      }

      const userDevice = await req.ctx
        .knex<UsersDeviceEntity>('users_devices')
        .where('user_id', req.ctx.user?.id)
        .where('device_id', device_id)
        .first()

      if (!userDevice) {
        req.log.error(`user: ${req.ctx.user?.id} does not own device: ${device_id}`)
        return reply.code(403).send('Forbidden')
      }

      await req.ctx.knex<DeviceEntity>('devices').update({ last_seen_at: new Date() }).where('id', device_id)
      await req.ctx.knex<ReadingEntity>('readings').insert(input)

      return reply.send('success')
    }
  )
}