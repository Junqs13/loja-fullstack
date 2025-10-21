// frontend/src/reducers/productReducers.test.js

import { productListReducer } from './productReducers';
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
} from '../constants/productConstants';

// Descreve o conjunto de testes para o productListReducer
describe('productListReducer', () => {
  
  // Teste 1: Deve retornar o estado inicial
  it('should return the initial state', () => {
    // Ação: chama o reducer sem nenhum estado ou ação
    // Expectativa: o resultado deve ser o estado inicial definido no reducer
    expect(productListReducer(undefined, {})).toEqual({ products: [] });
  });

  // Teste 2: Deve lidar com a ação PRODUCT_LIST_REQUEST
  it('should handle PRODUCT_LIST_REQUEST', () => {
    // Ação: chama o reducer com uma ação de 'request'
    const action = { type: PRODUCT_LIST_REQUEST };
    // Expectativa: o estado deve indicar que o carregamento começou
    expect(productListReducer({ products: [] }, action)).toEqual({
      loading: true,
      products: [],
    });
  });

  // Teste 3: Deve lidar com a ação PRODUCT_LIST_SUCCESS
  it('should handle PRODUCT_LIST_SUCCESS', () => {
    // Ação: chama o reducer com uma ação de 'success' e dados de exemplo
    const mockProducts = [{ id: 1, name: 'Produto Teste' }];
    const action = { type: PRODUCT_LIST_SUCCESS, payload: mockProducts };
    // Expectativa: o carregamento deve terminar e a lista de produtos deve ser preenchida
    expect(productListReducer({ loading: true, products: [] }, action)).toEqual({
      loading: false,
      products: mockProducts,
    });
  });

  // Teste 4: Deve lidar com a ação PRODUCT_LIST_FAIL
  it('should handle PRODUCT_LIST_FAIL', () => {
    // Ação: chama o reducer com uma ação de 'fail' e uma mensagem de erro
    const mockError = 'Não foi possível carregar os produtos';
    const action = { type: PRODUCT_LIST_FAIL, payload: mockError };
    // Expectativa: o carregamento deve terminar e o campo de erro deve ser preenchido
    expect(productListReducer({ loading: true, products: [] }, action)).toEqual({
      loading: false,
      error: mockError,
    });
  });

});