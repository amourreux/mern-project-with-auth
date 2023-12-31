import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductMovement,
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';

router.route('/').get(getProducts).post(protect, createProduct);
router
  .route('/:id')
  .get(checkObjectId, getProductById)
  .put(protect, checkObjectId, updateProduct)
  .delete(protect, checkObjectId, deleteProduct);
router
  .route('/:id/movements')
  .post(protect, checkObjectId, createProductMovement);

export default router;
