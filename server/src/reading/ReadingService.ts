import { client } from '../common/influxClient';
import { Reading } from './ReadingEntity';

class ReadingService {
  public async getReadings(nodeId = '99', date) {
    const time = getTimestamp(date);
    const nanoEpoch = formatToNanoEpoch(time);

    const readings = await client.query(
      `select * from plant where "node_id"='${nodeId}' and time > ${nanoEpoch} order by time desc`
    );
    return parseReadings(readings);
  }

  public async saveReading(nodeId: string, reading: Reading) {
    const item = {
      measurement: 'plant',
      tags: { node_id: nodeId },
      time: reading.time.toISOString(),
      fields: {
        moisture: Math.round(reading.moisture),
        temperature: reading.temperature,
        light: reading.light,
        battery_voltage: reading.batteryVoltage,
      },
    };

    await client.writePoints([item]);
  }
}

function parseReadings(readings) {
  const reversedReadings = readings.reverse();

  const parsedReadings = reversedReadings
    .filter(reading => !!reading.moisture_percentage)
    .map(reading => ({
      moisture: reading.moisture_percentage,
      time: new Date(reading.time),
      temperature: reading.temperature,
      batteryVoltage: reading.battery_voltage,
    }));

  const watered = getLastWateredDate(reversedReadings);
  return { watered, readings: parsedReadings };
}

function getLastWateredDate(readings: any) {
  const threshold = 10;
  let watered = undefined;
  readings.reduce((previousValue, currentValue) => {
    if (currentValue.moisture_percentage - previousValue.moisture_percentage > threshold) {
      watered = currentValue.time;
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
