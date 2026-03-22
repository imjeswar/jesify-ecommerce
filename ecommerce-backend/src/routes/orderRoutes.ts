import express from 'express';
import { createOrder, getOrders, updateOrderStatus } from '../controllers/orderController';
// In a real app, you'd add auth middleware here
// import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .post(createOrder)
  .get(getOrders);

router.route('/:id/status')
  .put(updateOrderStatus);

export default router;
