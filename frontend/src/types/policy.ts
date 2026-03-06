export type InstallmentStatus = 'PAID' | 'PENDING';

export interface Installment {
  _id: string;
  dueDate: string;
  amount: number;
  status: InstallmentStatus;
  paidAt?: string | null;
}

export interface Policy {
  _id: string;
  policyNumber: string;
  customerName: string;
  policyType: string;
  premiumAmount: number;
  startDate: string;
  endDate: string;
  installments: Installment[];
  createdAt: string;
}

export interface DashboardSummary {
  totalPolicies: number;
  totalCollected: number;
  pendingInstallments: number;
  pendingAmount: number;
}

export interface PolicyPayload {
  policyNumber: string;
  customerName: string;
  policyType: string;
  premiumAmount: number;
  startDate: string;
  endDate: string;
}
