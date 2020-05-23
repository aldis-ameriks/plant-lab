// eslint-disable-next-line @typescript-eslint/no-var-requires
const knexfile = require('../../knexfile');

export const testDatabaseName = `test_${knexfile.connection.database}`;

export function getTestKnexConfig(database?: string) {
  return {
    ...knexfile,
    connection: { ...knexfile.connection, database },
  };
}
