// tests/setup.js
import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import User from '../models/userModel.js'; // Importar o modelo User
import generateToken from '../utils/generateToken.js'; // Importar o gerador de token

// Variáveis globais para guardar dados de teste
let testUser;
let testUserToken;
let adminUser;
let adminToken;

beforeAll(async () => {
  await connectDatabase(); // Conecta ao DB em memória

  // Limpa a coleção de utilizadores (garante um estado limpo)
  await User.deleteMany({});

  // Cria um utilizador Admin de teste
  adminUser = await User.create({
    name: 'Admin Test User',
    email: 'admin@test.com',
    password: 'password123', // Será hasheada pelo pre-save do model
    isAdmin: true,
  });
  adminToken = generateToken(adminUser._id);

  // Cria um utilizador Normal de teste
  testUser = await User.create({
    name: 'Test User',
    email: 'user@test.com',
    password: 'password123',
  });
  testUserToken = generateToken(testUser._id);

  // Exporta (ou disponibiliza globalmente se preferir) os dados para os testes
  // Aqui estamos a usar 'global' para simplicidade, mas exportar seria mais explícito
  global.adminUser = adminUser;
  global.adminToken = adminToken;
  global.testUser = testUser;
  global.testUserToken = testUserToken;

});

afterAll(async () => {
  await User.deleteMany({}); // Limpa os utilizadores criados
  await disconnectDatabase(); // Desconecta do DB
});

// Opcional: Limpar antes de cada teste individualmente
// beforeEach(async () => {
//   await User.deleteMany({});
//   // Recriar utilizadores se necessário para cada teste
// });