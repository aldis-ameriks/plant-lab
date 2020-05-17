import { Reading, ReadingInput } from './models';

import { knex } from 'common/db';
import { DeviceType } from 'common/types/entities';

export class ReadingService {
  public async getReadings(deviceId = '99', date) {
    const time = getTimestamp(date);
    const result = await knex.raw(
      `
                SELECT *
                FROM (
                    SELECT device_id,
                           TIME_BUCKET_GAPFILL('1 day'::interval, timestamp, :time, NOW()) AS time,
                           LOCF(AVG(moisture)) AS moisture,
                           LOCF(AVG(temperature)) AS temperature,
                           LOCF(AVG(light)) AS light,
                           LOCF(AVG(battery_voltage)) AS battery_voltage
                    FROM readings
                    WHERE device_id = :deviceId
                      AND timestamp > :time
                    GROUP BY time, device_id
                    ORDER BY time ASC
                ) AS readings
                WHERE moisture IS NOT NULL; -- Exclude entries with non-null readings that can occur when period is before first readings. 
      `,
      { time, deviceId }
    );
    return result.rows;
  }

  public async getLastReading(deviceId) {
    return knex('readings')
      .select('device_id', knex.ref('timestamp').as('time'), 'moisture', 'temperature', 'light', 'battery_voltage')
      .where('device_id', deviceId)
      .orderBy('time', 'desc')
      .limit(1)
      .first();
  }

  public async getLastWateredTime(deviceId) {
    const result = await knex.raw(
      `
                SELECT *
                FROM (
                    SELECT device_id,
                           timestamp AS time,
                           moisture - LEAD(moisture) OVER (ORDER BY timestamp DESC) AS moisture_increase
                    FROM readings
                    WHERE device_id = :deviceId
                ) AS readings
                WHERE moisture_increase > 10;
      `,
      { deviceId }
    );
    return result && result.rows[0] ? result.rows[0].time : null;
  }

  public async saveReading(input: ReadingInput) {
    await knex.raw(
      `
                INSERT INTO readings (device_id, moisture, moisture_raw, moisture_max, moisture_min, temperature, light,
                                      battery_voltage, signal, reading_id)
                VALUES (:device_id, :moisture, :moisture_raw, :moisture_max, :moisture_min, :temperature, :light,
                        :battery_voltage,
                        :signal, :reading_id)
                ON CONFLICT DO NOTHING;
      `,
      { ...input }
    );
  }

  public async getAllSensorLastAverageReadings(): Promise<Reading[]> {
    return knex
      .raw(
        `
                  SELECT DISTINCT ON (d.id) d.id AS device_id,
                                            timestamp AS time,
                                            avg(moisture)
                                            OVER (ORDER BY timestamp DESC ROWS BETWEEN CURRENT ROW AND 10 FOLLOWING) moisture,
                                            avg(temperature)
                                            OVER (ORDER BY timestamp DESC ROWS BETWEEN CURRENT ROW AND 10 FOLLOWING) temperature,
                                            avg(light)
                                            OVER (ORDER BY timestamp DESC ROWS BETWEEN CURRENT ROW AND 10 FOLLOWING) light,
                                            avg(battery_voltage)
                                            OVER (ORDER BY timestamp DESC ROWS BETWEEN CURRENT ROW AND 10 FOLLOWING) battery_voltage
                  FROM readings
                  LEFT JOIN devices d ON readings.device_id = d.id
                  LEFT JOIN users_devices ud ON d.id = ud.device_id
                  LEFT JOIN user_settings us ON ud.user_id = us.user_id
                  WHERE d.type = :type
                    AND us.name = 'notifications'
                    AND us.value = 'enabled'
                  ORDER BY device_id, timestamp DESC
        `,
        { type: DeviceType.sensor }
      )
      .then((result) => result.rows);
  }
}

function getTimestamp(date?: string) {
  if (date) {
    return new Date(date);
  }

  const now = new Date();
  now.setDate(now.getDate() - 90);
  return now;
}
