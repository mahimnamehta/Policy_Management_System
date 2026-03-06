import { useState, type ChangeEvent, type FormEvent } from "react";
import type {
  InstallmentFormData,
  InstallmentPlan,
  Policy,
} from "../types/dashboard";

const emptyInstallmentForm: InstallmentFormData = {
  policy: "",
  totalAmount: "",
  installmentCount: 3,
  firstDueDate: "",
  paymentMethod: "Card",
};

const formatCurrency = (value: number | string): string =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    Number(value || 0),
  );

interface InstallmentManagerProps {
  installmentPlans: InstallmentPlan[];
  loading: boolean;
  policies: Policy[];
  onCreate: (payload: InstallmentFormData) => Promise<void>;
  onMarkPaid: (planId: string, installmentNumber: number) => Promise<void>;
}

const InstallmentManager: React.FC<InstallmentManagerProps> = ({
  installmentPlans,
  loading,
  policies,
  onCreate,
  onMarkPaid,
}) => {
  const [formData, setFormData] =
    useState<InstallmentFormData>(emptyInstallmentForm);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]:
        name === "installmentCount"
          ? Number(value)
          : name === "totalAmount"
          ? value
          : value,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await onCreate(formData);
      setFormData(emptyInstallmentForm);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="row g-4">
      <div className="col-12 col-xl-4">
        <section className="card dashboard-card h-100">
          <div className="card-body">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Payment Planner</p>
                <h3>Create installment plan</h3>
                <p className="section-copy">
                  Split premium amounts into scheduled monthly payments.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Policy</label>
                <select
                  className="form-select"
                  name="policy"
                  onChange={handleChange}
                  required
                  value={formData.policy}
                >
                  <option value="">Select policy</option>
                  {policies.map((policy) => (
                    <option key={policy._id} value={policy._id}>
                      {policy.policyNumber} - {policy.customerName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Total Amount</label>
                <input
                  className="form-control"
                  min="0"
                  name="totalAmount"
                  onChange={handleChange}
                  required
                  step="0.01"
                  type="number"
                  value={formData.totalAmount}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Installment Count</label>
                <input
                  className="form-control"
                  max="24"
                  min="1"
                  name="installmentCount"
                  onChange={handleChange}
                  required
                  type="number"
                  value={formData.installmentCount}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">First Due Date</label>
                <input
                  className="form-control"
                  name="firstDueDate"
                  onChange={handleChange}
                  required
                  type="date"
                  value={formData.firstDueDate}
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Payment Method</label>
                <select
                  className="form-select"
                  name="paymentMethod"
                  onChange={handleChange}
                  value={formData.paymentMethod}
                >
                  <option value="Card">Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                </select>
              </div>

              <button
                className="btn btn-brand w-100"
                disabled={submitting}
                type="submit"
              >
                {submitting ? "Saving..." : "Create Installment Plan"}
              </button>
            </form>
          </div>
        </section>
      </div>

      <div className="col-12 col-xl-8">
        <section className="card dashboard-card h-100">
          <div className="card-body">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Collections</p>
                <h3>Installment tracking</h3>
                <p className="section-copy">
                  Update payment status installment by installment.
                </p>
              </div>
            </div>

            {loading && <p className="mb-0">Loading installment plans...</p>}
            {!loading && installmentPlans.length === 0 && (
              <p className="mb-0">No installment plans available.</p>
            )}

            <div className="installment-list">
              {installmentPlans.map((plan) => (
                <article className="installment-card" key={plan._id}>
                  <div className="installment-header">
                    <div>
                      <h4>
                        {typeof plan.policy === "string"
                          ? "Unknown Policy"
                          : plan.policy?.policyNumber || "Unknown Policy"}
                      </h4>

                      <p className="mb-0">
                        {typeof plan.policy === "string"
                          ? ""
                          : plan.policy?.customerName}{" "}
                        | {plan.paymentMethod} |{" "}
                        {formatCurrency(plan.totalAmount)}
                      </p>
                    </div>

                    <span className="plan-badge">
                      {plan.installmentCount} installments
                    </span>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-sm policy-table align-middle mb-0">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Due Date</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th className="text-end">Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {plan.installments.map((installment) => (
                          <tr
                            key={`${plan._id}-${installment.installmentNumber}`}
                          >
                            <td>{installment.installmentNumber}</td>

                            <td>
                              {new Date(
                                installment.dueDate,
                              ).toLocaleDateString()}
                            </td>

                            <td>{formatCurrency(installment.amount)}</td>

                            <td>
                              <span
                                className={`status-pill status-${installment.status.toLowerCase()}`}
                              >
                                {installment.status}
                              </span>
                            </td>

                            <td className="text-end">
                              <button
                                className="btn btn-sm btn-success-soft"
                                disabled={installment.status === "Paid"}
                                onClick={() =>
                                  void onMarkPaid(
                                    plan._id,
                                    installment.installmentNumber,
                                  )
                                }
                                type="button"
                              >
                                {installment.status === "Paid"
                                  ? "Paid"
                                  : "Mark Paid"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default InstallmentManager;