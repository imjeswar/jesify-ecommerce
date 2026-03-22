import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import productRoutes from './routes/productRoutes';
import authRoutes from './routes/authRoutes';
import orderRoutes from './routes/orderRoutes';
import { initSocket } from './socket';

dotenv.config();

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize Socket.io
initSocket(server);

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('Jesify API is running');
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
