import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-fastify';
import fastify, { FastifyInstance } from 'fastify';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';

import { authChecker } from 'common/authChecker';
import { mockClassMethods } from 'common/test-helpers/mockClassMethods';
import { UserSettingEntity } from 'common/types/entities';
import { UserSetting } from 'user/models';
import { UserResolver } from 'user/resolver';
import { UserService } from 'user/service';

describe('user resolver', () => {
  let app: FastifyInstance;
  let userServiceMock: { [key in keyof UserService]: jest.Mock };

  const userId = '123';
  const user = { id: userId, roles: ['role'] };

  beforeAll(async () => {
    userServiceMock = mockClassMethods(UserService);
    Container.set(UserService, userServiceMock);

    // TODO: Extract as test helper
    const schema = await buildSchema({
      authChecker,
      resolvers: [UserResolver],
      container: Container,
    });

    const server = new ApolloServer({
      schema,
      context: async () => {
        return { user, ip: '0.0.0.0', isLocal: false, log: jest.fn() };
      },
    });

    app = fastify();
    app.register(server.createHandler({ path: '/graphql' }));
  });

  describe('userSettings', () => {
    const getSettingsQuery = `
          query GetSettings {
            userSettings {
              name
              value
            }
          }
    `;

    test('user has no settings', async () => {
      userServiceMock.getUserSettings.mockReturnValue([]);
      const result = await app.inject({ method: 'POST', url: '/graphql', payload: { query: getSettingsQuery } });
      expect(JSON.parse(result.body).data.userSettings).toEqual([]);
    });

    test('user has settings', async () => {
      const setting: UserSettingEntity = { user_id: +userId, name: 'setting', value: 'yes' };
      const expectedSetting: UserSetting = { name: setting.name, value: setting.value };
      userServiceMock.getUserSettings.mockReturnValue([setting]);

      const result = await app.inject({ method: 'POST', url: '/graphql', payload: { query: getSettingsQuery } });
      expect(JSON.parse(result.body).data.userSettings).toEqual([expectedSetting]);
    });
  });

  describe('userSetting', () => {
    const settingName = 'some-setting';
    const getSettingQuery = `
      query GetSetting($name: String!) {
        userSetting(name: $name) {
          name
          value
        }
      }
    `;

    test('missing setting name', async () => {
      const result = await app.inject({ method: 'POST', url: '/graphql', payload: { query: getSettingQuery } });
      expect(JSON.parse(result.body).data).toBeUndefined();
      expect(JSON.parse(result.body).errors.length).toBe(1);
    });

    test('user has no settings', async () => {
      userServiceMock.getUserSetting.mockReturnValue(undefined);

      const result = await app.inject({
        method: 'POST',
        url: '/graphql',
        payload: { query: getSettingQuery, variables: { name: settingName } },
      });
      expect(JSON.parse(result.body).data.userSetting).toEqual(null);
      expect(userServiceMock.getUserSetting).toHaveBeenCalledWith(userId, settingName);
    });

    test('user has setting', async () => {
      const setting: UserSettingEntity = { user_id: +userId, name: settingName, value: 'yes' };
      const expectedSetting: UserSetting = { name: setting.name, value: setting.value };
      userServiceMock.getUserSetting.mockReturnValue(setting);

      const result = await app.inject({
        method: 'POST',
        url: '/graphql',
        payload: { query: getSettingQuery, variables: { name: settingName } },
      });
      expect(JSON.parse(result.body).data.userSetting).toEqual(expectedSetting);
      expect(userServiceMock.getUserSetting).toHaveBeenCalledWith(userId, settingName);
    });
  });

  describe('updateUserSetting', () => {
    const settingName = 'some-setting';
    const updateSettingMutation = `
      mutation UpdateSetting($input: UserSettingInput!) {
        updateUserSetting(input: $input) {
          name
          value
        }
      }
    `;

    test('validates user input', async () => {
      const tests = [
        { input: { name: settingName, value: 'x'.repeat(300) }, output: 'Argument Validation Error' },
        { input: { name: 'x'.repeat(300), value: 'yes' }, output: 'Argument Validation Error' },
        { input: { name: settingName, value: true }, output: 'got invalid value' },
        { input: { name: 123, value: 'true' }, output: 'got invalid value' },
      ];

      await Promise.all(
        tests.map(async (test) => {
          const result = await app.inject({
            method: 'POST',
            url: '/graphql',
            payload: { query: updateSettingMutation, variables: { input: test.input } },
          });
          const body = JSON.parse(result.body);
          expect(body.data).toBeFalsy();
          expect(body.errors.length).toBe(1);
          expect(body.errors[0].message).toContain(test.output);
        })
      );
    });

    test('returns updated setting', async () => {
      const setting: UserSettingEntity = { user_id: +userId, name: settingName, value: 'yes' };
      const expectedSetting: UserSetting = { name: setting.name, value: setting.value };
      userServiceMock.updateUserSetting.mockReturnValue(expectedSetting);

      const result = await app.inject({
        method: 'POST',
        url: '/graphql',
        payload: { query: updateSettingMutation, variables: { input: { name: setting.name, value: setting.value } } },
      });

      expect(JSON.parse(result.body).data.updateUserSetting).toEqual(expectedSetting);
    });
  });
});
