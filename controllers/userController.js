// controllers/userController.js
import User from '../models/userModel.js';
// --- 1. IMPORTAR A FUNÇÃO MOVIDA ---
import generateToken from '../utils/generateToken.js';

// --- A FUNÇÃO generateToken FOI REMOVIDA DAQUI ---

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

    // Nota: A lógica isFirstUser ainda está aqui. Lembre-se de revertê-la depois.
    const isFirstUser = (await User.countDocuments({})) === 0;

    const user = await User.create({
      name,
      email,
      password,
      isAdmin: isFirstUser, // Remove/reverte esta linha no commit final de segurança
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        // Usa a função importada
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

    // Usa a função importada
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
        // O middleware 'protect' já adiciona req.user
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
            // Este caso é raro se o token for válido, mas é bom ter
            res.status(404).json({ message: 'Usuário não encontrado'});
        }
    } catch (error) {
        // Captura outros erros, ex: falha na busca ao DB
        console.error(`Erro ao buscar perfil: ${error.message}`);
        res.status(500).json({ message: 'Erro no servidor ao buscar perfil' });
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
                // A senha será hasheada pelo hook pre-save no model
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

            // Usa a função importada
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                shippingAddress: updatedUser.shippingAddress,
                token: generateToken(updatedUser._id), // Re-gera token com dados atualizados
            });

        } else {
            res.status(404).json({ message: 'Usuário não encontrado'});
        }
    } catch (error) {
        console.error(`Erro ao atualizar perfil: ${error.message}`);
        // Verifica se é erro de validação (ex: email duplicado)
        if (error.code === 11000 || error.name === 'ValidationError') {
             res.status(400).json({ message: 'Erro de validação', details: error.message });
        } else {
             res.status(500).json({ message: 'Erro no servidor ao atualizar perfil' });
        }
    }
};

// @desc    Buscar todos os usuários (admin)
// @route   GET /api/users
// @access  Privado/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        console.error(`Erro ao buscar usuários: ${error.message}`);
        res.status(500).json({ message: "Erro no servidor ao buscar usuários" });
    }
};

// @desc    Deletar usuário (admin)
// @route   DELETE /api/users/:id
// @access  Privado/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            // Adicionar verificação para não permitir admin deletar a si mesmo? (Opcional)
            // if (user._id.toString() === req.user._id.toString()) {
            //     res.status(400);
            //     throw new Error('Admin não pode deletar a si mesmo');
            // }
            await user.deleteOne();
            res.json({ message: 'Usuário removido com sucesso' });
        } else {
            res.status(404).json({ message: 'Usuário não encontrado' }); // Corrigido status 404
        }
    } catch (error) {
        console.error(`Erro ao deletar usuário: ${error.message}`);
         if (error.kind === 'ObjectId') {
             res.status(404).json({ message: 'ID de usuário inválido' });
         } else {
             res.status(res.statusCode || 500).json({ message: error.message || 'Erro no servidor ao deletar usuário' });
         }
    }
};

// @desc    Buscar usuário por ID (admin)
// @route   GET /api/users/:id
// @access  Privado/Admin
const getUserById = async (req, res) => {
    try {
        // Exclui a senha do retorno
        const user = await User.findById(req.params.id).select('-password');
        if(user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'Usuário não encontrado' });
        }
    } catch (error) {
        console.error(`Erro ao buscar usuário por ID: ${error.message}`);
        if (error.kind === 'ObjectId') {
             res.status(404).json({ message: 'ID de usuário inválido' });
         } else {
            res.status(500).json({ message: 'Erro no servidor ao buscar usuário por ID' });
         }
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
            // Atualiza isAdmin apenas se explicitamente passado no body
            user.isAdmin = req.body.isAdmin === undefined ? user.isAdmin : req.body.isAdmin;
            // Não permite atualizar a senha por esta rota (segurança)

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin, // Retorna o isAdmin atualizado
            });
        } else {
            res.status(404).json({ message: 'Usuário não encontrado' });
        }
    } catch (error) {
        console.error(`Erro ao atualizar usuário (admin): ${error.message}`);
        if (error.code === 11000 || error.name === 'ValidationError') {
             res.status(400).json({ message: 'Erro de validação', details: error.message });
        } else if (error.kind === 'ObjectId') {
             res.status(404).json({ message: 'ID de usuário inválido' });
        } else {
             res.status(500).json({ message: 'Erro no servidor ao atualizar usuário' });
        }
    }
};
// Garante que todas as funções estão exportadas
export { registerUser, authUser, getUserProfile, updateUserProfile, getUsers, deleteUser, getUserById, updateUser  };