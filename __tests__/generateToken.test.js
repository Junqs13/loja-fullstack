import jwt from 'jsonwebtoken';
import generateToken from '../../utils/generateToken.js';

// Define um segredo JWT mockado para os testes
process.env.JWT_TOKEN = 'test_secret_key_123';

describe('Função generateToken', () => {
  const testUserId = '60d5ecf36c8b4a1f3c8e4d3c';

  it('deve gerar um token JWT válido', () => {
    const token = generateToken(testUserId);
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(10);
  });

  it('o token gerado deve conter o ID do usuário correto quando decodificado', () => {
    const token = generateToken(testUserId);
    try {
      const decoded = jwt.verify(token, process.env.JWT_TOKEN);
      expect(decoded.id).toBe(testUserId);
    } catch (error) {
      throw new Error(`Falha ao verificar o token: ${error.message}`);
    }
  });

  it('o token gerado deve expirar (verificando a presença do campo exp)', () => {
    const token = generateToken(testUserId);
    const decoded = jwt.decode(token);
    expect(decoded).toHaveProperty('exp');
    expect(typeof decoded.exp).toBe('number');
  });
});