import mongoose from 'mongoose';
import { InstallmentPlanModel } from '../models/installment-plan.model.js';
import { PolicyModel } from '../models/policy.model.js';
import type { InstallmentInput, PolicyInput } from '../types/policy.types.js';
import { AppError } from '../utils/app-error.js';

const ensureObjectId = (value: string, message: string): void => {
  if (!mongoose.isValidObjectId(value)) throw new AppError(message, 400);
};

const addMonths = (dateValue: string | Date, monthsToAdd: number): Date => {
  const date = new Date(dateValue);
  date.setMonth(date.getMonth() + monthsToAdd);
  return date;
};

const buildInstallments = ({ totalAmount, installmentCount, firstDueDate }: InstallmentInput) => {
  const baseAmount = Number((totalAmount / installmentCount).toFixed(2));
  let remaining = Number(totalAmount.toFixed(2));
  return Array.from({ length: installmentCount }, (_, index) => {
    const isLast = index === installmentCount - 1;
    const amount = isLast ? Number(remaining.toFixed(2)) : baseAmount;
    remaining -= amount;
    return { installmentNumber: index + 1, dueDate: addMonths(firstDueDate, index), amount, status: 'Pending', paidAt: null };
  });
};

export const getPolicies = async () => PolicyModel.find().sort({ createdAt: -1 });
export const createPolicy = async (payload: PolicyInput) => PolicyModel.create(payload);

export const updatePolicy = async (id: string, payload: Partial<PolicyInput>) => {
  ensureObjectId(id, 'Invalid policy id');
  const policy = await PolicyModel.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!policy) throw new AppError('Policy not found', 404);
  return policy;
};

export const deletePolicy = async (id: string): Promise<void> => {
  ensureObjectId(id, 'Invalid policy id');
  const policy = await PolicyModel.findByIdAndDelete(id);
  if (!policy) throw new AppError('Policy not found', 404);
  await InstallmentPlanModel.deleteMany({ policy: id });
};

export const getInstallmentPlans = async () =>
  InstallmentPlanModel.find().populate('policy', 'policyNumber customerName policyType premiumAmount status').sort({ createdAt: -1 });

export const createInstallmentPlan = async (payload: InstallmentInput) => {
  ensureObjectId(payload.policy, 'Invalid policy id');
  const policy = await PolicyModel.findById(payload.policy);
  if (!policy) throw new AppError('Policy not found', 404);

  const plan = await InstallmentPlanModel.create({ ...payload, installments: buildInstallments(payload) });
  return plan.populate('policy', 'policyNumber customerName policyType premiumAmount status');
};

export const markInstallmentPaid = async (
  id: string,
  installmentNumber: number
) => {
  ensureObjectId(id, "Invalid installment plan id");

  const plan = await InstallmentPlanModel.findById(id).populate(
    "policy",
    "policyNumber customerName policyType premiumAmount status"
  );

  if (!plan) {
    throw new AppError("Installment plan not found", 404);
  }

  // find the real subdocument
  const installment = plan.installments.find(
    (item: any) => item.installmentNumber === installmentNumber
  );
  if (!installment) {
    throw new AppError("Installment not found", 404);
  }
  // update directly on mongoose document
  installment.status = "Paid";
  installment.paidAt = new Date();
  await plan.save();
  return plan;
};
