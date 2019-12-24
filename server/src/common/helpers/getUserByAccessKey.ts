import { knex } from '../db';

export function getUserByAccessKey(accessKey: string) {
  return knex('users')
    .select('id', 'roles')
    .where('access_key', accessKey)
    .first();
}
