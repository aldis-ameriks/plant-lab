const Influx = require('influx');
import { INFLUX } from './config'

export const client = new Influx.InfluxDB({
  host: INFLUX.HOST,
  database: 'plants',
  port: INFLUX.PORT,
  username: INFLUX.USERNAME,
  password: INFLUX.PASSWORD,
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
