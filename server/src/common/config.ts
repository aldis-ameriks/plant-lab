import * as config from 'config'

export const INFLUX: { HOST: string, PORT: string, USERNAME: string, PASSWORD: string } = config.get('INFLUX');
export const ACCESS_KEY: String = config.get('ACCESS_KEY');
