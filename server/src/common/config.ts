import config from 'config';

export const ACCESS_KEY: string = config.get('ACCESS_KEY');

export const KNEX: {
  HOST: string;
  PORT: string;
  USERNAME: string;
  PASSWORD: string;
} = config.get('KNEX');
