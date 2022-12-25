import { Knex } from 'knex'
import { DeviceEntity, DeviceStatus, DeviceType, DeviceVersion } from '../types/entities'

export const device: DeviceEntity = {
  address: '127.0.0.1',
  firmware: 'firmware',
  id: '1',
  last_seen_at: null,
  name: 'sensor name',
  room: null,
  status: DeviceStatus.new,
  type: DeviceType.sensor,
  version: DeviceVersion.sensor_10
}

export async function insertSeeds(knex: Knex): Promise<void> {
  await knex('devices').del()
  await knex('devices').insert(device)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function insertWithIdentityColumn(knex: Knex, table: string, value: Record<string, unknown>): Promise<void> {
  const sql = await knex(table).insert(value).toSQL()
  sql.sql = sql.sql.replace(' values ', ' overriding system value values ')
  await knex.raw(sql.sql, sql.bindings)
}
