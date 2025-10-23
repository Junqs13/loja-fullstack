import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
// --- ALTERAÇÃO AQUI ---
import User from '../models/userModel.js'; // Caminho relativo correto (um nível acima)

describe('Modelo User - Método matchPassword', () => {
  const plainPassword = 'password123';
  let testUser;

  // Cria uma instância ANTES de cada teste
  beforeEach(async () => {
    testUser = new User({
      name: 'Test User for Password',
      email: `passwordtest-${Date.now()}@test.com`, // Email único para evitar conflitos entre testes se beforeEach limpar DB
      password: plainPassword,
    });
    // Simula o hash que o pre-save faria
    // Nota: O hook pre-save SÓ corre quando .save() é chamado.
    // Para testes unitários do método, é mais fiável simular o hash aqui.
    const salt = await bcrypt.genSalt(10);
    testUser.password = await bcrypt.hash(testUser.password, salt);
  });

  it('deve retornar true para a senha correta', async () => {
    const isMatch = await testUser.matchPassword(plainPassword);
    expect(isMatch).toBe(true);
  });

  it('deve retornar false para uma senha incorreta', async () => {
    const wrongPassword = 'wrongpassword';
    const isMatch = await testUser.matchPassword(wrongPassword);
    expect(isMatch).toBe(false);
  });

  it('deve retornar false se a senha fornecida for vazia ou nula', async () => {
    let isMatch = await testUser.matchPassword('');
    expect(isMatch).toBe(false);
    isMatch = await testUser.matchPassword(null);
    expect(isMatch).toBe(false);
    isMatch = await testUser.matchPassword(undefined);
    expect(isMatch).toBe(false);
  });

   it('a senha no modelo deve estar hasheada (não a senha original)', async () => {
      expect(testUser.password).toBeDefined();
      expect(testUser.password).not.toBe(plainPassword);
      expect(testUser.password).toMatch(/^\$2[aby]\$/);
  });
});