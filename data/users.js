// data/users.js
import bcrypt from 'bcryptjs';
const users = [
  {
    name: 'Admin User',
    email: 'admin@email.com',
    password: bcrypt.hashSync('123', 10), // Senha já criptografada
    isAdmin: true,
  },
];
export default users;