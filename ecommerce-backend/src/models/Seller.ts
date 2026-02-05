import mongoose from 'mongoose';

const sellerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  storeName: { type: String, required: true },
  description: String,
  aadhaarNumber: { type: String, required: true },
  panNumber: String,
  isVerified: { type: Boolean, default: false },
  address: String,
}, { timestamps: true });

export const Seller = mongoose.model('Seller', sellerSchema);
