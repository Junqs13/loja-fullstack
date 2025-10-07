// server.js

import express from 'express';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import configRoutes from './routes/configRoutes.js';

dotenv.config();

connectDatabase(); // Conecta ao MongoDB

const app = express();

app.use(express.json()); // <-- 2. HABILITAR O PARSE DE JSON NO CORPO DA REQUISIÇÃO

app.get('/', (req, res) => {
  res.send('A API está rodando...');
});

app.use('/api/users', userRoutes); // <-- 3. CONECTAR AS ROTAS
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/config', configRoutes); 

const PORT = process.env.PORT || 4000;
app.listen(PORT, console.log(`Servidor rodando na porta ${PORT}`));