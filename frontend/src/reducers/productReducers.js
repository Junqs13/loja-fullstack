// frontend/src/reducers/productReducers.js

import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_CREATE_RESET,
  // Adicionar constantes que faltavam (eram strings literais)
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_UPDATE_RESET,
  PRODUCT_TOP_REQUEST,
  PRODUCT_TOP_SUCCESS,
  PRODUCT_TOP_FAIL,
  PRODUCT_CREATE_REVIEW_REQUEST,
  PRODUCT_CREATE_REVIEW_SUCCESS,
  PRODUCT_CREATE_REVIEW_FAIL,
  PRODUCT_CREATE_REVIEW_RESET,
} from '../constants/productConstants.js'; // Assumindo que todas constantes estão aqui

// Estado inicial agora inclui page e pages
const initialProductListState = {
    products: [],
    loading: false,
    error: null,
    page: 1,
    pages: 1,
};

export const productListReducer = (state = initialProductListState, action) => {
  switch (action.type) {
    case PRODUCT_LIST_REQUEST:
      // Mantém 'pages' do estado anterior para evitar piscar na UI durante o loading
      return { ...state, loading: true, products: [] };
    case PRODUCT_LIST_SUCCESS:
      // --- CORREÇÃO AQUI ---
      // Extrai as propriedades do payload (que é o objeto da API)
      return {
        loading: false,
        products: action.payload.products, // Guarda apenas o array de produtos
        pages: action.payload.pages,       // Guarda o total de páginas
        page: action.payload.page,         // Guarda a página atual
        error: null // Limpa erros anteriores
      };
      // --------------------
    case PRODUCT_LIST_FAIL:
      // Mantém 'pages' do estado anterior em caso de erro
      return { ...state, loading: false, error: action.payload, products: [] };
    default:
      return state;
  }
};

// Estado inicial para productDetails (garante que product é objeto)
const initialProductDetailsState = {
    product: { reviews: [] }, // Inicializa reviews como array
    loading: false,
    error: null,
};

export const productDetailsReducer = (state = initialProductDetailsState, action) => {
  switch (action.type) {
    case PRODUCT_DETAILS_REQUEST:
      // Mantém o produto anterior durante o loading para evitar piscar
      return { ...state, loading: true };
    case PRODUCT_DETAILS_SUCCESS:
      return { loading: false, product: action.payload, error: null };
    case PRODUCT_DETAILS_FAIL:
      return { loading: false, error: action.payload, product: { reviews: [] } }; // Limpa produto em caso de erro
    default:
      return state;
  }
};

export const productDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_DELETE_REQUEST:
      return { loading: true };
    case PRODUCT_DELETE_SUCCESS:
      return { loading: false, success: true };
    case PRODUCT_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const productCreateReducer = (state = {}, action) => {
    switch (action.type) {
      case PRODUCT_CREATE_REQUEST:
        return { loading: true };
      case PRODUCT_CREATE_SUCCESS:
        // Guarda o produto criado no estado
        return { loading: false, success: true, product: action.payload };
      case PRODUCT_CREATE_FAIL:
        return { loading: false, error: action.payload };
      case PRODUCT_CREATE_RESET:
        return {}; // Limpa todo o estado
      default:
        return state;
    }
  };

  // Usando constantes importadas
  export const productUpdateReducer = (state = { product: {} }, action) => {
    switch (action.type) {
        case PRODUCT_UPDATE_REQUEST: return { loading: true };
        case PRODUCT_UPDATE_SUCCESS: return { loading: false, success: true, product: action.payload };
        case PRODUCT_UPDATE_FAIL: return { loading: false, error: action.payload };
        case PRODUCT_UPDATE_RESET: return { product: {} }; // Limpa o produto no reset
        default: return state;
    }
  };

  // Usando constantes importadas
  export const productTopRatedReducer = (state = { products: [] }, action) => {
    switch (action.type) {
        case PRODUCT_TOP_REQUEST: return { loading: true, products: [] };
        case PRODUCT_TOP_SUCCESS: return { loading: false, products: action.payload };
        case PRODUCT_TOP_FAIL: return { loading: false, error: action.payload };
        default: return state;
    }
};

  // Usando constantes importadas
  export const productReviewCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case PRODUCT_CREATE_REVIEW_REQUEST: return { loading: true };
        case PRODUCT_CREATE_REVIEW_SUCCESS: return { loading: false, success: true };
        case PRODUCT_CREATE_REVIEW_FAIL: return { loading: false, error: action.payload };
        case PRODUCT_CREATE_REVIEW_RESET: return {}; // Limpa todo o estado
        default: return state;
    }
};