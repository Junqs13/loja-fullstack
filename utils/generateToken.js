import jwt from 'jsonwebtoken';

// Função auxiliar para gerar o token
const generateToken = (id) => {
  // Usa process.env.JWT_SECRET em vez de JWT_TOKEN para clareza
  // Certifique-se que JWT_SECRET está no seu .env
  return jwt.sign({ id }, process.env.JWT_TOKEN, {
    expiresIn: '30d',
  });
};

export default generateToken;