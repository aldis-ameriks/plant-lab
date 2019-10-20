import { knex } from '../common/db';

type ReadingInput = {
  node_id: string;
  timestamp: Date;
  moisture: number;
  moisture_raw: number;
  moisture_min: number;
  moisture_max: number;
  temperature: number;
  light?: number;
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

  public async saveReading(nodeId: string, reading: ReadingInput) {
    await knex('readings').insert(reading);
  }
}

function getLastWateredDate(readings: { y: number; x: number }[]) {
  const threshold = 10;
  let watered;
  readings.reduce((previousValue, currentValue) => {
    if (currentValue.y - previousValue.y > threshold) {
      watered = currentValue.x;
      return currentValue;
    }
    return currentValue;
  }, readings[0]);

  return watered;
}

function getTimestamp(date: string) {
  if (date) {
    return new Date(date);
  }

  // default to fetching readings since 30 days ago
  const now = new Date();
  now.setDate(now.getDate() - 30);
  return now;
}

export default ReadingService;
