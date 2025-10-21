// frontend/src/screens/HomeScreen.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import HomeScreen from './HomeScreen';

const mockStore = configureStore([thunk]);

describe('HomeScreen Component', () => {
  let store;

  // Função auxiliar para renderizar o componente com um estado Redux específico
  const renderComponent = (initialState) => {
    store = mockStore(initialState);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  };

  it('should render skeletons when loading', () => {
    renderComponent({
      productList: { loading: true, products: [] },
      // Adicionamos o estado que o Carrossel espera
      productTopRated: { products: [] },
    });
    // Procuramos por múltiplos 'esqueletos' de cards
    expect(screen.getAllByTestId('product-card-skeleton')).toHaveLength(8);
  });

  it('should render an error message if an error occurs', () => {
    const errorMessage = 'API falhou';
    renderComponent({
      productList: { loading: false, error: errorMessage },
      productTopRated: { products: [] }, // O Carrossel também precisa de um estado
    });
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should render product list when products are loaded', () => {
    const mockProducts = [
      { _id: '1', name: 'Produto A', image: 'imageA.jpg', price: 10, rating: 4, numReviews: 5 },
      { _id: '2', name: 'Produto B', image: 'imageB.jpg', price: 20, rating: 5, numReviews: 10 },
    ];
    renderComponent({
      productList: { loading: false, products: mockProducts },
      productTopRated: { products: [] }, // Estado para o Carrossel
    });
    expect(screen.getByText('Produto A')).toBeInTheDocument();
    expect(screen.getByText('Produto B')).toBeInTheDocument();
  });
});