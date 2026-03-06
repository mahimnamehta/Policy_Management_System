export type PolicyStatus = 'Active' | 'Pending' | 'Expired' | 'Cancelled';
export type InstallmentStatus = 'Pending' | 'Paid' | 'Overdue';

export interface PolicyInput {
  policyNumber: string;
  customerName: string;
  email: string;
  phone: string;
  policyType: 'Health' | 'Life' | 'Vehicle' | 'Home' | 'Travel' | 'Business';
  coverageAmount: number;
  premiumAmount: number;
  startDate: string;
  endDate: string;
  status?: PolicyStatus;
  notes?: string;
}

export interface InstallmentInput {
  policy: string;
  totalAmount: number;
  installmentCount: number;
  firstDueDate: string;
  paymentMethod?: 'Card' | 'Bank Transfer' | 'Cash' | 'UPI';
}
