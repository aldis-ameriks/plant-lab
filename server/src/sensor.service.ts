import { client } from './influxdb/client';

export async function saveReading(nodeId, readings) {
  console.log(process.env.NODE_ENV);
  const item = {
    measurement: 'plant',
    tags: { node_id: nodeId },
    time: new Date().toISOString(),
    fields: {
      moisture: readings.moisturePercentage,
      temperature: readings.temperature,
      light: readings.light,
      battery_voltage: readings.batteryVoltage,
    },
  };

  console.log('Storing data:', item);
  await client.writePoints([item]);
}

export async function getReadings(nodeId = '99', date) {
  const time = getTimestamp(date);
  const nanoEpoch = formatToNanoEpoch(time);

  const readings = await client.query(
    `select * from plant where "node_id"='${nodeId}' and time > ${nanoEpoch} order by time desc`,
  );
  return parseReadings(readings);
}

function parseReadings(readings) {
  const reversedReadings = readings.reverse();

  const parsedReadings = reversedReadings.map(reading => ({
    moisture: Math.round(reading.moisture_percentage),
    time: new Date(reading.time),
    temperature: reading.temperature,
    batteryVoltage: reading.battery_voltage,
  }));

  const watered = getLastWateredDate(reversedReadings);
  return { readings: parsedReadings, watered };
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
