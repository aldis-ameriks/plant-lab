import { Context } from '../helpers/context'
import { devices, readings, userAccessKeys, users, usersDevices } from '../helpers/schema'

export const device: typeof devices.$inferInsert = {
  address: '127.0.0.1',
  firmware: 'firmware',
  id: 1,
  lastSeenAt: null,
  name: 'sensor name',
  room: null,
  status: 'new',
  type: 'sensor',
  version: 'sensor_10',
  test: false
}

export const reading: typeof readings.$inferInsert = {
  batteryVoltage: '1',
  deviceId: device.id!,
  hubId: null,
  light: '2',
  moisture: '3',
  moistureMax: '4',
  moistureMin: '5',
  moistureRaw: '6',
  readingId: '100',
  signal: '7',
  temperature: '8',
  time: new Date()
}

export const user: typeof users.$inferInsert = {
  id: 10000
}

export const userAccessKey: typeof userAccessKeys.$inferInsert = {
  userId: user.id!,
  accessKey: 'access-key',
  roles: []
}

export async function insertSeeds(db: Context['db']): Promise<void> {
  await db.delete(devices)
  await db.delete(users)
  await db.delete(userAccessKeys)
  await db.delete(usersDevices)

  await db.insert(devices).values(device)
  await db.insert(users).values(user)
  await db.insert(userAccessKeys).values(userAccessKey)
  await db.insert(usersDevices).values({ userId: user.id!, deviceId: device.id! })
}
