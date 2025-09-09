// Stripe webhook handler for subscription events
import express from "express";
import Stripe from "stripe";
import User from "../models/user.model.js";

const router = express.Router();

// Initialize Stripe with your secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe requires the raw body to validate the signature
router.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed.", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle subscription events
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        const productId = subscription.items.data[0]?.price.product;
        const status = subscription.status;
        const startDate = new Date(subscription.start_date * 1000);
        const endDate = subscription.ended_at
          ? new Date(subscription.ended_at * 1000)
          : null;
        const currentPeriodEnd = new Date(
          subscription.current_period_end * 1000
        );

        // Update user in DB
        await User.findOneAndUpdate(
          { "activePlan.stripeCustomerId": customerId },
          {
            $set: {
              "activePlan.stripeProductId": productId || "N/A",
              "activePlan.subscriptionStatus": status || "N/A",
              "activePlan.startDate": startDate,
              "activePlan.endDate": endDate,
              "activePlan.currentPeriodEnd": currentPeriodEnd,
            },
          },
          { new: true }
        );
        break;
      }
      default:
        // Unhandled event type
        break;
    }

    res.status(200).json({ received: true });
  }
);

export default router;
