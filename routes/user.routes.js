import express from "express";
import {
  getAllUsers,
  getUserById,
  getUserByClerkId,
  createUser,
  updateUser,
  deleteUser,
  updateCurrentPlan,
  updateAccountStatus,
  updatePaymentStatus,
  assignNumber,
  updateUserByClerkId,
  updateAgentAndPhoneByClerkId,
  getCalendarTokensByClerkId,
  getCalendarTokensByAgentId,
  updateCalendarTokensByClerkId,
  vapiCallHandler,
} from "../controllers/user.controller.js";
const router = express.Router();
// @route   POST /api/vapi-call?assistant_id=...
// @desc    Proxy call to Vapi API with assistant_id from query param
router.get("/vapi-call", vapiCallHandler);

// @route   PUT /api/users/calendar-tokens/clerk/:clerk_id
// @desc    Update calendar_tokens by clerk_id
router.put("/calendar-tokens/clerk/:clerk_id", updateCalendarTokensByClerkId);

// @route   GET /api/users/calendar-tokens/clerk/:clerk_id
// @desc    Get calendar_tokens by clerk_id
router.get("/calendar-tokens/clerk/:clerk_id", getCalendarTokensByClerkId);

// @route   GET /api/users/calendar-tokens/agent/:agent_id
// @desc    Get calendar_tokens by agent_id
router.get("/calendar-tokens/agent/:agent_id", getCalendarTokensByAgentId);
// @route   PUT /api/users/update-agent-and-phone-by-clerk-id
// @desc    Update agent_id and assigned_phone_number by clerk_id
router.put("/update-agent-and-phone-by-clerk-id", updateAgentAndPhoneByClerkId);

// @route   GET /api/users/clerk/:clerk_id
// @desc    Get user by clerk_id
router.get("/clerk/:clerk_id", getUserByClerkId);

// @route   GET /api/users/calendar-tokens/clerk/:clerk_id
// @desc    Get calendar_tokens by clerk_id
router.get("/calendar-tokens/clerk/:clerk_id", getCalendarTokensByClerkId);

// @route   GET /api/users/calendar-tokens/agent/:agent_id
// @desc    Get calendar_tokens by agent_id
router.get("/calendar-tokens/agent/:agent_id", getCalendarTokensByAgentId);

// @route   PUT /api/users/update-agent-and-phone-by-clerk-id
// @desc    Update agent_id and assigned_phone_number by clerk_id
router.put("/update-agent-and-phone-by-clerk-id", updateAgentAndPhoneByClerkId);

// @route   GET /api/users
// @desc    Get all users
router.get("/", getAllUsers);

// @route   PUT /api/users/update-by-clerk-id
// @desc    Update user by clerk_id
router.put("/update-by-clerk-id", updateUserByClerkId);

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
