// config/database.js
import mongoose from 'mongoose';
// Removido: import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer; // Variável para guardar a instância do servidor em memória

const connectDatabase = async () => {
  try {
    let mongoUri;

    // Se estivermos no ambiente de teste
    if (process.env.NODE_ENV === 'test') {
      // --- IMPORTAÇÃO DINÂMICA AQUI ---
      // Importa o pacote SÓ quando necessário
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      // ---------------------------------
      if (!mongoServer) {
        mongoServer = await MongoMemoryServer.create();
      }
      mongoUri = mongoServer.getUri();
    } else {
      // Caso contrário (produção/desenvolvimento), usa a connection string do .env
      mongoUri = process.env.MONGO_URI;
      if (!mongoUri) {
          console.error('ERRO: MONGO_URI não definida no .env');
          process.exit(1);
      }
    }

    const conn = await mongoose.connect(mongoUri);

    console.info(`MongoDB Connected: ${conn.connection.host}`);
    return conn;

  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDatabase = async () => {
  try {
    await mongoose.connection.close();
    if (mongoServer) {
      await mongoServer.stop();
      mongoServer = null;
      console.info('MongoDB In-Memory Server Stopped.');
    }
  } catch (error) {
    console.error(`Error disconnecting MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export { connectDatabase, disconnectDatabase };