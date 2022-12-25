import { getReadingQuery } from './helpers/getReadingQuery'

export default {
  Device: {
    lastReading: async (queries, context) => {
      const deviceIds = queries.map((query) => query.obj.id)
      const lastReadings = await getReadingQuery(context.knex)
        .distinctOn('device_id')
        .select('readings.device_id')
        .whereIn('device_id', deviceIds)
        .orderBy('device_id')
        .orderBy('time', 'desc')

      return queries.map((query) => {
        return lastReadings.find((lastReading) => lastReading.device_id === query.obj.id)
      })
    },
    lastWateredTime: async (queries, context) => {
      const deviceIds = queries.map((query) => query.obj.id)
      const result = await context.knex
        .raw(
          `
              SELECT DISTINCT ON (device_id) *
              FROM (
                       SELECT device_id,
                              time,
                              moisture - lead(moisture) OVER (ORDER BY time DESC) AS moisture_increase
                       FROM readings
                       WHERE device_id = ANY (:deviceIds)
                         AND time > now() - '90 days'::interval
                   ) AS readings
              WHERE moisture_increase > 10
              ORDER BY device_id, time DESC;
          `,
          { deviceIds }
        )
        .then((result) => result.rows)

      return queries.map((query) => {
        return result.find((entry) => entry.device_id === query.obj.id)?.time
      })
    },
    readings: async (queries, context) => {
      const deviceIds = queries.map((query) => query.obj.id)
      const result = await context.knex
        .raw(
          `
              SELECT device_id, day AS time, moisture, temperature, light, battery_voltage AS "batteryVoltage"
              FROM (
                       SELECT device_id,
                              time_bucket_gapfill('1 day'::interval, time) AS day,
                              locf(avg(moisture)) AS moisture,
                              locf(avg(temperature)) AS temperature,
                              locf(avg(light)) AS light,
                              locf(avg(battery_voltage)) AS battery_voltage
                       FROM readings
                       WHERE device_id = ANY (:deviceIds)
                         AND time > now() - INTERVAL '90 days'
                         AND time < now()
                       GROUP BY day, device_id
                       ORDER BY day ASC
                   ) AS readings
              WHERE moisture IS NOT NULL; -- Exclude entries with non-null readings that can occur when period is before first readings.
          `,
          { deviceIds }
        )
        .then((result) => result.rows)

      return queries.map((query) => {
        return result.filter((entry) => entry.device_id === query.obj.id)
      })
    }
  }
}
