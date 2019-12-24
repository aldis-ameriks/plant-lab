import config from 'config';

export const KNEX: {
  HOST: string;
  PORT: number;
  USERNAME: string;
  PASSWORD: string;
} = config.get('KNEX');
