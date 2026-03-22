import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { getIO } from '../socket';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { items, totalAmount, shippingAddress, paymentMethod } = req.body;
    
    // In a real app, you'd get user ID from auth middleware
    const userId = (req as any).user?._id || '60d5ec286475653a20857437'; // Dummy ID for now

    const newOrder = new Order({
      user: userId,
      products: items.map((item: any) => ({
        product: item.productId,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount,
      shippingAddress,
      status: 'pending',
      paymentMethod: paymentMethod === 'DUMMY' ? 'dummy' : 'cod',
      paymentStatus: paymentMethod === 'DUMMY' ? 'completed' : 'pending'
    });

    const savedOrder = await newOrder.save();

    // Emit realtime event to admin/seller
    const io = getIO();
    io.emit('newOrder', savedOrder);

    res.status(201).json(savedOrder);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().populate('user', 'name email');
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Emit realtime event to the user
    const io = getIO();
    io.to(order.user.toString()).emit('orderUpdate', order);

    res.json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
