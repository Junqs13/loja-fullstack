// server.js (ou o nome do seu ficheiro principal)

import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import configRoutes from './routes/configRoutes.js';
import cors from 'cors'; // <-- 1. IMPORTAR (já estava correto)

dotenv.config();
connectDatabase();

const app = express();

// --- 2. CONFIGURAR O CORS ---
const corsOptions = {
  // Substitua pela URL exata do seu site no Netlify
  origin: 'https://loja-fullstack.netlify.app', 
  optionsSuccessStatus: 200
};

// --- 3. USAR O MIDDLEWARE (ANTES DAS ROTAS) ---
app.use(cors(corsOptions));

app.use(express.json());

// Rotas da API
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/config', configRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, console.log(`Servidor a rodar na porta ${PORT}`));