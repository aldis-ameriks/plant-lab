import Knex from 'knex';
import { Container } from 'typedi';

import { ForbiddenError } from 'common/errors/ForbiddenError';
import { getTestKnexConfig, testDatabaseName } from 'common/test-helpers/testDb';
import { UserSettingEntity } from 'common/types/entities';
import { UserSettingInput } from 'user/models';
import { UserService } from 'user/service';

describe('service', () => {
  const userId = '99';
  const secondUserId = '123';
  const settingName = 'notifications';
  const accessKey = 'access-123';

  let knex: Knex;
  let userService: UserService;

  beforeAll(async () => {
    knex = Knex(getTestKnexConfig(testDatabaseName));
    Container.of('user.service').set('knex', knex);
    userService = Container.of('user.service').get(UserService);
  });

  beforeEach(async () => {
    await knex.raw('TRUNCATE TABLE users CASCADE');
    await knex('users').insert({ id: userId });
    await knex('users').insert({ id: secondUserId });
  });

  describe('getUserSettings', () => {
    describe('when user has no settings', () => {
      it('returns empty', async () => {
        expect(await userService.getUserSettings(userId)).toEqual([]);
      });
    });

    describe('when user has settings', () => {
      const setting: UserSettingEntity = { user_id: +userId, name: settingName, value: 'yes' };

      beforeEach(async () => {
        await knex('user_settings').insert(setting);
      });

      it('returns settings', async () => {
        expect(await userService.getUserSettings(userId)).toEqual([setting]);
      });
    });

    describe('when different user has settings', () => {
      const setting: UserSettingEntity = { user_id: +secondUserId, name: settingName, value: 'yes' };

      beforeEach(async () => {
        await knex('user_settings').insert(setting);
      });

      it('returns empty', async () => {
        expect(await userService.getUserSettings(userId)).toEqual([]);
      });
    });
  });

  describe('getUserSetting', () => {
    describe('when user has no settings', () => {
      it('returns empty', async () => {
        expect(await userService.getUserSetting(userId, settingName)).toBeUndefined();
      });
    });

    describe('when user has setting', () => {
      const setting: UserSettingEntity = { user_id: +userId, name: settingName, value: 'yes' };

      beforeEach(async () => {
        await knex('user_settings').insert(setting);
      });

      it('returns setting', async () => {
        expect(await userService.getUserSetting(userId, settingName)).toEqual(setting);
      });
    });

    describe('when user has different setting', () => {
      const setting: UserSettingEntity = { user_id: +userId, name: 'different', value: 'yes' };

      beforeEach(async () => {
        await knex('user_settings').insert(setting);
      });

      it('returns empty', async () => {
        expect(await userService.getUserSetting(userId, settingName)).toBeUndefined();
      });
    });

    describe('when different user has setting', () => {
      const setting: UserSettingEntity = { user_id: +secondUserId, name: settingName, value: 'yes' };

      beforeEach(async () => {
        await knex('user_settings').insert(setting);
      });

      it('returns empty', async () => {
        expect(await userService.getUserSetting(userId, settingName)).toBeUndefined();
      });
    });
  });

  describe('updateUserSetting', () => {
    const setting: UserSettingEntity = { user_id: +userId, name: settingName, value: 'yes' };

    describe('when user setting does not exist', () => {
      beforeEach(async () => {
        expect(await userService.getUserSetting(userId, settingName)).toBeUndefined();
        const input: UserSettingInput = { name: settingName, value: 'yes' };
        await userService.updateUserSetting(userId, input);
      });

      it('inserts setting entry', async () => {
        expect(await userService.getUserSetting(userId, settingName)).toEqual(setting);
      });

      describe('and updating existing setting entry', () => {
        beforeEach(async () => {
          expect(await userService.getUserSetting(userId, settingName)).toEqual(setting);
          const input: UserSettingInput = { name: settingName, value: 'no' };
          await userService.updateUserSetting(userId, input);
        });

        it('updates setting entry', async () => {
          expect(await userService.getUserSetting(userId, settingName)).toEqual({ ...setting, value: 'no' });
        });
      });
    });
  });

  describe('validateAccessKey', () => {
    describe('with unknown key', () => {
      it('throws an error', async () => {
        await expect(userService.validateAccessKey(accessKey)).rejects.toThrow(ForbiddenError);
      });
    });

    describe('with known access key', () => {
      beforeEach(async () => {
        await knex('users_access_keys').insert({ user_id: userId, access_key: accessKey, roles: ['role'] });
      });

      it('returns given access key', async () => {
        expect(await userService.validateAccessKey(accessKey)).toBe(true);
      });
    });
  });
});
