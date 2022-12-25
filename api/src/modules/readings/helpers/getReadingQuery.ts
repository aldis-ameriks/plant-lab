import { Knex } from 'knex'

export function getReadingQuery(knex: Knex) {
  return knex('readings').select({
    time: 'readings.time',
    moisture: 'readings.moisture',
    temperature: 'readings.temperature',
    light: 'readings.light',
    batteryVoltage: 'readings.battery_voltage'
  })
}
