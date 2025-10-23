// jest.config.js
export default {
  testEnvironment: 'node',
  roots: ['<rootDir>/__tests__'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  // moduleNameMapper NÃO DEVE ESTAR AQUI (ou comentado)
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  forceExit: true,
};