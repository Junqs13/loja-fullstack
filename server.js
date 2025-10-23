// server.js

import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import configRoutes from './routes/configRoutes.js';
import cors from 'cors';

//import * as Sentry from "@sentry/node";

dotenv.config();
// connectDatabase(); // Removido daqui, chamado condicionalmente abaixo

const app = express();

/*// 
Sentry.init({
  // SUBSTITUA PELA SUA CHAVE DSN DO BACKEND (ou use variável de ambiente)
  dsn: process.env.SENTRY_BACKEND_DSN || "COLE_A_SUA_CHAVE_DSN_BACKEND_AQUI",
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});
// ------------------------------------------

// --- 3. HANDLERS DE REQUEST DO SENTRY (Antes das rotas e CORS) ---
// O request handler DEVE ser o primeiro middleware
app.use(Sentry.Handlers.requestHandler());
// O tracing handler cria um trace para cada pedido
app.use(Sentry.Handlers.tracingHandler());
/*/

// --- Configuração CORS ---
const allowedOrigins = [ 'https://loja-fullstack.netlify.app' ];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || (origin && origin.endsWith('--loja-fullstack.netlify.app'))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
// -------------------------

app.use(express.json());

// Rotas da API
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/config', configRoutes);

// --- 4. HANDLER DE ERRO DO SENTRY (Depois das rotas, antes de outros error handlers) ---
// O error handler DEVE vir depois das rotas e antes de qualquer outro middleware de erro customizado
/*//app.use(Sentry.Handlers.errorHandler());
// ---------------------------------------------------------------------------------------

// Optional fallthrough error handler (Se você tiver um customizado)
app.use(function onError(err, req, res, next) {
  // O ID do erro do Sentry é anexado a `res.sentry`
  res.statusCode = err.status || 500; // Usa o status do erro ou 500
  res.json({ // Envia uma resposta JSON mais estruturada
      message: err.message || 'Erro interno do servidor',
      sentryId: res.sentry // Inclui o ID do Sentry para referência
  });
});/*/

const PORT = process.env.PORT || 4000;

// Só inicia o servidor e conecta ao DB se não estiver em ambiente de teste
if (process.env.NODE_ENV !== 'test') {
  connectDatabase().then(() => {
      app.listen(PORT, console.log(`Servidor a rodar na porta ${PORT}`));
  });
}

export default app;