import express from "express";
import { Webhook } from "svix";
import User from "../userModel.js"; // your Mongoose User model

const router = express.Router();

// Clerk requires raw body for signature verification
router.post(
  "/clerk-webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
      throw new Error("Missing CLERK_WEBHOOK_SECRET");
    }

    const svix_id = req.headers["svix-id"];
    const svix_timestamp = req.headers["svix-timestamp"];
    const svix_signature = req.headers["svix-signature"];

    const wh = new Webhook(WEBHOOK_SECRET);

    let evt;
    try {
      evt = wh.verify(req.body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    } catch (err) {
      console.error("Webhook verification failed:", err.message);
      return res.status(400).json({ error: "Invalid webhook signature" });
    }

    const { type, data } = evt;

    if (type === "user.created") {
      const email = data.email_addresses?.[0]?.email_address;
      const firstName = data.first_name || "";
      const lastName = data.last_name || "";
      const fullName = `${firstName} ${lastName}`.trim() || email;

      try {
        // Only insert if not already in DB
        const existing = await User.findOne({ email });
        if (!existing) {
          await User.create({
            name: fullName,
            email,
          });
          console.log(`✅ User created in Mongo: ${email}`);
        }
      } catch (err) {
        console.error("Error creating user in Mongo:", err.message);
      }
    }

    res.json({ success: true });
  }
);

export default router;
