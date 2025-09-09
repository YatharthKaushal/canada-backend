import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateCurrentPlan,
  updateAccountStatus,
  updatePaymentStatus,
  assignNumber,
} from "../controllers/user.controller.js";

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users
router.get("/", getAllUsers);

// @route   GET /api/users/:id
// @desc    Get user by ID
router.get("/:id", getUserById);

// @route   POST /api/users
// @desc    Create a new user
router.post("/", createUser);

// @route   PUT /api/users/:id
// @desc    Update user by ID
router.put("/:id", updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user by ID
router.delete("/:id", deleteUser);

// @route   PUT /api/users/:id/current-plan
// @desc    Update the current plan for a user
router.put("/:id/current-plan", updateCurrentPlan);

// @route   PUT /api/users/:id/account-status
// @desc    Update the account status for a user
router.put("/:id/account-status", updateAccountStatus);

// @route   PUT /api/users/:id/payment-status
// @desc    Update the payment status for a user
router.put("/:id/payment-status", updatePaymentStatus);

// @route   PUT /api/users/:id/assign-number
// @desc    Assign a number to a user
router.put("/:id/assign-number", assignNumber);

export default router;
