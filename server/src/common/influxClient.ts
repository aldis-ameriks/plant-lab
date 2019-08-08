const influx = require('influx');
import { INFLUX } from './config';

export const client = new influx.InfluxDB({
  host: INFLUX.HOST,
  database: 'plants',
  port: INFLUX.PORT,
  username: INFLUX.USERNAME,
  password: INFLUX.PASSWORD,
  schema: [
    {
      measurement: 'plant',
      fields: {
        moisture: influx.FieldType.INTEGER,
        moisture_percentage: influx.FieldType.FLOAT,
        moisture_wet: influx.FieldType.INTEGER,
        moisture_dry: influx.FieldType.INTEGER,
        temperature: influx.FieldType.INTEGER,
        light: influx.FieldType.INTEGER,
        battery_voltage: influx.FieldType.FLOAT,
      },
      tags: ['node_id'],
    },
  ],
});

export type InfluxReading = {
  moisture: number;
  moisture_percentage: number;
  moisture_wet: number;
  moisture_dry: number;
  temperature: number;
  light: number;
  battery_voltage: number;
  time: string;
}
