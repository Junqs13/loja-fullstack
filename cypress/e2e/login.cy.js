// cypress/e2e/login.cy.js

describe('Fluxo de Login', () => {
  it('deve permitir que um utilizador faça login e logout com sucesso', () => {
    // 1. Iniciar a aplicação
    cy.visit('http://localhost:3000');

    // 2. Navegar para a página de login
    cy.get('[data-cy="login-link"]').click();

    // 3. Preencher o formulário de login
    cy.get('#email').type('admin@email.com');
    cy.get('#password').type('123');

    // 4. Submeter o formulário
    // ▼▼▼ CORREÇÃO AQUI ▼▼▼
    cy.get('[data-cy="login-submit-button"]').click();

    // 5. Verificar se o login foi bem-sucedido
    cy.contains('Admin User').should('be.visible');

    // 6. Fazer logout
    cy.get('#username').click();
    cy.get('[data-cy="logout-button"]').click();

    // 7. Verificar se o logout foi bem-sucedido
    cy.get('[data-cy="login-link"]').should('be.visible');
  });
});