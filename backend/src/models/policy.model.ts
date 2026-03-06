import mongoose from 'mongoose';

const policySchema = new mongoose.Schema(
  {
    policyNumber: { type: String, required: true, unique: true, trim: true },
    customerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    policyType: { type: String, required: true, enum: ['Health', 'Life', 'Vehicle', 'Home', 'Travel', 'Business'] },
    coverageAmount: { type: Number, required: true, min: 0 },
    premiumAmount: { type: Number, required: true, min: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['Active', 'Pending', 'Expired', 'Cancelled'], default: 'Pending' },
    notes: { type: String, trim: true, default: '' }
  },
  { timestamps: true }
);

export const PolicyModel = mongoose.model('Policy', policySchema);
