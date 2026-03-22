
import express from 'express';
import { registerUser, loginUser, getMe, getAllUsers, getAllSellers, updateSellerStatus, registerSeller } from '../controllers/authController';
// Import middleware later
// import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/seller-register', registerSeller);
router.get('/users', getAllUsers);
router.get('/sellers', getAllSellers);
router.put('/sellers/:id/status', updateSellerStatus);
// router.get('/me', protect, getMe);

export default router;
