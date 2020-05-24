module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  roots: ['<rootDir>/src'],
  modulePaths: ['<rootDir>/src'],
  testPathIgnorePatterns: ['.js'],
  watchPathIgnorePatterns: ['.js'],
  globalSetup: '<rootDir>/src/common/test-helpers/globalSetup.ts',
  globalTeardown: '<rootDir>/src/common/test-helpers/globalTeardown.ts',
};
