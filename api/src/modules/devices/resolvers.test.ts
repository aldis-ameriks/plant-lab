import { FastifyInstance } from 'fastify'
import { device } from '../../test-helpers/seeds'
import { setupGraphql } from '../../test-helpers/setupGraphql'

const gql = setupGraphql()

let app: FastifyInstance

const expectedDevice = {
  id: device.id,
  firmware: device.firmware,
  name: device.name,
  room: device.room,
  type: device.type,
  version: device.version
}

beforeEach(() => {
  app = gql.app
})

describe('device', () => {
  test('success fetching device', async () => {
    const id = device.id
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

  test('fetching non existent device fails', async () => {
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
})

describe('devices', () => {
  test('success fetching devices', async () => {
    const query = `
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
    const result = await app.inject({ method: 'POST', url: '/graphql', payload: { query } })
    const parsedBody = JSON.parse(result.body)
    expect(parsedBody).toEqual({
      data: {
        devices: [expectedDevice]
      }
    })
  })
})
