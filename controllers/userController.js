// controllers/userController.js
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

// Função auxiliar para gerar o token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_TOKEN, {
    expiresIn: '30d',
  });
};

// @desc    Registrar um novo usuário
// @route   POST /api/users
// @access  Público
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400); // Bad Request
      throw new Error('Usuário já existe');
    }

    const user = await User.create({
      name,
      email,
      password, // A senha será criptografada pelo middleware no model
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Dados de usuário inválidos');
    }
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};
const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401); // Unauthorized
      throw new Error('Email ou senha inválidos');
    }
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

export { registerUser, authUser };