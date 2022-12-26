import { FastifyInstance } from 'fastify'
import { Knex } from 'knex'
import * as seeds from '../../test-helpers/seeds'
import { setupGraphql } from '../../test-helpers/setupGraphql'
import { DeviceEntity } from '../../types/entities'

const gql = setupGraphql()

let app: FastifyInstance
let knex: Knex

const expectedDevice = {
  id: seeds.device.id,
  firmware: seeds.device.firmware,
  name: seeds.device.name,
  room: seeds.device.room,
  type: seeds.device.type,
  version: seeds.device.version
}

beforeEach(() => {
  app = gql.app
  knex = gql.knex
})

describe('device', () => {
  test('success fetching device', async () => {
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

  test('success fetching devices', async () => {
    const result = await app.inject({ method: 'POST', url: '/graphql', payload: { query } })
    const parsedBody = JSON.parse(result.body)
    expect(parsedBody).toEqual({
      data: {
        devices: [expectedDevice]
      }
    })
  })

  test('filters out test devices', async () => {
    const deviceId2 = '333'
    await knex<DeviceEntity>('devices').insert({ ...seeds.device, id: deviceId2, test: false })
    let result = await app.inject({ method: 'POST', url: '/graphql', payload: { query } })
    let parsedBody = JSON.parse(result.body)
    expect(parsedBody).toEqual({
      data: {
        devices: [expectedDevice, { ...expectedDevice, id: deviceId2 }]
      }
    })

    await knex<DeviceEntity>('devices').update({ test: true }).where('id', deviceId2)
    result = await app.inject({ method: 'POST', url: '/graphql', payload: { query } })
    parsedBody = JSON.parse(result.body)
    expect(parsedBody).toEqual({
      data: {
        devices: [expectedDevice]
      }
    })
  })
})
