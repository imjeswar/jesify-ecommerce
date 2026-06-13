import { Request, Response } from 'express';
import { User } from '../models/User';

// @desc    Get user cart
// @route   GET /api/cart/:email
// @access  Public (Basic Implementation)
export const getCart = async (req: Request, res: Response) => {
    try {
        const { email } = req.params;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.cart || []);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update user cart
// @route   PUT /api/cart/:email
// @access  Public (Basic Implementation)
export const updateCart = async (req: Request, res: Response) => {
    try {
        const { email } = req.params;
        const { items } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.cart = items || [];
        await user.save();

        res.status(200).json(user.cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
