import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'seller', 'admin'], default: 'user' },
  status: { type: String, enum: ['ACTIVE', 'BLOCKED'], default: 'ACTIVE' },
  phone: String,
  cart: { type: Array, default: [] },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

export const User = mongoose.model('User', userSchema);
