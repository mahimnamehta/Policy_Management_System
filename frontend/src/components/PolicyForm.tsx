import type { ChangeEvent, FormEvent } from 'react';
import type { PolicyFormData } from '../types/dashboard';

const policyTypes = ['Health', 'Life', 'Vehicle', 'Home', 'Travel', 'Business'];
const statusOptions = ['Pending', 'Active', 'Expired', 'Cancelled'];

interface PolicyFormProps {
  formData: PolicyFormData;
  isEditing: boolean;
  onCancel: () => void;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const PolicyForm = ({ formData, isEditing, onCancel, onChange, onSubmit }: PolicyFormProps): JSX.Element => (
  <section className="card dashboard-card h-100">
    <div className="card-body">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Policy Studio</p>
          <h3>{isEditing ? 'Update policy record' : 'Create a new policy'}</h3>
          <p className="section-copy">Fill the customer profile, coverage details, and policy period.</p>
        </div>
      </div>

      <form onSubmit={onSubmit}>
        <div className="row g-3">
          <div className="col-md-6"><label className="form-label">Policy Number</label><input className="form-control" name="policyNumber" onChange={onChange} required value={formData.policyNumber} /></div>
          <div className="col-md-6"><label className="form-label">Customer Name</label><input className="form-control" name="customerName" onChange={onChange} required value={formData.customerName} /></div>
          <div className="col-md-6"><label className="form-label">Email</label><input className="form-control" name="email" onChange={onChange} required type="email" value={formData.email} /></div>
          <div className="col-md-6"><label className="form-label">Phone</label><input className="form-control" name="phone" onChange={onChange} required value={formData.phone} /></div>
          <div className="col-md-6">
            <label className="form-label">Policy Type</label>
            <select className="form-select" name="policyType" onChange={onChange} value={formData.policyType}>{policyTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Status</label>
            <select className="form-select" name="status" onChange={onChange} value={formData.status}>{statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}</select>
          </div>
          <div className="col-md-6"><label className="form-label">Coverage Amount</label><input className="form-control" min="0" name="coverageAmount" onChange={onChange} required step="0.01" type="number" value={formData.coverageAmount} /></div>
          <div className="col-md-6"><label className="form-label">Premium Amount</label><input className="form-control" min="0" name="premiumAmount" onChange={onChange} required step="0.01" type="number" value={formData.premiumAmount} /></div>
          <div className="col-md-6"><label className="form-label">Start Date</label><input className="form-control" name="startDate" onChange={onChange} required type="date" value={formData.startDate} /></div>
          <div className="col-md-6"><label className="form-label">End Date</label><input className="form-control" name="endDate" onChange={onChange} required type="date" value={formData.endDate} /></div>
          <div className="col-12"><label className="form-label">Notes</label><textarea className="form-control" name="notes" onChange={onChange} rows={3} value={formData.notes} /></div>
        </div>
        <div className="d-flex gap-2 mt-4">
          <button className="btn btn-brand" type="submit">{isEditing ? 'Update Policy' : 'Create Policy'}</button>
          {isEditing && <button className="btn btn-ghost" type="button" onClick={onCancel}>Cancel</button>}
        </div>
      </form>
    </div>
  </section>
);

export default PolicyForm;
