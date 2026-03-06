import { AppError } from '../utils/app-error.js';
import type { InstallmentInput, PolicyInput } from '../types/policy.types.js';

const isValidDate = (value: unknown): boolean => typeof value === 'string' && !Number.isNaN(new Date(value).getTime());

export const validateCreatePolicy = (payload: any): PolicyInput => {
  const requiredFields = ['policyNumber', 'customerName', 'email', 'phone', 'policyType', 'coverageAmount', 'premiumAmount', 'startDate', 'endDate'];
  for (const field of requiredFields) {
    if (payload[field] === undefined || payload[field] === '') throw new AppError(`Validation failed: ${field} is required`, 400);
  }

  if (!String(payload.email).includes('@')) throw new AppError('Validation failed: invalid email', 400);
  if (!isValidDate(payload.startDate) || !isValidDate(payload.endDate)) throw new AppError('Validation failed: invalid policy dates', 400);

  const parsed = {
    ...payload,
    coverageAmount: Number(payload.coverageAmount),
    premiumAmount: Number(payload.premiumAmount)
  } as PolicyInput;

  if (parsed.coverageAmount < 0 || parsed.premiumAmount < 0) throw new AppError('Validation failed: amounts must be >= 0', 400);
  return parsed;
};

export const validateUpdatePolicy = (payload: any): Partial<PolicyInput> => {
  const parsed = { ...payload };
  if (parsed.coverageAmount !== undefined) parsed.coverageAmount = Number(parsed.coverageAmount);
  if (parsed.premiumAmount !== undefined) parsed.premiumAmount = Number(parsed.premiumAmount);
  if ((parsed.coverageAmount !== undefined && parsed.coverageAmount < 0) || (parsed.premiumAmount !== undefined && parsed.premiumAmount < 0)) {
    throw new AppError('Validation failed: amounts must be >= 0', 400);
  }
  if (parsed.startDate !== undefined && !isValidDate(parsed.startDate)) throw new AppError('Validation failed: invalid startDate', 400);
  if (parsed.endDate !== undefined && !isValidDate(parsed.endDate)) throw new AppError('Validation failed: invalid endDate', 400);
  return parsed;
};

export const validateCreateInstallmentPlan = (payload: any): InstallmentInput => {
  const required = ['policy', 'totalAmount', 'installmentCount', 'firstDueDate'];
  for (const field of required) {
    if (payload[field] === undefined || payload[field] === '') throw new AppError(`Validation failed: ${field} is required`, 400);
  }

  const parsed: InstallmentInput = {
    policy: String(payload.policy),
    totalAmount: Number(payload.totalAmount),
    installmentCount: Number(payload.installmentCount),
    firstDueDate: String(payload.firstDueDate),
    paymentMethod: payload.paymentMethod
  };

  if (parsed.totalAmount <= 0 || parsed.installmentCount < 1 || parsed.installmentCount > 24) {
    throw new AppError('Validation failed: invalid installment payload', 400);
  }
  if (!isValidDate(parsed.firstDueDate)) throw new AppError('Validation failed: invalid firstDueDate', 400);

  return parsed;
};

export const validateMarkInstallmentPaid = (payload: any): { id: string; installmentNumber: number } => {
  const id = String(payload.id ?? '');
  const installmentNumber = Number(payload.installmentNumber);
  if (!id || !Number.isInteger(installmentNumber) || installmentNumber < 1) {
    throw new AppError('Validation failed: invalid installment route params', 400);
  }
  return { id, installmentNumber };
};
