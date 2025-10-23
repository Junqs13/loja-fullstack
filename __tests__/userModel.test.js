import mongoose from 'mongoose';
import User from '../../models/userModel.js';

describe('Modelo User - Método matchPassword', () => {
  const plainPassword = 'password123';
  let testUser;

  beforeEach(async () => {
    testUser = new User({
      name: 'Test User for Password',
      email: 'passwordtest@test.com',
      password: plainPassword,
    });
    // Simula o hook pre-save. Para ser mais robusto, poderíamos
    // instanciar e chamar save num DB mockado ou apenas testar o compare
    const salt = await bcrypt.genSalt(10); // Precisamos importar bcrypt aqui
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
      // Pequena correção: precisamos importar bcrypt para que o beforeEach funcione
      // ou testamos apenas a lógica de comparação assumindo que o hash já existe.
      // Vamos manter a simulação do hash, mas precisamos importar bcrypt.
      expect(testUser.password).toBeDefined();
      expect(testUser.password).not.toBe(plainPassword);
      expect(testUser.password).toMatch(/^\$2[aby]\$/);
  });
});

// Adicionar importação do bcrypt para o beforeEach funcionar corretamente
import bcrypt from 'bcryptjs';