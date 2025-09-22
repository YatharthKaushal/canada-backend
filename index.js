import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import apiRoutes from "./routes/index.js";
import clerkWebhook from "./routes/clerkWebhook.routes.js";
import stripeWebhook from "./routes/stripeWebhook.js"; // Use the actual webhook handler
import cors from "cors";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

await connectDB();

// Enable CORS for client
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        // Add more client URLs or IPs as needed
        process.env.CLIENT_URL,
      ].filter(Boolean); // Remove undefined values

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Stripe webhook must use raw body parser for signature verification
app.use("/stripe/webhook", stripeWebhook);
app.use("/api", clerkWebhook);

// Other API routes
app.use(express.json());
app.use("/api", apiRoutes);

// create a stripe checkout session route here /api/stripe/create-checkout-session

// Health check route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
