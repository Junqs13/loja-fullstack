// server.js (ou o nome do seu ficheiro principal)

import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import configRoutes from './routes/configRoutes.js';
import cors from 'cors';

dotenv.config();
connectDatabase();

const app = express();

// --- CONFIGURAÇÃO DE CORS MAIS FLEXÍVEL ---
// Lista de URLs que confiamos
const allowedOrigins = [
  'https://loja-fullstack.netlify.app', // Sua URL principal
  // Podemos adicionar mais se necessário, ou usar uma função mais complexa
];

const corsOptions = {
  // Função que verifica se a origem do pedido está na nossa lista
  origin: function (origin, callback) {
    // Permite pedidos sem 'origin' (ex: Postman, apps móveis) OU se a origem estiver na lista
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } 
    // Permite deploy previews do Netlify (terminam com --seunome.netlify.app)
    else if (origin && origin.endsWith('--loja-fullstack.netlify.app')) { 
        callback(null, true);
    }
    else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  optionsSuccessStatus: 200
};

// Usa o middleware CORS para TODAS as requisições
app.use(cors(corsOptions));
// ----------------------------------------

app.use(express.json());

// Rotas da API (Devem vir DEPOIS do app.use(cors(...)))
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/config', configRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, console.log(`Servidor a rodar na porta ${PORT}`));