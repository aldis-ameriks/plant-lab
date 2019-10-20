import { knex } from '../common/db';

type ReadingInput = {
  node_id: string;
  timestamp: Date;
  moisture: number;
  moisture_raw: number;
  moisture_min: number;
  moisture_max: number;
  temperature: number;
  light: number | null;
  battery_voltage: number;
};

class ReadingService {
  public async getReadings(nodeId = '99', date) {
    const time = getTimestamp(date);
    const result = await knex.raw(
      `
      SELECT
          node_id,
          TIME_BUCKET_GAPFILL('1 day'::INTERVAL, timestamp, :time, NOW()) AS time,
          LOCF(AVG(moisture)) AS moisture,
          LOCF(AVG(temperature)) AS temperature,
          LOCF(AVG(light)) AS light,
          LOCF(AVG(battery_voltage)) AS battery_voltage
      FROM readings
      WHERE node_id = :nodeId and timestamp > :time
      GROUP BY time, node_id
      ORDER BY time ASC;
    `,
      { time, nodeId }
    );
    return result.rows;
  }

  public async getLastReading(nodeId) {
    return knex('readings')
      .select('node_id', knex.ref('timestamp').as('time'), 'moisture', 'temperature', 'light', 'battery_voltage')
      .where('node_id', nodeId)
      .orderBy('time', 'desc')
      .limit(1)
      .first();
  }

  public async getLastWateredTime(nodeId) {
    const result = await knex.raw(
      `
      SELECT * FROM (
        SELECT 
          node_id,
          timestamp AS time,
          moisture - LEAD(moisture) OVER (ORDER BY timestamp DESC) AS moisture_increase
        FROM readings
      ) AS readings
      WHERE node_id = :nodeId AND moisture_increase > 10;
    `,
      { nodeId }
    );
    return result && result.rows[0] ? result.rows[0].time : null;
  }

  public async saveReading(nodeId: string, reading: ReadingInput) {
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
