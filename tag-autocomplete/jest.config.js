module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom', 
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/__tests__/**/*.test.ts']
};
