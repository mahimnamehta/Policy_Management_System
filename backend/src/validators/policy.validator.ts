import { z } from 'zod';

const installmentSchema = z.object({
  dueDate: z.string().datetime(),
  amount: z.number().min(0),
  status: z.enum(['PAID', 'PENDING']).optional(),
  paidAt: z.string().datetime().nullable().optional()
});

export const createPolicySchema = z.object({
  policyNumber: z.string().min(1),
  customerName: z.string().min(1),
  policyType: z.string().min(1),
  premiumAmount: z.number().min(0),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  installments: z.array(installmentSchema).optional()
});

export const updatePolicySchema = createPolicySchema.partial();

export const addInstallmentSchema = installmentSchema.pick({
  dueDate: true,
  amount: true
});
