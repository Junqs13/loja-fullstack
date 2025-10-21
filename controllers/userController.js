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

    // --- 1. LÓGICA DE PROMOÇÃO DO PRIMEIRO ADMIN ---
    // Verifica se já existe algum documento de utilizador na base de dados
    const isFirstUser = (await User.countDocuments({})) === 0;
    // -----------------------------------------------

    const user = await User.create({
      name,
      email,
      password, // A senha será criptografada pelo middleware no model
      isAdmin: isFirstUser, // <-- 2. Define isAdmin=true SE for o primeiro
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin, // <-- 3. Retorna o status de admin correto
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

// @desc    Autenticar usuário
// @route   POST /api/users/login
// @access  Público
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

// @desc    Buscar perfil do usuário
// @route   GET /api/users/profile
// @access  Privado
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if(user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                shippingAddress: user.shippingAddress,
            });
        } else {
            res.status(404).json({ message: 'Usuário não encontrado'});
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

// @desc    Atualizar perfil do usuário
// @route   PUT /api/users/profile
// @access  Privado
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if(user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            if(req.body.password) {
                user.password = req.body.password;
            }

            if (req.body.shippingAddress) {
                if (!user.shippingAddress) {
                    user.shippingAddress = {};
                }
                user.shippingAddress.address = req.body.shippingAddress.address || user.shippingAddress.address;
                user.shippingAddress.city = req.body.shippingAddress.city || user.shippingAddress.city;
                user.shippingAddress.postalCode = req.body.shippingAddress.postalCode || user.shippingAddress.postalCode;
                user.shippingAddress.country = req.body.shippingAddress.country || user.shippingAddress.country;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                shippingAddress: updatedUser.shippingAddress, 
                token: generateToken(updatedUser._id),
            });

        } else {
            res.status(404).json({ message: 'Usuário não encontrado'});
        }
    } catch (error) {
        res.status(400).json({ message: 'Erro ao atualizar usuário' });
    }
};

// @desc    Buscar todos os usuários (admin)
// @route   GET /api/users
// @access  Privado/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Erro no servidor" });
    }
};

// @desc    Deletar usuário (admin)
// @route   DELETE /api/users/:id
// @access  Privado/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await user.deleteOne();
            res.json({ message: 'Usuário removido com sucesso' });
        } else {
            res.status(4404).json({ message: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

// @desc    Buscar usuário por ID (admin)
// @route   GET /api/users/:id
// @access  Privado/Admin
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if(user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

// @desc    Atualizar usuário (admin)
// @route   PUT /api/users/:id
// @access  Privado/Admin
const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.isAdmin = req.body.isAdmin === undefined ? user.isAdmin : req.body.isAdmin;

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
            });
        } else {
            res.status(404).json({ message: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Erro ao atualizar usuário' });
    }
};
export { registerUser, authUser, getUserProfile, updateUserProfile, getUsers, deleteUser, getUserById, updateUser  };