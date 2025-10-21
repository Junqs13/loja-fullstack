// frontend/src/components/Message.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import Message from './Message';

// Descreve o conjunto de testes para o componente Message
describe('Message Component', () => {

  // Teste 1: Deve renderizar o texto passado como filho
  it('should render children text correctly', () => {
    const testMessage = 'Esta é uma mensagem de teste';

    // Renderiza o componente com uma mensagem de exemplo
    render(<Message>{testMessage}</Message>);

    // Procura por um elemento no ecrã que contenha o texto da nossa mensagem
    const messageElement = screen.getByText(testMessage);

    // Expectativa: o elemento com a mensagem deve estar no documento (visível)
    expect(messageElement).toBeInTheDocument();
  });

  // Teste 2: Deve aplicar a classe de variante correta
  it('should have the correct variant class', () => {
    const testMessage = 'Mensagem de perigo';
    const variant = 'danger';

    // Renderiza o componente com a variante 'danger'
    render(<Message variant={variant}>{testMessage}</Message>);

    // Procura pelo elemento que contém a mensagem
    const messageElement = screen.getByText(testMessage);

    // Expectativa: o elemento deve ter a classe CSS 'alert-danger' que o Bootstrap aplica
    expect(messageElement).toHaveClass(`alert-${variant}`);
  });
  
});