import { desc, sql } from 'drizzle-orm'
import { inArray } from 'drizzle-orm/sql/expressions/conditions'
import { type Context } from '../../helpers/context.ts'
import { readings } from '../../helpers/schema.ts'

export default {
  Device: {
    lastReading: async (queries, context: Context) => {
      const deviceIds = queries.map((query) => query.obj.id)
      const lastReadings = await context.db
        .selectDistinctOn([readings.deviceId])
        .from(readings)
        .where(inArray(readings.deviceId, deviceIds))
        .orderBy(readings.deviceId, desc(readings.time))

      return queries.map((query) => lastReadings.find((lastReading) => lastReading.deviceId === query.obj.id))
    },
    lastWateredTime: async (queries, context: Context) => {
      const deviceIds = queries.map((query) => query.obj.id)
      const result = await context.db.execute<{ time: string; device_id: string }>(sql`
        SELECT DISTINCT ON (device_id) *
        FROM (SELECT device_id,
                     time::timestamptz,
                     moisture - lead(moisture) OVER (PARTITION BY device_id ORDER BY time DESC) AS moisture_increase
              FROM readings
              WHERE device_id = ANY (ARRAY [${sql(deviceIds.join(','))}]::bigint[])
                AND time > now() - '90 days'::interval) AS readings
        WHERE moisture_increase > 10
        ORDER BY device_id, time DESC;
      `)

      return queries.map((query) => {
        const time = result.find((entry) => entry.device_id === `${query.obj.id}`)?.time
        return time ? new Date(time) : null
      })
    },
    readings: async (queries, context: Context) => {
      const deviceIds = queries.map((query) => query.obj.id)
      const result = await context.db.execute(
        sql`
                    SELECT device_id, day AS time, moisture, temperature, light, battery_voltage AS "batteryVoltage"
                    FROM (SELECT device_id,
                                 time_bucket_gapfill('1 day'::interval, time) AS day,
                                 locf(avg(moisture))                          AS moisture,
                                 locf(avg(temperature))                       AS temperature,
                                 locf(avg(light))                             AS light,
                                 locf(avg(battery_voltage))                   AS battery_voltage
                          FROM readings
                          WHERE device_id = ANY (ARRAY [${sql(deviceIds.join(','))}]::bigint[])
                            AND time > now() - INTERVAL '90 days'
                            AND time < now()
                          GROUP BY day, device_id
                          ORDER BY day ASC) AS readings
                    WHERE moisture IS NOT NULL; -- Exclude entries with non-null readings that can occur when period is before first readings.
                `
      )

      return queries.map((query) => result.filter((entry) => entry.device_id === `${query.obj.id}`))
    }
  }
}
