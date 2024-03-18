import { JSONSchemaType } from 'ajv'
import { and, eq } from 'drizzle-orm'
import { FastifyInstance } from 'fastify'
import assert from 'node:assert/strict'
import { devices, readings, usersDevices } from '../../../helpers/schema'
import { ajv } from '../../../helpers/validations'

export const readingsSchema: JSONSchemaType<Array<typeof readings.$inferInsert>> = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      batteryVoltage: { type: 'string', minLength: 1, maxLength: 1000, nullable: true },
      moisture: { type: 'string', minLength: 1, maxLength: 1000, nullable: true },
      moistureMin: { type: 'string', minLength: 1, maxLength: 1000, nullable: true },
      moistureMax: { type: 'string', minLength: 1, maxLength: 1000, nullable: true },
      moistureRaw: { type: 'string', minLength: 1, maxLength: 1000, nullable: true },
      temperature: { type: 'string', minLength: 1, maxLength: 1000, nullable: true },
      light: { type: 'string', minLength: 1, maxLength: 1000, nullable: true },
      signal: { type: 'string', minLength: 1, maxLength: 1000, nullable: true },
      deviceId: { type: 'number' },
      readingId: { type: 'string', minLength: 1, maxLength: 1000, nullable: true },
      hubId: { type: 'number', nullable: true },
      time: {
        type: 'object',
        required: []
      }
    },
    required: ['time', 'deviceId'],
    additionalProperties: false
  }
}

const validator = ajv.compile(readingsSchema)

export default function readingsRoutes(fastify: FastifyInstance) {
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
      assert.ok(req.ctx.user)
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
      const input: typeof readings.$inferInsert = {
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
        req.log.error(`received invalid input: ${validator.errors?.join(', ')}`)
        reply.code(400).send('Invalid input')
      }

      const userDevice = await req.ctx.db.query.usersDevices.findFirst({
        where: and(eq(usersDevices.userId, req.ctx.user.id), eq(usersDevices.deviceId, +device_id))
      })

      if (!userDevice) {
        req.log.error(`user: ${req.ctx.user.id} does not own device: ${device_id}`)
        return reply.code(403).send('Forbidden')
      }

      await req.ctx.db.update(devices).set({ lastSeenAt: new Date() }).where(eq(devices.id, +device_id))
      await req.ctx.db.insert(readings).values(input)

      return reply.send('success')
    }
  )
}
