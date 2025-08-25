import mongoose from "mongoose";

const currentPlanSchema = new mongoose.Schema(
  {
    purchaseDate: { type: Date },
    tier: { type: String, enum: ["tier 1", "tier 2", "tier 3"] },
    expiryDate: { type: Date },
    servicesSelected: [{ type: String }],
  },
  { _id: false }
);

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  accountStatus: {
    type: String,
    enum: ["Pending", "Completed"],
    default: "Pending",
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Completed", "Failed"],
    default: "Pending",
  },
  currentPlanStatus: {
    type: String,
    enum: ["Activate", "Expired", "N/A"],
    default: "N/A",
  },
  currentPlan: { type: currentPlanSchema },
  assignedNumber: { type: String, default: "Pending" },
});

export default mongoose.model("User", userSchema);
