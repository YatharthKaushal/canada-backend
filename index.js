import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import router from "./route.js";
import clerkWebhook from "./routes/clerkWebhook.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB via Mongoose
await connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Clerk webhook must use raw body before JSON parser
app.use("/api", clerkWebhook);

// Parse JSON for all other routes
app.use(express.json());

// Application routes
app.use("/", router);

// Test route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
