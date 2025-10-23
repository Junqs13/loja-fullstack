// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler'; // Boa prática: usar asyncHandler

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Verifica se o header Authorization existe e começa com Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extrai o token (remove 'Bearer ')
      token = req.headers.authorization.split(' ')[1];

      // Verifica o token usando o segredo (use JWT_TOKEN por convenção)
      const decoded = jwt.verify(token, process.env.JWT_TOKEN); // Alterado de JWT_TOKEN

      // Encontra o utilizador pelo ID no token, excluindo a senha
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
         res.status(401);
         throw new Error('Não autorizado, utilizador não encontrado');
      }

      next(); // Passa para o próximo middleware (ou rota)
    } catch (error) {
      console.error('Erro na verificação do token:', error.message); // Log do erro
      res.status(401);
      throw new Error('Não autorizado, token falhou');
    }
  }

  // Se não encontrou token no header
  if (!token) {
    res.status(401);
    throw new Error('Não autorizado, sem token');
  }
});

const admin = (req, res, next) => {
    // Verifica se o utilizador existe (do middleware 'protect') e se é admin
    if (req.user && req.user.isAdmin) {
        next(); // Permite acesso
    } else {
        // --- CORREÇÃO AQUI ---
        res.status(403); // Alterado de 401 para 403 Forbidden
        // --------------------
        throw new Error('Não autorizado como administrador');
    }
};

export { protect, admin };