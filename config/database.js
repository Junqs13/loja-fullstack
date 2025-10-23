// config/database.js
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server'; // Importar

let mongoServer; // Variável para guardar a instância do servidor em memória

const connectDatabase = async () => {
  try {
    let mongoUri;

    // Se estivermos no ambiente de teste, inicia o servidor em memória
    if (process.env.NODE_ENV === 'test') {
      if (!mongoServer) {
        mongoServer = await MongoMemoryServer.create();
      }
      mongoUri = mongoServer.getUri();
    } else {
      // Caso contrário, usa a connection string do .env (produção/desenvolvimento)
      mongoUri = process.env.MONGO_URI;
      if (!mongoUri) {
          console.error('ERRO: MONGO_URI não definida no .env');
          process.exit(1);
      }
    }

    const conn = await mongoose.connect(mongoUri);

    // Usa console.info para distinguir dos logs normais
    console.info(`MongoDB Connected: ${conn.connection.host}`);
    return conn; // Retorna a conexão para possível uso

  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Sai do processo se a conexão falhar
  }
};

// Função para desconectar (usada nos testes)
const disconnectDatabase = async () => {
  try {
    await mongoose.connection.close();
    if (mongoServer) {
      await mongoServer.stop();
      mongoServer = null; // Limpa a referência
      console.info('MongoDB In-Memory Server Stopped.');
    }
  } catch (error) {
    console.error(`Error disconnecting MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export { connectDatabase, disconnectDatabase }; // Exportar ambas as funções