import { Router } from "express";
import userRoutes from "./user.routes.js";
import stripeRoutes from "./stripe.routes.js";

const router = Router();

router.use("/users", userRoutes);
router.use("/stripe", stripeRoutes);

export default router;
