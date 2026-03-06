import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import { PolicyModel, PolicyDocument } from '../models/policy.model.js';
import { AppError } from '../utils/app-error.js';
import { InstallmentInput, PolicyFilter, PolicyInput } from '../types/policy.types.js';

const ensureObjectId = (value: string, message: string): void => {
  if (!Types.ObjectId.isValid(value)) {
    throw new AppError(message, StatusCodes.BAD_REQUEST);
  }
};

export const createPolicy = async (payload: PolicyInput): Promise<PolicyDocument> => {
  return PolicyModel.create(payload);
};

export const getPolicies = async ({ search }: PolicyFilter): Promise<PolicyDocument[]> => {
  const query = search
    ? {
        $or: [
          { policyNumber: { $regex: search, $options: 'i' } },
          { customerName: { $regex: search, $options: 'i' } },
          { policyType: { $regex: search, $options: 'i' } }
        ]
      }
    : {};

  return PolicyModel.find(query).sort({ createdAt: -1 });
};

export const getPolicyById = async (id: string): Promise<PolicyDocument> => {
  ensureObjectId(id, 'Invalid policy id');
  const policy = await PolicyModel.findById(id);
  if (!policy) {
    throw new AppError('Policy not found', StatusCodes.NOT_FOUND);
  }
  return policy;
};

export const updatePolicy = async (id: string, payload: Partial<PolicyInput>): Promise<PolicyDocument> => {
  ensureObjectId(id, 'Invalid policy id');
  const updatedPolicy = await PolicyModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true
  });

  if (!updatedPolicy) {
    throw new AppError('Policy not found', StatusCodes.NOT_FOUND);
  }

  return updatedPolicy;
};

export const deletePolicy = async (id: string): Promise<void> => {
  ensureObjectId(id, 'Invalid policy id');
  const deleted = await PolicyModel.findByIdAndDelete(id);
  if (!deleted) {
    throw new AppError('Policy not found', StatusCodes.NOT_FOUND);
  }
};

export const addInstallment = async (id: string, payload: InstallmentInput): Promise<PolicyDocument> => {
  const policy = await getPolicyById(id);
  policy.installments.push({
    dueDate: new Date(payload.dueDate),
    amount: payload.amount,
    status: payload.status ?? 'PENDING',
    paidAt: payload.paidAt ? new Date(payload.paidAt) : null
  } as PolicyDocument['installments'][number]);
  await policy.save();
  return policy;
};

export const markInstallmentPaid = async (installmentId: string): Promise<PolicyDocument> => {
  ensureObjectId(installmentId, 'Invalid installment id');
  const policy = await PolicyModel.findOne({ 'installments._id': installmentId });

  if (!policy) {
    throw new AppError('Installment not found', StatusCodes.NOT_FOUND);
  }

  const installment = policy.installments.id(installmentId);
  if (!installment) {
    throw new AppError('Installment not found', StatusCodes.NOT_FOUND);
  }

  installment.status = 'PAID';
  installment.paidAt = new Date();

  await policy.save();
  return policy;
};

export const getInstallmentsByPolicyId = async (policyId: string) => {
  const policy = await getPolicyById(policyId);
  return policy.installments.sort((a, b) => +new Date(a.dueDate) - +new Date(b.dueDate));
};

export const getDashboardSummary = async () => {
  const policies = await PolicyModel.find();
  const totalPolicies = policies.length;

  let totalCollected = 0;
  let pendingInstallments = 0;
  let pendingAmount = 0;

  policies.forEach((policy) => {
    policy.installments.forEach((installment) => {
      if (installment.status === 'PAID') {
        totalCollected += installment.amount;
      } else {
        pendingInstallments += 1;
        pendingAmount += installment.amount;
      }
    });
  });

  return {
    totalPolicies,
    totalCollected,
    pendingInstallments,
    pendingAmount
  };
};
