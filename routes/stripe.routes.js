import { Router } from "express";
import {
  createCheckoutSession,
  checkoutSession,
} from "../controllers/stripe.controller.js";

const router = Router();

// POST /api/stripe/create-checkout-session
router.post("/create-checkout-session", createCheckoutSession);
router.get("/checkout-session/:id", checkoutSession);

export default router;
