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
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Stripe webhook must use raw body parser for signature verification
app.use("/stripe/webhook", stripeWebhook);

// Other API routes
app.use(express.json());
app.use("/api", clerkWebhook);
app.use("/api", apiRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
