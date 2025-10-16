import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import configRoutes from './routes/configRoutes.js';

dotenv.config();
connectDatabase();

const app = express();
app.use(express.json());

// Rotas da API
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/config', configRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, console.log(`Servidor a rodar na porta ${PORT}`));