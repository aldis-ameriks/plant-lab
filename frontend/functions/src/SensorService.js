const Influx = require('influx');
const simplify = require('simplify-js');

const { INFLUX_HOST, INFLUX_PORT, INFLUX_USER, INFLUX_PASSWORD } = process.env;

const client = new Influx.InfluxDB({
  host: INFLUX_HOST,
  database: 'plants',
  port: INFLUX_PORT,
  username: INFLUX_USER,
  password: INFLUX_PASSWORD,
  schema: [
    {
      measurement: 'plant',
      fields: {
        moisture: Influx.FieldType.INTEGER,
        moisture_percentage: Influx.FieldType.FLOAT,
        moisture_wet: Influx.FieldType.INTEGER,
        moisture_dry: Influx.FieldType.INTEGER,
        temperature: Influx.FieldType.INTEGER,
        light: Influx.FieldType.INTEGER,
        battery_voltage: Influx.FieldType.FLOAT,
      },
      tags: ['node_id'],
    },
  ],
});

const saveReading = async reading => {
  const item = {
    measurement: 'plant',
    tags: { node_id: reading.nodeid },
    time: new Date().toISOString(),
    fields: reading,
  };
  await client.writePoints([item]);
};

const getReadings = async (nodeid = 99, date) => {
  const time = getTimestamp(date);
  const nanoEpoch = formatToNanoEpoch(time);

  const readings = await client.query(
    `select * from plant where "node_id"='${nodeid}' and time > ${nanoEpoch} order by time desc`
  );
  return parseReadings(readings);
};

function parseReadings(readings) {
  const tolerance = 2;
  const reversedReadings = readings.reverse();

  const moisture = simplify(
    reversedReadings.map(reading => ({
      x: reading.moisture_percentage,
      y: new Date(reading.time).getTime(),
    })),
    tolerance
  );

  const temperature = simplify(
    reversedReadings.map(reading => ({
      x: reading.temperature,
      y: new Date(reading.time).getTime(),
    })),
    tolerance
  );

  const batteryVoltage = simplify(
    reversedReadings.map(reading => ({
      x: reading.battery_voltage,
      y: new Date(reading.time).getTime(),
    })),
    tolerance
  );

  const parsedReadings = moisture.map((value, i) => ({
    moisture: Math.round(value.x),
    time: new Date(value.y),
    temperature: temperature[i].x,
    batteryVoltage: batteryVoltage[i].x,
  }));

  const watered = getLastWateredDate(reversedReadings);
  return { readings: parsedReadings, watered };
}

function getLastWateredDate(readings) {
  const treshold = 10;
  let watered;
  readings.reduce((previousValue, currentValue) => {
    if (currentValue.moisture_percentage - previousValue.moisture_percentage > treshold) {
      watered = currentValue.time;
      return currentValue;
    }
    return currentValue;
  }, readings[0]);

  return watered;
}

function getTimestamp(date) {
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

module.exports = {
  saveReading,
  getReadings,
};
