import User from "../models/user.model.js";

// @desc    Get all users
// @route   GET /api/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get a user by ID
// @route   GET /api/users/:id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Create a new user
// @route   POST /api/users
export const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc    Update a user by ID
// @route   PUT /api/users/:id
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc    Delete a user by ID
// @route   DELETE /api/users/:id
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Update the current plan for a user
// @route   PUT /api/users/:id/current-plan
export const updateCurrentPlan = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { activePlan: req.body.activePlan } },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc    Update the account status for a user (example: activate/deactivate)
// @route   PUT /api/users/:id/account-status
export const updateAccountStatus = async (req, res) => {
  try {
    const { status } = req.body;
    // You may want to add a field like 'accountStatus' in the schema for this
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { accountStatus: status } },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc    Update the payment status for a user
// @route   PUT /api/users/:id/payment-status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    // You may want to add a field like 'paymentStatus' in the schema for this
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { paymentStatus } },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc    Assign a number to a user (example: assign phone number)
// @route   PUT /api/users/:id/assign-number
export const assignNumber = async (req, res) => {
  try {
    const { number } = req.body;
    // You may want to add a field like 'assignedNumber' in the schema for this
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { assignedNumber: number } },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
