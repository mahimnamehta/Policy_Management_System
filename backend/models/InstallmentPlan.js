import mongoose from 'mongoose';

const installmentSchema = new mongoose.Schema(
  {
    installmentNumber: {
      type: Number,
      required: true
    },
    dueDate: {
      type: Date,
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Overdue'],
      default: 'Pending'
    },
    paidAt: {
      type: Date,
      default: null
    }
  },
  {
    _id: false
  }
);

const installmentPlanSchema = new mongoose.Schema(
  {
    policy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Policy',
      required: true
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    installmentCount: {
      type: Number,
      required: true,
      min: 1
    },
    firstDueDate: {
      type: Date,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ['Card', 'Bank Transfer', 'Cash', 'UPI'],
      default: 'Card'
    },
    installments: {
      type: [installmentSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('InstallmentPlan', installmentPlanSchema);
