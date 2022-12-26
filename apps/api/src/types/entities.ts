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
  id: string
  ip: string
  method: string
  url: string
}

export type AbuserInsertEntity = {
  created_at?: Date
  headers: any
  id?: string
  ip: string
  method: string
  url: string
}

export type CronEntity = {
  executed_at: Date
  id: string
  name: string
  next_execution_at: Date
}

export type CronInsertEntity = {
  executed_at?: Date
  id: string
  name: string
  next_execution_at: Date
}

export type DeviceEntity = {
  address: string | null
  firmware: string
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
  reading_id: string
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
  reading_id: string
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
  id: string
}

export type UserInsertEntity = {
  id?: string
}

export type UsersDeviceEntity = {
  device_id: string
  user_id: string
}

export type UsersDeviceInsertEntity = {
  device_id: string
  user_id: string
}
