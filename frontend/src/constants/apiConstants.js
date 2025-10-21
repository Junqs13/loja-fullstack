// frontend/src/constants/apiConstants.js

// Em desenvolvimento, usamos uma string vazia (que usará o 'proxy' do package.json)
// Em produção, usamos a URL completa do seu backend no Render
export const BASE_URL = 
    process.env.NODE_ENV === 'production' 
    ? 'https://minha-loja-api-w3dd.onrender.com' // <-- CORRIGIDO: SEM A BARRA NO FINAL
    : '';

// URLs que a API espera (estes estão corretos com a barra no início)
export const PRODUCTS_URL = '/api/products';
export const USERS_URL = '/api/users';
export const ORDERS_URL = '/api/orders';
export const PAYPAL_URL = '/api/config/paypal';