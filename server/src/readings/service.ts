import Knex from 'knex';
import { Inject, Service } from 'typedi';

import { ReadingInput } from './models';

import { DeviceType, ReadingEntity } from 'common/types/entities';
import { TimeBucketedReading } from 'readings/entities';

@Service()
export class ReadingService {
  @Inject('knex')
  private readonly knex: Knex;

  public async getReadings(deviceId = '99', date): Promise<TimeBucketedReading[]> {
    const time = getTimestamp(date);
    const result = await this.knex.raw<{ rows: TimeBucketedReading[] }>(
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

  public async getLastReading(deviceId): Promise<ReadingEntity> {
    return this.knex<ReadingEntity>('readings')
      .where('device_id', deviceId)
      .orderBy('timestamp', 'desc')
      .limit(1)
      .first();
  }

  public async getLastWateredTime(deviceId): Promise<Date | undefined> {
    const result = await this.knex.raw(
      `
                SELECT *
                FROM (
                    SELECT device_id,
                           timestamp,
                           moisture - LEAD(moisture) OVER (ORDER BY timestamp DESC) AS moisture_increase
                    FROM readings
                    WHERE device_id = :deviceId
                ) AS readings
                WHERE moisture_increase > 10;
      `,
      { deviceId }
    );
    return result?.rows?.[0]?.timestamp;
  }

  public async saveReading(input: ReadingInput): Promise<void> {
    await this.knex.raw(
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

  public async getAllSensorLastAverageReadings(): Promise<ReadingEntity[]> {
    return this.knex
      .raw<{ rows: ReadingEntity[] }>(
        `
                  SELECT DISTINCT ON (d.id) d.id AS device_id,
                                            timestamp,
                                            avg(moisture)
                                            OVER (PARTITION BY d.id ORDER BY timestamp DESC ROWS BETWEEN CURRENT ROW AND 10 FOLLOWING) moisture,
                                            avg(temperature)
                                            OVER (PARTITION BY d.id ORDER BY timestamp DESC ROWS BETWEEN CURRENT ROW AND 10 FOLLOWING) temperature,
                                            avg(light)
                                            OVER (PARTITION BY d.id ORDER BY timestamp DESC ROWS BETWEEN CURRENT ROW AND 10 FOLLOWING) light,
                                            avg(battery_voltage)
                                            OVER (PARTITION BY d.id ORDER BY timestamp DESC ROWS BETWEEN CURRENT ROW AND 10 FOLLOWING) battery_voltage
                  FROM readings
                  LEFT JOIN devices d ON readings.device_id = d.id
                  LEFT JOIN users_devices ud ON d.id = ud.device_id
                  LEFT JOIN user_settings us ON ud.user_id = us.user_id
                  WHERE d.type = :type
                    AND us.name = 'notifications'
                    AND us.value = 'enabled'
                    AND d.test = FALSE
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
