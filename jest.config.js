module.exports = {
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    'assets/js/**/*.js',
    '!assets/js/**/*.test.js',
    'framer/code/**/*.{ts,tsx}',
    '!framer/code/**/*.test.{ts,tsx}'
  ],
  testMatch: ['**/__tests__/**/*.{js,ts,tsx}', '**/?(*.)+(spec|test).{js,ts,tsx}'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { configFile: './babel.config.js' }]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testPathIgnorePatterns: ['/node_modules/', '/_site/', '/.jekyll-cache/'],
  setupFilesAfterEnv: [],
  moduleNameMapper: {
    '^three$': '<rootDir>/node_modules/three'
  }
};
