import request from 'supertest';
import app from '../server.js';
// Não precisamos importar connect/disconnect aqui, o setup.js trata disso

describe('API de Produtos - Rotas Públicas', () => {
  it('GET /api/products - deve retornar uma lista de produtos vazia (DB limpa) e paginação', async () => {
    const response = await request(app)
      .get('/api/products')
      .expect('Content-Type', /json/)
      .expect(200);

    // Verifica se 'products' é um array (mesmo que vazio)
    expect(Array.isArray(response.body.products)).toBe(true);
    // Com a DB vazia, o array deve ter tamanho 0
    expect(response.body.products.length).toBe(0); // <-- Verificação Adicional
    // Paginação ainda deve existir
    expect(response.body.page).toBeDefined();
    expect(response.body.pages).toBeDefined();
  });

  it('GET /api/products/top - deve retornar um array vazio (DB limpa)', async () => {
    const response = await request(app)
      .get('/api/products/top')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0); // <-- Verificação Adicional
  });

  it('GET /api/products/:id - deve retornar 404 para um ID inválido (DB limpa)', async () => {
    const invalidProductId = '60d5ecf36c8b4a1f3c8e4d3c'; // Um ObjectId válido mas inexistente
    await request(app)
      .get(`/api/products/${invalidProductId}`)
      .expect('Content-Type', /json/)
      .expect(404);
  });

  // Testes para POST, PUT, DELETE (requerem mais setup para criar dados antes)
});