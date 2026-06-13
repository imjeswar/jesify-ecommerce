import express from 'express';
import { getCart, updateCart } from '../controllers/cartController';

const router = express.Router();

router.get('/:email', getCart);
router.put('/:email', updateCart);

export default router;
