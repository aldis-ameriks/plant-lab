import Knex from 'knex';
import { Inject, Service } from 'typedi';

import { ForbiddenError } from 'common/errors/ForbiddenError';
import { UserSettingEntity } from 'common/types/entities';
import { UserSettingInput } from 'user/models';

@Service()
export class UserService {
  @Inject('knex')
  private readonly knex: Knex;

  async validateAccessKey(accessKey: string): Promise<boolean> {
    const result = await this.knex('users_access_keys').where('access_key', accessKey).first();
    if (!result) {
      throw new ForbiddenError('Invalid access key');
    }
    return true;
  }

  updateUserSetting(id: string, input: UserSettingInput): Promise<UserSettingEntity> {
    return this.knex
      .raw(
        `
      INSERT INTO user_settings values (:userId, :name, :value)
      ON CONFLICT(user_id, name) DO UPDATE SET value = :value
      RETURNING *;
    `,
        { userId: id, ...input }
      )
      .then((result) => result.rows[0]);
  }

  getUserSettings(id: string): Promise<UserSettingEntity[]> {
    return this.knex<UserSettingEntity>('user_settings').where('user_id', id);
  }

  getUserSetting(id: string, name: string): Promise<UserSettingEntity> {
    return this.knex<UserSettingEntity>('user_settings').where('user_id', id).andWhere('name', name).first();
  }
}
