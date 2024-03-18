import {
  bigint,
  bigserial,
  boolean,
  index,
  inet,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique
} from 'drizzle-orm/pg-core'

export const deviceStatus = pgEnum('device_status', ['reset', 'paired', 'pairing', 'new'])
export const deviceType = pgEnum('device_type', ['sensor', 'hub'])
export const deviceVersion = pgEnum('device_version', ['sensor_10', 'hub_10'])

export const abusers = pgTable('abusers', {
  id: bigserial('id', { mode: 'number' }).primaryKey().notNull(),
  ip: inet('ip').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  url: text('url').notNull(),
  method: text('method').notNull(),
  headers: jsonb('headers').notNull()
})

export const crons = pgTable('crons', {
  id: bigserial('id', { mode: 'number' }).primaryKey().notNull(),
  name: text('name').notNull(),
  executedAt: timestamp('executed_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  nextExecutionAt: timestamp('next_execution_at', { withTimezone: true, mode: 'date' }).notNull(),
  enabled: boolean('enabled').default(true)
})

export const devices = pgTable('devices', {
  id: bigserial('id', { mode: 'number' }).primaryKey().notNull(),
  name: text('name').notNull(),
  room: text('room'),
  firmware: text('firmware').notNull(),
  address: inet('address'),
  lastSeenAt: timestamp('last_seen_at', { withTimezone: true, mode: 'date' }),
  version: deviceVersion('version').notNull(),
  status: deviceStatus('status').default('new').notNull(),
  type: deviceType('type').notNull(),
  test: boolean('test').default(false).notNull()
})

export const errors = pgTable('errors', {
  id: bigserial('id', { mode: 'number' }).primaryKey().notNull(),
  time: timestamp('time', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  sentAt: timestamp('sent_at', { withTimezone: true, mode: 'date' }),
  source: text('source'),
  content: jsonb('content').notNull(),
  headers: jsonb('headers'),
  ip: inet('ip'),
  reqId: text('req_id')
})

export const readings = pgTable(
  'readings',
  {
    time: timestamp('time', { withTimezone: true, mode: 'date' }).notNull(),
    readingId: text('reading_id'),
    deviceId: bigint('device_id', { mode: 'number' })
      .notNull()
      .references(() => devices.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    hubId: bigint('hub_id', { mode: 'number' }).references(() => devices.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade'
    }),
    moisture: numeric('moisture'),
    moistureRaw: numeric('moisture_raw'),
    moistureMax: numeric('moisture_max'),
    moistureMin: numeric('moisture_min'),
    temperature: numeric('temperature'),
    light: numeric('light'),
    batteryVoltage: numeric('battery_voltage'),
    signal: numeric('signal')
  },
  (table) => ({
    deviceIdTimeIdx: index().on(table.time, table.deviceId),
    readingIdTimeIdx: index().on(table.time, table.readingId)
  })
)

export const userAccessKeys = pgTable(
  'user_access_keys',
  {
    userId: bigint('user_id', { mode: 'number' })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    accessKey: text('access_key').notNull(),
    roles: text('roles').array().notNull()
  },
  (table) => ({
    userAccessKeysAccessKeyKey: unique().on(table.accessKey)
  })
)

export const users = pgTable('users', {
  id: bigserial('id', { mode: 'number' }).primaryKey().notNull()
})

export const usersDevices = pgTable(
  'users_devices',
  {
    userId: bigint('user_id', { mode: 'number' })
      .notNull()
      .references(() => users.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
    deviceId: bigint('device_id', { mode: 'number' })
      .notNull()
      .references(() => devices.id, { onDelete: 'restrict', onUpdate: 'cascade' })
  },
  (table) => ({
    usersDevicesPkey: primaryKey({ columns: [table.userId, table.deviceId] })
  })
)
