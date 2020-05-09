import { knex } from 'common/db';
import { ForbiddenError } from 'common/errors/ForbiddenError';

export class UserService {
  async validateAccessKey(accessKey: string): Promise<boolean> {
    const result = await knex('users_access_keys').where('access_key', accessKey).first();
    if (!result) {
      throw new ForbiddenError('Invalid access key');
    }
    return true;
  }
}
