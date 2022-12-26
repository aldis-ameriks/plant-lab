import { Knex } from 'knex'

export function getDeviceQuery(knex: Knex) {
  return knex('devices').select({
    id: 'devices.id',
    name: 'devices.name',
    room: 'devices.room',
    firmware: 'devices.firmware',
    address: 'devices.address',
    lastSeenAt: 'devices.last_seen_at',
    version: 'devices.version',
    status: 'devices.status',
    type: 'devices.type'
  })
}
