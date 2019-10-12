import { client, InfluxReading } from '../common/influxClient';
import { reduceDataPoints } from '../common/dataUtils';

type ReadingInput = {
  time: Date;
  moisture: number;
  temperature: number;
  light?: number;
  batteryVoltage: number;
};

class ReadingService {
  public async getReadings(nodeId = '99', date) {
    const time = getTimestamp(date);
    const nanoEpoch = formatToNanoEpoch(time);

    const readings: InfluxReading[] = await client.query(
      `select * from plant where "node_id"='${nodeId}' and time > ${nanoEpoch} order by time desc`
    );

    if (readings.length === 0) {
      throw new Error('No readings');
    }

    return parseReadings(nodeId, readings);
  }

  public async saveReading(nodeId: string, reading: ReadingInput) {
    const item = {
      measurement: 'plant',
      tags: { node_id: nodeId },
      time: reading.time.toISOString(),
      fields: {
        moisture_percentage: Math.round(reading.moisture),
        temperature: reading.temperature,
        light: reading.light,
        battery_voltage: reading.batteryVoltage,
      },
    };

    console.log('Saving reading', item);
    await client.writePoints([item]);
  }
}

function parseReadings(nodeId: string, readings: InfluxReading[]) {
  const reversedReadings = readings.reverse();

  const { moisture, temperature, batteryVoltage } = reversedReadings
    .filter(
      reading =>
        !!reading.moisture_percentage &&
        reading.moisture_percentage > 0 &&
        reading.moisture_percentage < 100 &&
        reading.temperature < 60
    )
    .reduce(
      (acc, cur) => {
        acc.moisture.push({ x: new Date(cur.time), y: cur.moisture_percentage });
        acc.temperature.push({ x: new Date(cur.time), y: cur.temperature });
        acc.batteryVoltage.push({ x: new Date(cur.time), y: cur.battery_voltage });
        return acc;
      },
      { moisture: [], temperature: [], batteryVoltage: [] }
    );

  const reducedMoisture = reduceDataPoints(moisture).map(({ x, y }) => ({
    time: x,
    value: Math.round(y),
  }));

  const reducedTemperature = reduceDataPoints(temperature, 50).map(({ x, y }) => ({
    time: x,
    value: y,
  }));

  const reducedBatteryVoltage = reduceDataPoints(batteryVoltage).map(({ x, y }) => ({
    time: x,
    value: y,
  }));

  const watered = getLastWateredDate(moisture);
  return {
    id: nodeId,
    watered,
    moisture: reducedMoisture,
    temperature: reducedTemperature,
    batteryVoltage: reducedBatteryVoltage,
  };
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

function formatToNanoEpoch(date) {
  return `${date.getTime()}000000`;
}

export default ReadingService;
