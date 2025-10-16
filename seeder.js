import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from './data/users.js';
import products from './data/products.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import { connectDatabase } from './config/database.js';

dotenv.config();
await connectDatabase();

const importData = async () => {
  try {
    // 1. Limpa a base de dados
    await Product.deleteMany();
    await User.deleteMany();

    // 2. Insere os utilizadores e guarda as suas referências
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0];
    const sampleUser1 = createdUsers[1];
    const sampleUser2 = createdUsers[2];

    // 3. Adiciona o utilizador admin a cada produto
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser._id };
    });

    // 4. Insere os produtos e guarda as suas referências
    const createdProducts = await Product.insertMany(sampleProducts);

    // 5. Adiciona avaliações a cada produto
    for (const product of createdProducts) {
        const review1 = {
            name: sampleUser1.name,
            rating: Math.ceil(Math.random() * 5), // Nota aleatória de 1 a 5
            comment: 'Ótimo produto, recomendo a todos!',
            user: sampleUser1._id,
        };
        const review2 = {
            name: sampleUser2.name,
            rating: Math.ceil(Math.random() * 5),
            comment: 'Good quality, fast shipping.',
            user: sampleUser2._id,
        };
        const review3 = {
            name: adminUser.name,
            rating: Math.ceil(Math.random() * 5),
            comment: 'Poderia ser melhor em alguns aspetos.',
            user: adminUser._id,
        };
        
        // Adiciona as avaliações ao produto
        product.reviews.push(review1, review2, review3);
        
        // Atualiza o número de avaliações e a média da nota
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
        
        // Guarda o produto atualizado
        await product.save();
    }

    console.log('Dados importados com avaliações!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
    try {
        await Product.deleteMany();
        await User.deleteMany();
        
        console.log('Dados Destruídos!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1);
    }
};

// Verifica se o comando para destruir foi passado na linha de comando
if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}