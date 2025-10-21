import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import i18n from './i18n'; // Importa a nossa instância i18n
import axios from 'axios'; // Importa o axios
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import Loader from './components/Loader';

// ▼▼▼ ADICIONE ESTE BLOCO DE CÓDIGO (O INTERCEPTOR) ▼▼▼
// Este interceptor garante que TODAS as requisições do axios enviem o idioma atual
axios.interceptors.request.use((config) => {
  // Pega o idioma atual diretamente da instância do i18next
  const lang = i18n.language;
  if (lang) {
    config.headers['Accept-Language'] = lang;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
// ▲▲▲ FIM DO BLOCO ▲▲▲

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Suspense fallback={<Loader />}>
    <Provider store={store}>
      <App />
    </Provider>
  </Suspense>
);