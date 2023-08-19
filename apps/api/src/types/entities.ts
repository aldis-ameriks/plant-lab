/* eslint-disable @typescript-eslint/no-explicit-any */

export type Tables =
  | 'abusers'
  | 'crons'
  | 'devices'
  | 'errors'
  | 'readings'
  | 'user_access_keys'
  | 'users'
  | 'users_devices'

export enum DeviceStatus {
  new = 'new',
  paired = 'paired',
  pairing = 'pairing',
  reset = 'reset'
}

export enum DeviceType {
  hub = 'hub',
  sensor = 'sensor'
}

export enum DeviceVersion {
  hub_10 = 'hub_10',
  sensor_10 = 'sensor_10'
}

export type AbuserEntity = {
  created_at: Date
  headers: any
  /**
   * PRIMARY KEY
   */
  id: string
  ip: string
  method: string
  url: string
}

export type AbuserInsertEntity = {
  created_at?: Date
  headers: any
  /**
   * PRIMARY KEY
   */
  id?: string
  ip: string
  method: string
  url: string
}

export type CronEntity = {
  enabled: boolean | null
  executed_at: Date
  /**
   * PRIMARY KEY
   */
  id: string
  name: string
  next_execution_at: Date
}

export type CronInsertEntity = {
  enabled?: boolean | null
  executed_at?: Date
  /**
   * PRIMARY KEY
   */
  id: string
  name: string
  next_execution_at: Date
}

export type DeviceEntity = {
  address: string | null
  firmware: string
  /**
   * PRIMARY KEY
   */
  id: string
  last_seen_at: Date | null
  name: string
  room: string | null
  status: DeviceStatus
  test: boolean
  type: DeviceType
  version: DeviceVersion
}

export type DeviceInsertEntity = {
  address?: string | null
  firmware: string
  /**
   * PRIMARY KEY
   */
  id: string
  last_seen_at?: Date | null
  name: string
  room?: string | null
  status?: DeviceStatus
  test?: boolean
  type: DeviceType
  version: DeviceVersion
}

export type ErrorEntity = {
  content: any
  headers: any | null
  /**
   * PRIMARY KEY
   */
  id: string
  ip: string | null
  req_id: string | null
  sent_at: Date | null
  source: string | null
  time: Date
}

export type ErrorInsertEntity = {
  content: any
  headers?: any | null
  /**
   * PRIMARY KEY
   */
  id?: string
  ip?: string | null
  req_id?: string | null
  sent_at?: Date | null
  source?: string | null
  time?: Date
}

export type ReadingEntity = {
  battery_voltage: string | null
  device_id: string
  hub_id: string | null
  light: string | null
  moisture: string | null
  moisture_max: string | null
  moisture_min: string | null
  moisture_raw: string | null
  reading_id: string | null
  signal: string | null
  temperature: string | null
  time: Date
}

export type ReadingInsertEntity = {
  battery_voltage?: string | null
  device_id: string
  hub_id?: string | null
  light?: string | null
  moisture?: string | null
  moisture_max?: string | null
  moisture_min?: string | null
  moisture_raw?: string | null
  reading_id?: string | null
  signal?: string | null
  temperature?: string | null
  time: Date
}

export type UserAccessKeyEntity = {
  access_key: string
  roles: Array<string>
  user_id: string
}

export type UserAccessKeyInsertEntity = {
  access_key: string
  roles: Array<string>
  user_id: string
}

export type UserEntity = {
  /**
   * PRIMARY KEY
   */
  id: string
}

export type UserInsertEntity = {
  /**
   * PRIMARY KEY
   */
  id?: string
}

export type UsersDeviceEntity = {
  /**
   * PRIMARY KEY
   */
  device_id: string
  /**
   * PRIMARY KEY
   */
  user_id: string
}

export type UsersDeviceInsertEntity = {
  /**
   * PRIMARY KEY
   */
  device_id: string
  /**
   * PRIMARY KEY
   */
  user_id: string
}

import { Knex } from 'knex'
declare module 'knex/types/tables' {
  interface Tables {
    abusers: Knex.CompositeTableType<AbuserEntity, AbuserInsertEntity, Partial<AbuserEntity>>
    crons: Knex.CompositeTableType<CronEntity, CronInsertEntity, Partial<CronEntity>>
    devices: Knex.CompositeTableType<DeviceEntity, DeviceInsertEntity, Partial<DeviceEntity>>
    errors: Knex.CompositeTableType<ErrorEntity, ErrorInsertEntity, Partial<ErrorEntity>>
    readings: Knex.CompositeTableType<ReadingEntity, ReadingInsertEntity, Partial<ReadingEntity>>
    user_access_keys: Knex.CompositeTableType<
      UserAccessKeyEntity,
      UserAccessKeyInsertEntity,
      Partial<UserAccessKeyEntity>
    >
    users: Knex.CompositeTableType<UserEntity, UserInsertEntity, Partial<UserEntity>>
    users_devices: Knex.CompositeTableType<UsersDeviceEntity, UsersDeviceInsertEntity, Partial<UsersDeviceEntity>>
  }
}
