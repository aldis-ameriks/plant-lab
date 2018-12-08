const Influx = require('influx');

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

const getReadings = async (nodeid = 99, limit = 100, every = 1) => {
  const result = await client.query(
    `select * from plant where nodeid=${Number(nodeid)} order by time desc limit ${Number(limit)}`
  );
  if (every > 1) {
    return result.filter((r, i) => !(i % every));
  }
  return result;
};

module.exports = {
  saveReading,
  getReadings,
};
