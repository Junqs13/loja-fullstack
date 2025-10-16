// data/users.js
import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin User',
    email: 'admin@email.com',
    password: bcrypt.hashSync('123', 10),
    isAdmin: true,
  },
  {
    name: 'João Silva',
    email: 'joao@email.com',
    password: bcrypt.hashSync('123', 10),
  },
  {
    name: 'Jane Doe',
    email: 'jane@email.com',
    password: bcrypt.hashSync('123', 10),
  },
];

export default users;