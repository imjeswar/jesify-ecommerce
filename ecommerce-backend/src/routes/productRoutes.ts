
import express from 'express';
import { getProducts, getProductById, createProduct } from '../controllers/productController';
// import { protect, seller } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(getProducts).post(createProduct);
router.route('/:id').get(getProductById);

export default router;
