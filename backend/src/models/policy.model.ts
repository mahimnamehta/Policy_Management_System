import { Schema, model, Types } from 'mongoose';

export interface InstallmentDocument {
  _id: Types.ObjectId;
  dueDate: Date;
  amount: number;
  status: 'PAID' | 'PENDING';
  paidAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PolicyDocument {
  _id: Types.ObjectId;
  policyNumber: string;
  customerName: string;
  policyType: string;
  premiumAmount: number;
  startDate: Date;
  endDate: Date;
  installments: InstallmentDocument[];
  createdAt: Date;
  updatedAt: Date;
}

const installmentSchema = new Schema<InstallmentDocument>(
  {
    dueDate: { type: Date, required: true },
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['PAID', 'PENDING'], default: 'PENDING' },
    paidAt: { type: Date, default: null }
  },
  { timestamps: true }
);

const policySchema = new Schema<PolicyDocument>(
  {
    policyNumber: { type: String, required: true, unique: true, trim: true },
    customerName: { type: String, required: true, trim: true },
    policyType: { type: String, required: true, trim: true },
    premiumAmount: { type: Number, required: true, min: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    installments: { type: [installmentSchema], default: [] }
  },
  { timestamps: true }
);

export const PolicyModel = model<PolicyDocument>('Policy', policySchema);
