// frontend/src/reducers/productReducers.test.js

import { productListReducer } from './productReducers';
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
} from '../constants/productConstants';

// Define o estado inicial esperado (igual ao do reducer)
const initialState = {
    products: [],
    loading: false,
    error: null,
    page: 1,
    pages: 1,
};

describe('productListReducer', () => {

  it('deve retornar o estado inicial', () => {
    // Ação: chama o reducer sem estado ou ação
    // Expectativa: retorna o estado inicial definido
    expect(productListReducer(undefined, {})).toEqual(initialState);
  });

  it('deve lidar com a ação PRODUCT_LIST_REQUEST', () => {
    // Ação: envia a ação de request
    const action = { type: PRODUCT_LIST_REQUEST };
    // Expectativa: loading fica true, products fica array vazio, page/pages mantêm-se (ou voltam ao inicial se não existirem antes)
    expect(productListReducer(initialState, action)).toEqual({
      ...initialState, // Começa com o estado inicial
      loading: true,
      products: [], // Limpa produtos durante o carregamento
    });
  });

  it('deve lidar com a ação PRODUCT_LIST_SUCCESS', () => {
    // --- CORREÇÃO AQUI ---
    // Simula o payload que a API envia (objeto com products, page, pages)
    const mockPayload = {
        products: [{ _id: 1, name: 'Produto Teste' }],
        page: 1,
        pages: 1
    };
    const action = { type: PRODUCT_LIST_SUCCESS, payload: mockPayload };
    // Estado antes da ação (simulando que estava a carregar)
    const previousState = { ...initialState, loading: true, products: [] };

    // Expectativa: loading fica false, e products, page, pages são extraídos do payload
    expect(productListReducer(previousState, action)).toEqual({
      loading: false,
      products: mockPayload.products, // Espera que o array de produtos seja extraído
      page: mockPayload.page,         // Espera que a página seja extraída
      pages: mockPayload.pages,       // Espera que o total de páginas seja extraído
      error: null
    });
    // --------------------
  });

  it('deve lidar com a ação PRODUCT_LIST_FAIL', () => {
    // Ação: envia a ação de falha
    const mockError = 'Não foi possível carregar os produtos';
    const action = { type: PRODUCT_LIST_FAIL, payload: mockError };
    // Estado antes da ação
    const previousState = { ...initialState, loading: true, products: [] };

    // Expectativa: loading fica false, error é preenchido, products continua vazio, page/pages mantêm-se
    expect(productListReducer(previousState, action)).toEqual({
      ...initialState, // Mantém page/pages do estado anterior (ou inicial)
      loading: false,
      error: mockError,
      products: [],
    });
  });

});