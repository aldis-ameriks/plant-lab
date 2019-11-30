import { knex } from '../common/db';

type ReadingInput = {
  sensor_id: string;
  timestamp: Date;
  moisture: number;
  moisture_raw: number;
  moisture_min: number;
  moisture_max: number;
  temperature: number;
  light: number | null;
  battery_voltage: number;
  signal: number;
};

class ReadingService {
  public async getReadings(sensorId = '99', date) {
    const time = getTimestamp(date);
    const result = await knex.raw(
      `
      SELECT * FROM (
        SELECT
          sensor_id,
          TIME_BUCKET_GAPFILL('1 day'::INTERVAL, timestamp, :time, NOW()) AS time,
          LOCF(AVG(moisture)) AS moisture,
          LOCF(AVG(temperature)) AS temperature,
          LOCF(AVG(light)) AS light,
          LOCF(AVG(battery_voltage)) AS battery_voltage
        FROM readings
        WHERE sensor_id = :sensorId and timestamp > :time
        GROUP BY time, sensor_id
        ORDER BY time ASC
        ) AS readings
      WHERE moisture IS NOT NULL; -- Exclude entries with non-null readings that can occur when period is before first readings. 
    `,
      { time, sensorId }
    );
    return result.rows;
  }

  public async getLastReading(sensorId) {
    return knex('readings')
      .select('sensor_id', knex.ref('timestamp').as('time'), 'moisture', 'temperature', 'light', 'battery_voltage')
      .where('sensor_id', sensorId)
      .orderBy('time', 'desc')
      .limit(1)
      .first();
  }

  public async getLastWateredTime(sensorId) {
    const result = await knex.raw(
      `
      SELECT * FROM (
        SELECT 
          sensor_id,
          timestamp AS time,
          moisture - LEAD(moisture) OVER (ORDER BY timestamp DESC) AS moisture_increase
        FROM readings
        WHERE sensor_id = :sensorId
      ) AS readings
      WHERE moisture_increase > 10;
    `,
      { sensorId }
    );
    return result && result.rows[0] ? result.rows[0].time : null;
  }

  public async saveReading(sensorId: string, reading: ReadingInput) {
    await knex('readings').insert(reading);
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

export default ReadingService;
