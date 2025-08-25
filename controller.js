import User from "./model.js"; // Assuming your schema is exported from model.js

// Description: Get all users
// Route: GET /users
// req: none
// res: JSON array of users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Description: Get a user by ID
// Route: GET /users/:id
// req: params.id
// res: JSON user object
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Description: Create a new user
// Route: POST /users
// req: body (name, email, etc.)
// res: JSON created user object
export const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Description: Update a user by ID
// Route: PUT /users/:id
// req: params.id, body (fields to update)
// res: JSON updated user object
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Description: Delete a user by ID
// Route: DELETE /users/:id
// req: params.id
// res: JSON message
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Description: Update user's current plan
// Route: PUT /users/:id/current-plan
// req: params.id, body (currentPlan object)
// res: JSON updated user object
export const updateCurrentPlan = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { currentPlan: req.body.currentPlan },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Description: Update user's account status
// Route: PUT /users/:id/account-status
// req: params.id, body.accountStatus
// res: JSON updated user object
export const updateAccountStatus = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { accountStatus: req.body.accountStatus },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Description: Update user's payment status
// Route: PUT /users/:id/payment-status
// req: params.id, body.paymentStatus
// res: JSON updated user object
export const updatePaymentStatus = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: req.body.paymentStatus },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Description: Assign a number to user
// Route: PUT /users/:id/assign-number
// req: params.id, body.assignedNumber
// res: JSON updated user object
export const assignNumber = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { assignedNumber: req.body.assignedNumber },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
