// src/setupTests.js

import '@testing-library/jest-dom';

// Mock global para a biblioteca react-i18next
jest.mock('react-i18next', () => ({
  // A função useTranslation agora retornará um objeto de exemplo
  useTranslation: () => {
    return {
      t: (str) => str, // A função 't' simplesmente retorna a chave que recebeu
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
}));