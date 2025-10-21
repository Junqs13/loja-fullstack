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
  exportOrders // <-- IMPORTADO
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/')
    .post(protect, addOrderItems)
    .get(protect, admin, getOrders);

// --- Rotas Específicas ---
router.route('/myorders').get(protect, getMyOrders);
router.route('/summary').get(protect, admin, getSalesSummary);

// --- NOVA ROTA DE EXPORTAÇÃO ---
router.route('/export').get(protect, admin, exportOrders); 

// --- Rotas com parâmetros (devem vir por último) ---
router.route('/:id')
    .get(protect, getOrderById);

router.route('/:id/pay')
    .put(protect, updateOrderToPaid);

router.route('/:id/deliver')
    .put(protect, admin, updateOrderToDelivered);


export default router;