// server.js (Sem Sentry)

import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
// Importa AMBAS as funções de database.js
import { connectDatabase, disconnectDatabase } from './config/database.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import configRoutes from './routes/configRoutes.js';
import cors from 'cors';
// Removida importação do Sentry

dotenv.config();
// connectDatabase(); // Removido daqui, chamado condicionalmente abaixo

const app = express();

// Removida inicialização Sentry.init()

// Removidos Handlers de Request Sentry

// --- Configuração CORS (Mantida) ---
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
// -----------------------------------

app.use(express.json());

// Rotas da API (Devem vir DEPOIS do CORS e JSON middlewares)
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/config', configRoutes);

// Removido Handler de Erro Sentry

// Error handler customizado (Mantido)
// Este será o handler principal de erros
app.use(function onError(err, req, res, next) {
  // Define o status code baseado no erro lançado pelo middleware/controller, ou 500
  // Garante que o status code seja pelo menos 400 se já não for um erro
  let statusCode = res.statusCode >= 400 ? res.statusCode : 500;
  if(err.status) statusCode = err.status; // Usa o status do erro se existir

  console.error(`Erro ${statusCode}: ${err.message}`); // Log do erro no backend
  res.status(statusCode).json({ // Garante que o status code correto é enviado
      message: err.message || 'Erro interno do servidor',
      // stack: process.env.NODE_ENV === 'production' ? null : err.stack // Opcional: mostrar stack em dev
  });
});

const PORT = process.env.PORT || 4000;

// Só inicia o servidor e conecta ao DB se não estiver em ambiente de teste
if (process.env.NODE_ENV !== 'test') {
  connectDatabase().then(() => {
      app.listen(PORT, console.log(`Servidor a rodar na porta ${PORT} em modo ${process.env.NODE_ENV || 'development'}`));
  }).catch(err => {
      console.error("Falha ao conectar ao DB antes de iniciar o servidor:", err);
      process.exit(1);
  });
}

// Exporta a app para os testes de integração (Supertest)
export default app;