import request from 'supertest';
import app from '../server.js';
import User from '../models/userModel.js'; // Importar User para verificar atualizações no DB

describe('API de Utilizadores', () => {

  // --- Testes para GET /api/users/profile (Rota Protegida Normal) ---
  describe('GET /api/users/profile', () => {
    it('deve retornar 401 Unauthorized se nenhum token for enviado', async () => {
      await request(app)
        .get('/api/users/profile')
        .expect(401);
    });

    it('deve retornar 401 Unauthorized se um token inválido for enviado', async () => {
      await request(app)
        .get('/api/users/profile')
        .set('Authorization', 'Bearer token_invalido_123')
        .expect(401);
    });

    it('deve retornar 200 OK e os dados do perfil se um token válido (normal) for enviado', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${global.testUserToken}`) // Token de utilizador normal
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('_id', global.testUser._id.toString());
      expect(response.body).toHaveProperty('name', global.testUser.name);
      expect(response.body).toHaveProperty('email', global.testUser.email);
      expect(response.body).toHaveProperty('isAdmin', false);
      expect(response.body).not.toHaveProperty('password');
    });
  });

  // --- Testes para GET /api/users (Rota Protegida Admin) ---
  describe('GET /api/users', () => {
    it('deve retornar 401 Unauthorized se nenhum token for enviado', async () => {
      await request(app)
        .get('/api/users')
        .expect(401);
    });

    it('deve retornar 403 Forbidden se um token de utilizador normal for enviado', async () => {
      await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${global.testUserToken}`) // Token de utilizador NORMAL
        .expect(403);
    });

    it('deve retornar 200 OK e uma lista de utilizadores se um token de admin for enviado', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${global.adminToken}`) // Token de utilizador ADMIN
        .expect('Content-Type', /json/)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
      const adminInResponse = response.body.find(user => user.email === global.adminUser.email);
      expect(adminInResponse).toBeDefined();
      expect(adminInResponse).toHaveProperty('name', global.adminUser.name);
      expect(adminInResponse).toHaveProperty('isAdmin', true);
      expect(adminInResponse).not.toHaveProperty('password');
    });
  });

  // --- NOVO BLOCO DE TESTES ---
  // --- Testes para PUT /api/users/profile (Atualizar Perfil) ---
  describe('PUT /api/users/profile', () => {
    it('deve retornar 401 Unauthorized se nenhum token for enviado', async () => {
      await request(app)
        .put('/api/users/profile')
        .send({ name: 'Novo Nome' }) // Envia dados para atualização
        .expect(401);
    });

    it('deve retornar 401 Unauthorized se um token inválido for enviado', async () => {
        await request(app)
          .put('/api/users/profile')
          .set('Authorization', 'Bearer token_invalido_123')
          .send({ name: 'Novo Nome' })
          .expect(401);
      });

    it('deve retornar 200 OK e atualizar o perfil se dados válidos e token válido forem enviados', async () => {
      const novoNome = 'Nome Atualizado';
      const novoEmail = 'user_atualizado@test.com';

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${global.testUserToken}`) // Token do utilizador normal
        .send({ name: novoNome, email: novoEmail }) // Envia os novos dados
        .expect('Content-Type', /json/)
        .expect(200);

      // Verifica a resposta da API
      expect(response.body).toHaveProperty('_id', global.testUser._id.toString());
      expect(response.body).toHaveProperty('name', novoNome); // Verifica o nome atualizado
      expect(response.body).toHaveProperty('email', novoEmail); // Verifica o email atualizado
      expect(response.body).toHaveProperty('token'); // Verifica se um novo token foi retornado

      // (Opcional mas recomendado) Verifica diretamente na base de dados
      const userAtualizadoDB = await User.findById(global.testUser._id);
      expect(userAtualizadoDB.name).toBe(novoNome);
      expect(userAtualizadoDB.email).toBe(novoEmail);
    });

    it('deve retornar 400 Bad Request se tentar atualizar com email já existente', async () => {
        // Tenta atualizar o utilizador normal com o email do admin (que já existe)
        await request(app)
          .put('/api/users/profile')
          .set('Authorization', `Bearer ${global.testUserToken}`) // Token do utilizador normal
          .send({ email: global.adminUser.email }) // Email duplicado
          .expect('Content-Type', /json/)
          .expect(400); // Espera Bad Request (erro de validação)
      });

    // Adicionar teste para atualização de senha (se desejar)
    // it('deve retornar 200 OK e atualizar a senha', async () => { ... });

  });
  // --- FIM DO NOVO BLOCO ---

  // --- Próximos Testes ---
  // DELETE /api/users/:id (deletar utilizador - usar adminToken)
  // GET /api/users/:id (obter utilizador por id - usar adminToken)
  // PUT /api/users/:id (atualizar utilizador - usar adminToken)
});