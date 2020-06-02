import Knex from 'knex';
import { Container } from 'typedi';

import { ForbiddenError } from 'common/errors/ForbiddenError';
import { getTestKnexConfig, testDatabaseName } from 'common/test-helpers/testDb';
import { UserSettingEntity } from 'common/types/entities';
import { UserSettingInput } from 'user/models';
import { UserService } from 'user/service';

describe('user service', () => {
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

  test('getUserSettings', async () => {
    expect(await userService.getUserSettings(userId)).toEqual([]);

    let setting: UserSettingEntity = { user_id: +secondUserId, name: settingName, value: 'yes' };
    await knex('user_settings').insert(setting);
    expect(await userService.getUserSettings(userId)).toEqual([]);

    setting = { user_id: +userId, name: settingName, value: 'yes' };
    await knex('user_settings').insert(setting);
    expect(await userService.getUserSettings(userId)).toEqual([setting]);
  });

  test('getUserSetting', async () => {
    expect(await userService.getUserSetting(userId, settingName)).toBeUndefined();

    let setting: UserSettingEntity = { user_id: +userId, name: 'different', value: 'yes' };
    await knex('user_settings').insert(setting);
    expect(await userService.getUserSetting(userId, settingName)).toBeUndefined();

    setting = { user_id: +secondUserId, name: settingName, value: 'yes' };
    await knex('user_settings').insert(setting);
    expect(await userService.getUserSetting(userId, settingName)).toBeUndefined();

    setting = { user_id: +userId, name: settingName, value: 'yes' };
    await knex('user_settings').insert(setting);
    expect(await userService.getUserSetting(userId, settingName)).toEqual(setting);
  });

  test('updateUserSetting', async () => {
    const setting: UserSettingEntity = { user_id: +userId, name: settingName, value: 'yes' };

    expect(await userService.getUserSetting(userId, settingName)).toBeUndefined();
    let input: UserSettingInput = { name: settingName, value: 'yes' };
    await userService.updateUserSetting(userId, input);
    expect(await userService.getUserSetting(userId, settingName)).toEqual(setting);

    input = { name: settingName, value: 'no' };
    await userService.updateUserSetting(userId, input);
    expect(await userService.getUserSetting(userId, settingName)).toEqual({ ...setting, value: 'no' });
  });

  describe('validateAccessKey', () => {
    test('unknown key', async () => {
      await expect(userService.validateAccessKey(accessKey)).rejects.toThrow(ForbiddenError);
    });

    test('known key', async () => {
      await knex('users_access_keys').insert({ user_id: userId, access_key: accessKey, roles: ['role'] });
      expect(await userService.validateAccessKey(accessKey)).toBe(true);
    });
  });
});
