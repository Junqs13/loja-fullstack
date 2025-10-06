// seeder.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from './data/users.js'; // Precisaremos de um usuário admin
import products from './data/products.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import { connectDatabase } from './config/database.js';

dotenv.config();
connectDatabase();

const importData = async () => {
  try {
    // Limpa o banco de dados
    await Product.deleteMany();
    await User.deleteMany();

    // Insere usuários
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id; // Pega o ID do primeiro usuário (admin)

    // Adiciona o ID do admin a cada produto
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    // Insere os produtos
    await Product.insertMany(sampleProducts);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

// Roda a função de importação
importData();