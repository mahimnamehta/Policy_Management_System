export type PolicyStatus = 'Pending' | 'Active' | 'Expired' | 'Cancelled';

export interface Policy {
  _id: string;
  policyNumber: string;
  customerName: string;
  email: string;
  phone: string;
  policyType: string;
  coverageAmount: number | string;
  premiumAmount: number | string;
  startDate: string;
  endDate: string;
  status: PolicyStatus;
  notes?: string;
}

export interface PolicyFormData {
  policyNumber: string;
  customerName: string;
  email: string;
  phone: string;
  policyType: string;
  coverageAmount: number | string;
  premiumAmount: number | string;
  startDate: string;
  endDate: string;
  status: PolicyStatus;
  notes: string;
}

export interface Installment {
  installmentNumber: number;
  dueDate: string;
  amount: number | string;
  status: 'Pending' | 'Paid' | 'Overdue';
  paidAt?: string | null;
}

export interface InstallmentPlan {
  _id: string;
  policy: Pick<Policy, '_id' | 'policyNumber' | 'customerName'> | string;
  totalAmount: number | string;
  installmentCount: number;
  firstDueDate: string;
  paymentMethod: string;
  installments: Installment[];
}

export interface InstallmentFormData {
  policy: string;
  totalAmount: number | string;
  installmentCount: number | string;
  firstDueDate: string;
  paymentMethod: string;
}

export interface AlertState {
  type: 'success' | 'danger';
  message: string;
}
