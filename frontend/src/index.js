// frontend/src/index.js
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import i18n from './i18n';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import Loader from './components/Loader';
// --- 1. IMPORTAR SENTRY ---
import * as Sentry from "@sentry/react";

// --- 2. INICIALIZAR SENTRY (Antes de renderizar a App) ---
Sentry.init({
  // SUBSTITUA PELA SUA CHAVE DSN DO FRONTEND (ou use variável de ambiente)
  dsn: process.env.REACT_APP_SENTRY_FRONTEND_DSN || "COLE_A_SUA_CHAVE_DSN_FRONTEND_AQUI",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false, // Pode querer 'true' para privacidade
      blockAllMedia: false, // Pode querer 'true' para privacidade
    }),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1, // Captura 10% das sessões normais
  replaysOnErrorSampleRate: 1.0, // Captura 100% das sessões com erros
});
// ---------------------------------------------------------

// Interceptor do Axios para o idioma (mantido)
axios.interceptors.request.use((config) => {
  const lang = i18n.language;
  if (lang) {
    config.headers['Accept-Language'] = lang;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // Suspense é usado pelo i18next para carregar traduções
  <Suspense fallback={<Loader />}>
    <Provider store={store}>
      <App />
    </Provider>
  </Suspense>
);

// Se você usa reportWebVitals, pode mantê-lo
// import reportWebVitals from './reportWebVitals';
// reportWebVitals();