import { eq } from 'drizzle-orm'
import { FastifyInstance } from 'fastify'
import { Context } from '../../helpers/context'
import { devices } from '../../helpers/schema'
import * as seeds from '../../test-helpers/seeds'
import { setupGraphql } from '../../test-helpers/setupGraphql'

const gql = setupGraphql()

let app: FastifyInstance
let context: Context

const expectedDevice = {
  id: `${seeds.device.id}`,
  firmware: seeds.device.firmware,
  name: seeds.device.name,
  room: seeds.device.room,
  type: seeds.device.type,
  version: seeds.device.version
}

beforeEach(() => {
  app = gql.app
  context = gql.context
})

const devicesQuery = `
      query {
        devices {
          id
          firmware
          name
          room
          type
          version
        }
      }
`

test('device - success fetching device', async () => {
  const id = seeds.device.id
  const query = `
      query {
        device(id: "${id}") {
          id
          firmware
          name
          room
          type
          version
        }
      }
`
  const result = await app.inject({ method: 'POST', url: '/graphql', payload: { query } })
  const parsedBody = JSON.parse(result.body)
  expect(parsedBody).toEqual({
    data: {
      device: expectedDevice
    }
  })
})

test('device - fetching non existent device fails', async () => {
  const id = 'unknown-id'
  const query = `
      query {
        device(id: "${id}") {
          id
          firmware
          name
          room
          type
          version
        }
      }
`
  const result = await app.inject({ method: 'POST', url: '/graphql', payload: { query } })
  const parsedBody = JSON.parse(result.body)
  expect(parsedBody.data).toBeNull()
  expect(parsedBody.errors.length).toBe(1)
})

test('devices - success fetching devices', async () => {
  const result = await app.inject({ method: 'POST', url: '/graphql', payload: { query: devicesQuery } })
  const parsedBody = JSON.parse(result.body)
  expect(parsedBody).toEqual({
    data: {
      devices: [expectedDevice]
    }
  })
})

test('devices - filters out test devices', async () => {
  const deviceId2 = 333
  await context.db.insert(devices).values({ ...seeds.device, id: deviceId2, test: false })
  let result = await app.inject({ method: 'POST', url: '/graphql', payload: { query: devicesQuery } })
  let parsedBody = JSON.parse(result.body)
  expect(parsedBody).toEqual({
    data: {
      devices: [expectedDevice, { ...expectedDevice, id: `${deviceId2}` }]
    }
  })

  await context.db.update(devices).set({ test: true }).where(eq(devices.id, deviceId2))
  result = await app.inject({ method: 'POST', url: '/graphql', payload: { query: devicesQuery } })
  parsedBody = JSON.parse(result.body)
  expect(parsedBody).toEqual({
    data: {
      devices: [expectedDevice]
    }
  })
})
