import { knex } from '../db';

export function getUserByAccessKey(accessKey: string) {
  return knex('users_access_keys')
    .select('users.id', knex.raw("coalesce(users_access_keys.roles, '{}') as roles"))
    .leftJoin('users', 'users.id', 'users_access_keys.user_id')
    .where('access_key', accessKey)
    .first();
}
