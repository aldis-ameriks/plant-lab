import assert from 'node:assert/strict'
import { beforeEach, test } from 'node:test'
import { eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import { type Context } from '../../helpers/context.ts'
import { devices, readings } from '../../helpers/schema.ts'
import * as seeds from '../../test-helpers/seeds.ts'
import { setupGraphql } from '../../test-helpers/setupGraphql.ts'

const gql = setupGraphql()

let app: FastifyInstance
let context: Context

beforeEach(() => {
  app = gql.app
  context = gql.context
})

const id = `${seeds.device.id}`
const lastReadingQuery = `
      query {
        device(id: "${id}") {
          id
          lastReading {
            time          
            light
            moisture
            temperature
            batteryVoltage
          }
        }
      }
`

const lastWateredQuery = `
      query {
        device(id: "${id}") {
          id
          lastWateredTime
        }
      }
`

const readingsQuery = `
      query {
        device(id: "${id}") {
          id
          readings {
            time
            temperature
            moisture
            light
            batteryVoltage
          }
        }
      }
`

test('Device.lastReading - returns null when there are no readings', async () => {
  const result = await app.inject({ method: 'POST', url: '/graphql', payload: { query: lastReadingQuery } })
  const parsedBody = JSON.parse(result.body)
  assert.deepEqual(parsedBody, {
    data: {
      device: {
        id,
        lastReading: null
      }
    }
  })
})

test('Device.lastReading - returns last reading', async () => {
  const reading = {
    ...seeds.reading,
    time: new Date(),
    batteryVoltage: '1',
    light: '2',
    moisture: '3',
    temperature: '4'
  }
  const past = new Date()
  past.setDate(past.getDate() - 1)
  const reading2 = {
    ...seeds.reading,
    time: past,
    batteryVoltage: '11',
    light: '22',
    moisture: '33',
    temperature: '44'
  }

  await context.db.insert(readings).values([reading, reading2])

  let result = await app.inject({ method: 'POST', url: '/graphql', payload: { query: lastReadingQuery } })
  let parsedBody = JSON.parse(result.body)
  assert.deepEqual(parsedBody, {
    data: {
      device: {
        id,
        lastReading: {
          batteryVoltage: parseFloat(reading.batteryVoltage),
          light: parseFloat(reading.light),
          moisture: parseFloat(reading.moisture),
          temperature: parseFloat(reading.temperature),
          time: reading.time.toISOString()
        }
      }
    }
  })

  const reading3 = {
    ...seeds.reading,
    time: new Date(),
    batteryVoltage: '111',
    light: '222',
    moisture: '333',
    temperature: '444'
  }
  await context.db.insert(readings).values(reading3)

  result = await app.inject({ method: 'POST', url: '/graphql', payload: { query: lastReadingQuery } })
  parsedBody = JSON.parse(result.body)
  assert.deepEqual(parsedBody, {
    data: {
      device: {
        id,
        lastReading: {
          batteryVoltage: parseFloat(reading3.batteryVoltage),
          light: parseFloat(reading3.light),
          moisture: parseFloat(reading3.moisture),
          temperature: parseFloat(reading3.temperature),
          time: reading3.time.toISOString()
        }
      }
    }
  })
})

test('Device.lastWateredTime - has never been watered', async () => {
  const result = await app.inject({ method: 'POST', url: '/graphql', payload: { query: lastWateredQuery } })
  const parsedBody = JSON.parse(result.body)
  assert.deepEqual(parsedBody, {
    data: {
      device: {
        id,
        lastWateredTime: null
      }
    }
  })
})

test('Device.lastWateredTime - has been watered very long ago', async () => {
  const time1 = new Date()
  time1.setDate(time1.getDate() - 361)
  const reading1 = { ...seeds.reading, time: time1, moisture: '1' }

  const time2 = new Date()
  time2.setDate(time2.getDate() - 360)
  const reading2 = { ...seeds.reading, time: time2, moisture: '40' }

  await context.db.insert(readings).values([reading1, reading2])

  const result = await app.inject({ method: 'POST', url: '/graphql', payload: { query: lastWateredQuery } })
  const parsedBody = JSON.parse(result.body)
  assert.deepEqual(parsedBody, {
    data: {
      device: {
        id,
        lastWateredTime: null
      }
    }
  })
})

test('Devices.lastWateredTime - has been watered very long ago', async () => {
  await context.db.insert(devices).values({ ...seeds.device, id: 999 })

  const time1 = new Date()
  time1.setDate(time1.getDate() - 361)
  const reading1 = { ...seeds.reading, time: time1, moisture: '1' }

  const time2 = new Date()
  time2.setDate(time2.getDate() - 360)
  const reading2 = { ...seeds.reading, time: time2, moisture: '40' }

  await context.db.insert(readings).values([reading1, reading2])

  const result = await app.inject({
    method: 'POST',
    url: '/graphql',
    payload: {
      query: `
      query {
        devices {
          id
          lastWateredTime
        }
      }
  `
    }
  })
  const parsedBody = JSON.parse(result.body)
  assert.deepEqual(parsedBody, {
    data: {
      devices: [
        {
          id,
          lastWateredTime: null
        },
        {
          id: '999',
          lastWateredTime: null
        }
      ]
    }
  })
})

test('Device.lastWateredTime - has been watered', async () => {
  const time1 = new Date()
  time1.setDate(time1.getDate() - 11)
  const reading1 = { ...seeds.reading, time: time1, moisture: '1' }

  const time2 = new Date()
  time2.setDate(time2.getDate() - 10)
  const reading2 = { ...seeds.reading, time: time2, moisture: '40' }

  await context.db.insert(readings).values([reading1, reading2])

  const result = await app.inject({ method: 'POST', url: '/graphql', payload: { query: lastWateredQuery } })
  const parsedBody = JSON.parse(result.body)
  assert.deepEqual(parsedBody, {
    data: {
      device: {
        id,
        lastWateredTime: time2.toISOString()
      }
    }
  })
})

test('Device.readings - works when there are no readings', async () => {
  await context.db.delete(readings).where(eq(readings.deviceId, seeds.device.id!))
  const result = await app.inject({ method: 'POST', url: '/graphql', payload: { query: readingsQuery } })
  const parsedBody = JSON.parse(result.body)
  assert.deepEqual(parsedBody, {
    data: {
      device: {
        id,
        readings: []
      }
    }
  })
})

test('Device.readings - returns time bucketed daily readings', async () => {
  await context.db.delete(readings).where(eq(readings.deviceId, seeds.device.id!))

  const time = new Date()
  time.setDate(time.getDate() - 3)

  const reading1 = {
    ...seeds.reading,
    time,
    moisture: '10',
    batteryVoltage: '1',
    light: '100',
    temperature: '20'
  }

  const reading2 = {
    ...seeds.reading,
    time,
    moisture: '20',
    batteryVoltage: '2',
    light: '200',
    temperature: '40'
  }
  await context.db.insert(readings).values([reading1, reading2])

  const result = await app.inject({ method: 'POST', url: '/graphql', payload: { query: readingsQuery } })
  const parsedBody = JSON.parse(result.body)
  assert.ok(parsedBody.data.device.readings.length > 1)
  assert.deepEqual(parsedBody.data.device.readings[0], {
    batteryVoltage: 1.5,
    light: 150,
    moisture: 15,
    temperature: 30,
    time: `${time.toISOString().split('T')[0]} 00:00:00+00`
  })
})
