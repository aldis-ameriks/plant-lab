import * as influx from 'influx';

const { INFLUX_HOST, INFLUX_PORT, INFLUX_USER, INFLUX_PASSWORD } = process.env;

// @ts-ignore
const client = new influx.InfluxDB({
  host: INFLUX_HOST,
  database: 'plants',
  port: INFLUX_PORT,
  username: INFLUX_USER,
  password: INFLUX_PASSWORD,
  schema: [
    {
      measurement: 'plant',
      fields: {
        moisture: influx.FieldType.INTEGER,
        m_wet: influx.FieldType.INTEGER,
        m_dry: influx.FieldType.INTEGER,
        temperature: influx.FieldType.INTEGER,
        moisture_precentage: influx.FieldType.FLOAT,
        nodeid: influx.FieldType.INTEGER,
        type: influx.FieldType.STRING,
      },
      tags: ['nodeid', 'type'],
    },
  ],
});

export type Reading = {
  nodeid: number;
  type: string;
  moisture: number;
  m_wet: number;
  m_dry: number;
  temperature: number;
  moisture_precentage: number;
};

export const saveReading = async (reading: Reading) => {
  const item = {
    measurement: 'plant',
    tags: { nodeid: reading.nodeid, type: reading.type },
    time: new Date().toISOString(),
    fields: reading,
  };
  await client.writePoints([item]);
};

export const getReadings = async (nodeid: number = 99, limit: number = 100, every: number = 1) => {
  const result = await client.query(
    `select * from plant where nodeid=${nodeid} order by time desc limit ${limit}`,
  );
  if (every > 1) {
    return result.filter((r: any, i: number) => !(i % every));
  }
  return result;
};
