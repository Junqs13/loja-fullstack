// models/userModel.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const shippingAddressSchema = mongoose.Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
});

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    shippingAddress: shippingAddressSchema,
  },
  {
    timestamps: true,
  }
);

// Método para comparar a senha digitada com a senha no banco de dados
userSchema.methods.matchPassword = async function (enteredPassword) {
  // --- CORREÇÃO AQUI ---
  // Se enteredPassword for null, undefined, ou string vazia, retorna false imediatamente
  if (!enteredPassword) {
    return false;
  }
  // --------------------
  // Só chama bcrypt.compare se enteredPassword for uma string não vazia
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware que roda ANTES de salvar o usuário no banco
userSchema.pre('save', async function (next) {
  // Se a senha não foi modificada, apenas continua
  if (!this.isModified('password')) {
    next();
  }

  // Gera o "salt" e criptografa a senha
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;