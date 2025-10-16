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
  createProductReview 
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

router.get('/top', getTopProducts);

router.route('/:id')
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);

// NOVA ROTA
router.route('/:id/edit').get(protect, admin, getProductForEdit);

router.route('/:id/reviews').post(protect, createProductReview);

export default router;