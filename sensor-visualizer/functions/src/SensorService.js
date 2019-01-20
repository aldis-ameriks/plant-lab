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
        m_wet: Influx.FieldType.INTEGER,
        m_dry: Influx.FieldType.INTEGER,
        temperature: Influx.FieldType.INTEGER,
        moisture_precentage: Influx.FieldType.FLOAT,
        nodeid: Influx.FieldType.INTEGER,
        type: Influx.FieldType.STRING,
      },
      tags: ['nodeid', 'type'],
    },
  ],
});

const saveReading = async reading => {
  const item = {
    measurement: 'plant',
    tags: { nodeid: reading.nodeid, type: reading.type },
    time: new Date().toISOString(),
    fields: reading,
  };
  await client.writePoints([item]);
};

const getReadings = async (nodeid = 99, date) => {
  const time = getTimestamp(date);
  const nanoEpoch = formatToNanoEpoch(time);

  const readings = await client.query(
    `select * from plant where nodeid=${Number(nodeid)} and time > ${nanoEpoch} order by time desc`
  );
  return parseReadings(readings);
};

function parseReadings(readings) {
  const tolerance = 2;

  const humidity = simplify(
    readings.map(reading => ({
      x: reading.moisture_precentage,
      y: new Date(reading.time).getTime(),
    })),
    tolerance
  ).reverse();

  const temperature = simplify(
    readings.map(reading => ({ x: reading.temperature, y: new Date(reading.time).getTime() })),
    tolerance
  ).reverse();

  return humidity.map((value, i) => ({
    humidity: Math.round(value.x),
    time: new Date(value.y),
    temperature: temperature[i].x,
  }));
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
