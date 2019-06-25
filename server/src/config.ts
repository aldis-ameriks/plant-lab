import * as config from 'config'

export const INFLUX: { HOST: string, PORT: string, USERNAME: string, PASSWORD: string } = config.get('INFLUX');
