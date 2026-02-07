import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import productRoutes from './routes/productRoutes';

dotenv.config();

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('Jesify API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
