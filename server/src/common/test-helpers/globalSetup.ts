import Knex from 'knex';
// Workaround to force ts-jest to transpile migration files
import '../../../migrations/20191222102149_init';
import '../../../migrations/20191224100314_roles';
import '../../../migrations/20191224113832_firmware';
import '../../../migrations/20191224144247_access-key';
import '../../../migrations/20191225105617_access-key-idx';
import '../../../migrations/20200410152419_reading-timestamp';
import '../../../migrations/20200410155637_reading-id';
import '../../../migrations/20200412202102_device-address';
import '../../../migrations/20200413173632_reading-hub-id';
import '../../../migrations/20200413180101_device-status';
import '../../../migrations/20200420231547_device-version';
import '../../../migrations/20200424000859_unique-users-devices';
import '../../../migrations/20200510003011_notifications';
import '../../../migrations/20200517192741_user_settings';

import { dropDatabase, createDatabase, getTestKnexConfig, testDatabaseName, runMigrations } from './testDb';

export default async function globalSetup() {
  let knex = Knex(getTestKnexConfig());

  try {
    await dropDatabase(knex);
    // eslint-disable-next-line no-empty
  } catch (e) {}

  await createDatabase(knex);
  knex = Knex(getTestKnexConfig(testDatabaseName));
  await runMigrations(knex);
}
