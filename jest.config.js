module.exports = {
  testEnvironment: 'jsdom',
  collectCoverageFrom: ['assets/js/**/*.js', '!assets/js/**/*.test.js'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  transform: {
    '^.+\\.js$': ['babel-jest', { configFile: './babel.config.js' }]
  },
  moduleFileExtensions: ['js', 'json'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testPathIgnorePatterns: ['/node_modules/', '/_site/', '/.jekyll-cache/'],
  setupFilesAfterEnv: []
};
