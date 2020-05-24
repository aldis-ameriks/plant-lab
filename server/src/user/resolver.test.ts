import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-fastify';
import { ApolloServerTestClient, createTestClient } from 'apollo-server-testing';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';

import { authChecker } from 'common/authChecker';
import { UserSettingEntity } from 'common/types/entities';
import { UserSetting } from 'user/models';
import { UserResolver } from 'user/resolver';
import { UserService } from 'user/service';

describe('user resolver', () => {
  let server: ApolloServer;
  let testClient: ApolloServerTestClient;
  let userServiceMock;
  let validateAccessKeyMock: jest.Mock;
  let getUserSettingsMock: jest.Mock;
  let getUserSettingMock: jest.Mock;
  let updateUserSettingMock: jest.Mock;

  const userId = '123';
  const user = { id: userId, roles: ['role'] };

  beforeAll(async () => {
    validateAccessKeyMock = jest.fn();
    getUserSettingsMock = jest.fn();
    getUserSettingMock = jest.fn();
    updateUserSettingMock = jest.fn();
    // TODO: Create test helper for auto mocking class methods
    userServiceMock = {
      validateAccessKey: validateAccessKeyMock,
      getUserSettings: getUserSettingsMock,
      getUserSetting: getUserSettingMock,
      updateUserSetting: updateUserSettingMock,
    };
    Container.set(UserService, userServiceMock);

    // TODO: Extract as test helper
    const schema = await buildSchema({
      authChecker,
      resolvers: [UserResolver],
      container: Container,
    });

    server = new ApolloServer({
      schema,
      context: async () => {
        return { user, ip: '0.0.0.0', isLocal: false, log: jest.fn() };
      },
    });

    testClient = createTestClient(server);
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

    describe('when user has no settings', () => {
      beforeEach(() => {
        getUserSettingsMock.mockReturnValue([]);
      });

      it('returns empty', async () => {
        const result = await testClient.query({ query: getSettingsQuery });
        expect(result.data.userSettings).toEqual([]);
      });
    });

    describe('when user has settings', () => {
      const setting: UserSettingEntity = { user_id: +userId, name: 'setting', value: 'yes' };
      const expectedSetting: UserSetting = { name: setting.name, value: setting.value };

      beforeEach(() => {
        getUserSettingsMock.mockReturnValue([setting]);
      });

      it('returns settings', async () => {
        const result = await testClient.query({ query: getSettingsQuery });
        expect(result.data.userSettings).toEqual([expectedSetting]);
      });
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

    describe('with missing setting name', () => {
      it('returns error', async () => {
        const result = await testClient.query({ query: getSettingQuery });
        expect(result.data).toBeUndefined();
        expect(result.errors.length).toBe(1);
      });
    });

    describe('when user has no settings', () => {
      beforeEach(() => {
        getUserSettingMock.mockReturnValue(undefined);
      });

      it('returns empty', async () => {
        const result = await testClient.query({ query: getSettingQuery, variables: { name: settingName } });
        expect(result.data.userSetting).toEqual(null);
        expect(getUserSettingMock).toHaveBeenCalledWith(userId, settingName);
      });
    });

    describe('when user has setting', () => {
      const setting: UserSettingEntity = { user_id: +userId, name: settingName, value: 'yes' };
      const expectedSetting: UserSetting = { name: setting.name, value: setting.value };

      beforeEach(() => {
        getUserSettingMock.mockReturnValue(setting);
      });

      it('returns settings', async () => {
        const result = await testClient.query({ query: getSettingQuery, variables: { name: settingName } });
        expect(result.data.userSetting).toEqual(expectedSetting);
        expect(getUserSettingMock).toHaveBeenCalledWith(userId, settingName);
      });
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
    const setting: UserSettingEntity = { user_id: +userId, name: settingName, value: 'yes' };
    const expectedSetting: UserSetting = { name: setting.name, value: setting.value };

    describe('with missing input', () => {
      it('returns error', async () => {
        const result = await testClient.mutate({ mutation: updateSettingMutation });
        expect(result.data).toBeUndefined();
        expect(result.errors.length).toBe(1);
      });
    });

    describe('when setting name is too long', () => {
      it('returns error', async () => {
        const result = await testClient.query({
          query: updateSettingMutation,
          variables: { input: { name: settingName, value: 'x'.repeat(300) } },
        });
        expect(result.data).toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toBe('Argument Validation Error');
      });
    });

    describe('when setting value is too long', () => {
      it('returns error', async () => {
        const result = await testClient.query({
          query: updateSettingMutation,
          variables: { input: { name: 'x'.repeat(300), value: 'yes' } },
        });
        expect(result.data).toBeNull();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toBe('Argument Validation Error');
      });
    });

    describe('when setting value is not a string', () => {
      it('returns error', async () => {
        const result = await testClient.query({
          query: updateSettingMutation,
          variables: { input: { name: setting.name, value: true } },
        });
        expect(result.data).toBeUndefined();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].message).toContain('got invalid value');
      });
    });

    describe('when input is valid', () => {
      beforeEach(() => {
        updateUserSettingMock.mockReturnValue(expectedSetting);
      });

      it('returns updated setting', async () => {
        const result = await testClient.query({
          query: updateSettingMutation,
          variables: { input: { name: setting.name, value: setting.value } },
        });
        expect(result.data.updateUserSetting).toEqual(expectedSetting);
      });
    });
  });
});
