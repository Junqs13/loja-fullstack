// frontend/src/constants/apiConstants.js

// Em desenvolvimento, usamos uma string vazia (que usará o 'proxy' do package.json)
// Em produção, usamos a URL completa do seu backend no Render
export const BASE_URL = 
    process.env.NODE_ENV === 'production' 
    ? 'https://minha-loja-api-w3dd.onrender.com/' 
    : '';

// URLs que a API espera
export const PRODUCTS_URL = '/api/products';
export const USERS_URL = '/api/users';
export const ORDERS_URL = '/api/orders';
export const PAYPAL_URL = '/api/config/paypal';