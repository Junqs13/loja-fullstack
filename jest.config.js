// jest.config.js
export default {
  testEnvironment: 'node',
  roots: ['<rootDir>/__tests__'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  moduleNameMapper: {
    '^../../models/(.*)$': '<rootDir>/models/$1',
    '^../../utils/(.*)$': '<rootDir>/utils/$1',
  },
  // --- ADICIONADO ---
  // Carrega as variáveis do .env antes de executar os testes
  setupFiles: ['dotenv/config'],
  // ------------------
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  forceExit: true,
};