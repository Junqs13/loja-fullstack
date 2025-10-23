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
// Removida importação do Sentry

// Removida inicialização Sentry.init()

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