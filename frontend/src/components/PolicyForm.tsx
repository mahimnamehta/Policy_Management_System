import { FormEvent, useState } from 'react';
import { PolicyPayload } from '../types/policy';

interface PolicyFormProps {
  initialValues?: Partial<PolicyPayload>;
  onSubmit: (payload: PolicyPayload) => Promise<void>;
  submitLabel: string;
}

export const PolicyForm = ({ initialValues, onSubmit, submitLabel }: PolicyFormProps): JSX.Element => {
  const [form, setForm] = useState<PolicyPayload>({
    policyNumber: initialValues?.policyNumber ?? '',
    customerName: initialValues?.customerName ?? '',
    policyType: initialValues?.policyType ?? '',
    premiumAmount: initialValues?.premiumAmount ?? 0,
    startDate: initialValues?.startDate?.slice(0, 10) ?? '',
    endDate: initialValues?.endDate?.slice(0, 10) ?? ''
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    await onSubmit({
      ...form,
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString()
    });
  };

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="form-grid">
      <label>
        Policy Number
        <input required value={form.policyNumber} onChange={(e) => setForm((prev) => ({ ...prev, policyNumber: e.target.value }))} />
      </label>
      <label>
        Customer Name
        <input required value={form.customerName} onChange={(e) => setForm((prev) => ({ ...prev, customerName: e.target.value }))} />
      </label>
      <label>
        Policy Type
        <input required value={form.policyType} onChange={(e) => setForm((prev) => ({ ...prev, policyType: e.target.value }))} />
      </label>
      <label>
        Premium Amount
        <input
          required
          type="number"
          min={0}
          value={form.premiumAmount}
          onChange={(e) => setForm((prev) => ({ ...prev, premiumAmount: Number(e.target.value) }))}
        />
      </label>
      <label>
        Start Date
        <input required type="date" value={form.startDate} onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))} />
      </label>
      <label>
        End Date
        <input required type="date" value={form.endDate} onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))} />
      </label>
      <button type="submit">{submitLabel}</button>
    </form>
  );
};
