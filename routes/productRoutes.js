import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  getTopProducts,
  getProductForEdit,
  createProductReview,
  getLowStockProducts // 1. IMPORTAÇÃO ADICIONADA
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

// --- Rotas Específicas (devem vir antes de /:id) ---
router.get('/top', getTopProducts);

// 2. NOVA ROTA DE STOCK ADICIONADA AQUI
router.route('/stock/low').get(protect, admin, getLowStockProducts);

// --- Rotas com Parâmetro (devem vir por último) ---
router.route('/:id')
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);

// Rotas aninhadas com ID
router.route('/:id/edit').get(protect, admin, getProductForEdit);
router.route('/:id/reviews').post(protect, createProductReview);

export default router;