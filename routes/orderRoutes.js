// routes/orderRoutes.js
import express from 'express';
const router = express.Router();
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
  getSalesSummary,
  exportOrders,
  getPendingOrders // <-- 1. IMPORTADO
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/')
    .post(protect, addOrderItems)
    .get(protect, admin, getOrders);

// --- Rotas Específicas ---
router.route('/myorders').get(protect, getMyOrders);
router.route('/summary').get(protect, admin, getSalesSummary);
router.route('/export').get(protect, admin, exportOrders); 

// --- 2. NOVA ROTA DE PEDIDOS PENDENTES ---
router.route('/pending').get(protect, admin, getPendingOrders); // <-- ADICIONADO

// --- Rotas com parâmetros (devem vir por último) ---
router.route('/:id')
    .get(protect, getOrderById);

router.route('/:id/pay')
    .put(protect, updateOrderToPaid);

router.route('/:id/deliver')
    .put(protect, admin, updateOrderToDelivered);

export default router;