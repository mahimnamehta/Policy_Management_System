import Policy from '../models/Policy.js';
import InstallmentPlan from '../models/InstallmentPlan.js';

export const getPolicies = async (_req, res) => {
  try {
    const policies = await Policy.find().sort({ createdAt: -1 });
    res.json(policies);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch policies', error: error.message });
  }
};

export const createPolicy = async (req, res) => {
  try {
    const policy = await Policy.create(req.body);
    res.status(201).json(policy);
  } catch (error) {
    const statusCode = error.code === 11000 ? 409 : 400;
    res.status(statusCode).json({ message: 'Failed to create policy', error: error.message });
  }
};

export const updatePolicy = async (req, res) => {
  try {
    const policy = await Policy.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    return res.json(policy);
  } catch (error) {
    const statusCode = error.code === 11000 ? 409 : 400;
    return res.status(statusCode).json({ message: 'Failed to update policy', error: error.message });
  }
};

export const deletePolicy = async (req, res) => {
  try {
    const policy = await Policy.findByIdAndDelete(req.params.id);

    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    await InstallmentPlan.deleteMany({ policy: req.params.id });

    return res.json({ message: 'Policy deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete policy', error: error.message });
  }
};
