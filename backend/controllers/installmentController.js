import InstallmentPlan from '../models/InstallmentPlan.js';
import Policy from '../models/Policy.js';

const addMonths = (dateValue, monthsToAdd) => {
  const date = new Date(dateValue);
  date.setMonth(date.getMonth() + monthsToAdd);
  return date;
};

const buildInstallments = ({ totalAmount, installmentCount, firstDueDate }) => {
  const baseAmount = Number((totalAmount / installmentCount).toFixed(2));
  let remaining = Number(totalAmount.toFixed(2));

  return Array.from({ length: installmentCount }, (_, index) => {
    const isLastInstallment = index === installmentCount - 1;
    const amount = isLastInstallment ? Number(remaining.toFixed(2)) : baseAmount;
    remaining -= amount;

    return {
      installmentNumber: index + 1,
      dueDate: addMonths(firstDueDate, index),
      amount,
      status: 'Pending',
      paidAt: null
    };
  });
};

export const getInstallmentPlans = async (_req, res) => {
  try {
    const plans = await InstallmentPlan.find()
      .populate('policy', 'policyNumber customerName policyType premiumAmount status')
      .sort({ createdAt: -1 });

    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch installment plans', error: error.message });
  }
};

export const createInstallmentPlan = async (req, res) => {
  try {
    const { policy: policyId, totalAmount, installmentCount, firstDueDate, paymentMethod } = req.body;

    const policy = await Policy.findById(policyId);
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    const installments = buildInstallments({
      totalAmount: Number(totalAmount),
      installmentCount: Number(installmentCount),
      firstDueDate
    });

    const plan = await InstallmentPlan.create({
      policy: policyId,
      totalAmount,
      installmentCount,
      firstDueDate,
      paymentMethod,
      installments
    });

    const populatedPlan = await plan.populate('policy', 'policyNumber customerName policyType premiumAmount status');

    return res.status(201).json(populatedPlan);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to create installment plan', error: error.message });
  }
};

export const markInstallmentPaid = async (req, res) => {
  try {
    const { id, installmentNumber } = req.params;
    const plan = await InstallmentPlan.findById(id).populate(
      'policy',
      'policyNumber customerName policyType premiumAmount status'
    );

    if (!plan) {
      return res.status(404).json({ message: 'Installment plan not found' });
    }

    const installment = plan.installments.find(
      (item) => item.installmentNumber === Number(installmentNumber)
    );

    if (!installment) {
      return res.status(404).json({ message: 'Installment not found' });
    }

    installment.status = 'Paid';
    installment.paidAt = new Date();
    await plan.save();

    return res.json(plan);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to update installment payment', error: error.message });
  }
};
