module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  roots: ['src'],
  modulePaths: ['<rootDir>/src'],
  globalSetup: '<rootDir>/src/common/test-helpers/globalSetup.ts',
  globalTeardown: '<rootDir>/src/common/test-helpers/globalTeardown.ts',
};
