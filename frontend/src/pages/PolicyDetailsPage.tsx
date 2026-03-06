import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { addInstallment, fetchPolicyById, markInstallmentPaid } from '../api/policyApi';
import { Policy } from '../types/policy';
import { formatCurrency, formatDate } from '../utils/formatters';

export const PolicyDetailsPage = (): JSX.Element => {
  const { id } = useParams();
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [dueDate, setDueDate] = useState('');
  const [amount, setAmount] = useState(0);

  const reload = async (): Promise<void> => {
    if (!id) return;
    const data = await fetchPolicyById(id);
    setPolicy(data);
  };

  useEffect(() => {
    void reload();
  }, [id]);

  const handleInstallmentSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    if (!id) return;
    await addInstallment(id, { dueDate: new Date(dueDate).toISOString(), amount });
    setDueDate('');
    setAmount(0);
    await reload();
  };

  if (!policy) return <p>Loading policy details...</p>;

  return (
    <section>
      <h1>Policy Details</h1>
      <div className="card">
        <p>
          <strong>Policy Number:</strong> {policy.policyNumber}
        </p>
        <p>
          <strong>Customer:</strong> {policy.customerName}
        </p>
        <p>
          <strong>Type:</strong> {policy.policyType}
        </p>
        <p>
          <strong>Premium:</strong> {formatCurrency(policy.premiumAmount)}
        </p>
      </div>

      <h2>Add Installment</h2>
      <form onSubmit={(event) => void handleInstallmentSubmit(event)} className="toolbar">
        <input required type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <input required type="number" min={0} value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        <button type="submit">Add</button>
      </form>

      <h2>Installment History</h2>
      <table>
        <thead>
          <tr>
            <th>Due Date</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Paid At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {policy.installments.map((installment) => (
            <tr key={installment._id}>
              <td>{formatDate(installment.dueDate)}</td>
              <td>{formatCurrency(installment.amount)}</td>
              <td>{installment.status}</td>
              <td>{installment.paidAt ? formatDate(installment.paidAt) : 'N/A'}</td>
              <td>
                {installment.status === 'PENDING' && (
                  <button
                    onClick={async () => {
                      await markInstallmentPaid(installment._id);
                      await reload();
                    }}
                  >
                    Pay
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};
