export type InstallmentStatus = 'PAID' | 'PENDING';

export interface InstallmentInput {
  dueDate: string;
  amount: number;
  status?: InstallmentStatus;
  paidAt?: string | null;
}

export interface PolicyInput {
  policyNumber: string;
  customerName: string;
  policyType: string;
  premiumAmount: number;
  startDate: string;
  endDate: string;
  installments?: InstallmentInput[];
}

export interface PolicyFilter {
  search?: string;
}
