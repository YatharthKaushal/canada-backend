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
} from "./controller.js";

const router = express.Router();

/* *
 * @description Get all users
 * @route GET /users
 * @req none
 * @res JSON array of users
 */
router.get("/users", getAllUsers);

/* *
 * @description Get a user by ID
 * @route GET /users/:id
 * @req params.id
 * @res JSON user object
 */
router.get("/users/:id", getUserById);

/* *
 * @description Create a new user
 * @route POST /users
 * @req body (name, email, etc.)
 * @res JSON created user object
 */
router.post("/users", createUser);

/* *
 * @description Update a user by ID
 * @route PUT /users/:id
 * @req params.id, body (fields to update)
 * @res JSON updated user object
 */
router.put("/users/:id", updateUser);

/* *
 * @description Delete a user by ID
 * @route DELETE /users/:id
 * @req params.id
 * @res JSON message
 */
router.delete("/users/:id", deleteUser);

/* *
 * @description Update user's current plan
 * @route PUT /users/:id/current-plan
 * @req params.id, body (currentPlan object)
 * @res JSON updated user object
 */
router.put("/users/:id/current-plan", updateCurrentPlan);

/* *
 * @description Update user's account status
 * @route PUT /users/:id/account-status
 * @req params.id, body.accountStatus
 * @res JSON updated user object
 */
router.put("/users/:id/account-status", updateAccountStatus);

/* *
 * @description Update user's payment status
 * @route PUT /users/:id/payment-status
 * @req params.id, body.paymentStatus
 * @res JSON updated user object
 */
router.put("/users/:id/payment-status", updatePaymentStatus);

/* *
 * @description Assign a number to user
 * @route PUT /users/:id/assign-number
 * @req params.id, body.assignedNumber
 * @res JSON updated user object
 */
router.put("/users/:id/assign-number", assignNumber);

export default router;
