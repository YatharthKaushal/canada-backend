import express from "express";
import { connectDB } from "./db.js";
import dotenv from "dotenv";
import router from "./route.js";
import clerkWebhook from "./routes/clerkWebhook.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Clerk webhook must use raw body
app.use("/api", clerkWebhook);

// middleware
app.use(express.json());

// routes
app.use("/", router);

async function startServer() {
  try {
    await connectDB();
    console.log("Connected to database");

    app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to database", err);
    process.exit(1);
  }
}

startServer();
