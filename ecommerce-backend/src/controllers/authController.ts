
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Seller } from '../models/Seller';

const generateToken = (id: string, role: string) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'user',
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id, user.role),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Check if seller profile exists if role is seller
            let sellerProfile = null;
            if (user.role === 'seller') {
                sellerProfile = await Seller.findOne({ user: user._id });
            }

            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                sellerProfile, // Include seller profile if exists
                token: generateToken(user.id, user.role),
            });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response) => {
    try {
        // Basic implementation since we don't have auth middleware yet
        // In a real scenario, req.user would be populated by middleware
        const user = await User.findById((req as any).user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
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

// @desc    Get all sellers (Admin only)
// @route   GET /api/auth/sellers
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
// @route   PUT /api/auth/sellers/:id/status
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
// @desc    Register a seller profile
// @route   POST /api/auth/seller-register
// @access  Private
export const registerSeller = async (req: Request, res: Response) => {
    try {
        const { userId, storeName, description, aadhaarNumber, address } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const seller = await Seller.create({
            user: userId,
            storeName,
            description,
            aadhaarNumber,
            address,
            status: 'PENDING'
        });

        // Update user role to seller
        user.role = 'seller';
        await user.save();

        res.status(201).json(seller);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
