export default {
  testEnvironment: 'node',
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js'
  ],
  collectCoverageFrom: [
    'tests/**/*.js',
    '!tests/**/*.test.js',
    '!tests/**/*.spec.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testTimeout: 30000,
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  }
};
