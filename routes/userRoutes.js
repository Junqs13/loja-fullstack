// routes/userRoutes.js
import express from 'express';
const router = express.Router();
import { registerUser, authUser } from '../controllers/userController.js';

router.route('/').post(registerUser);
router.post('/login', authUser);
export default router;