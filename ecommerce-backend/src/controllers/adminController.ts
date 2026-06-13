import { Request, Response } from 'express';
import { User } from '../models/User';
import { Seller } from '../models/Seller';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find({}).select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all sellers
// @route   GET /api/admin/sellers
// @access  Private/Admin
export const getAllSellers = async (req: Request, res: Response) => {
    try {
        const sellers = await Seller.find({}).populate('user', 'name email');
        res.status(200).json(sellers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update seller status
// @route   PUT /api/admin/sellers/:id/status
// @access  Private/Admin
export const updateSellerStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const seller = await Seller.findById(req.params.id);

        if (seller) {
            seller.status = status;
            if (status === 'APPROVED') seller.isVerified = true;
            const updatedSeller = await seller.save();
            res.json(updatedSeller);
        } else {
            res.status(404).json({ message: 'Seller not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Toggle user block status
// @route   PUT /api/admin/users/:id/block
// @access  Private/Admin
export const toggleUserBlock = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.status = user.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
        await user.save();
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
