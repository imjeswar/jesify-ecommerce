import express from 'express';
import { getAllUsers, getAllSellers, updateSellerStatus, toggleUserBlock } from '../controllers/adminController';

const router = express.Router();

router.get('/users', getAllUsers);
router.get('/sellers', getAllSellers);
router.put('/sellers/:id/status', updateSellerStatus);
router.put('/users/:id/block', toggleUserBlock);

export default router;
