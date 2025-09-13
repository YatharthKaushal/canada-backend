import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  clerk_id: { type: String, required: true },
  businessDetails: {
    businessName: { type: String, default: "" },
    data: { type: mongoose.Schema.Types.Mixed },
    businessPhone: { type: String, default: "" },
    bussinessEmail: { type: String, default: "" },
    moreInformation: { type: String, default: "" },
    faq: { type: [String], default: [] },
  },
  outboundPrompt: { type: String, default: "" },
  inboundPrompt: { type: String, default: "" },
  activePlan: {
    stripeProductId: { type: String, default: "N/A" },
    stripeCustomerId: { type: String, default: "N/A" },
    subscriptionStatus: {
      type: String,
      enum: ["active", "past_due", "canceled", "trialing", "N/A"],
      default: "N/A",
    },
    startDate: { type: Date },
    endDate: { type: Date },
    freeEndsAt: { type: Date },
    currentPeriodEnd: { type: Date },
  },
  preferences: {
    voicemail: { type: Boolean, default: false },
    scheduling: { type: Boolean, default: false },
    faq: { type: Boolean, default: false },
    scheduleType: {
      type: String,
      enum: ["business_hours", "24_7", "custom"],
    },
    customSchedule: { type: mongoose.Schema.Types.Mixed },
  },
});

export default mongoose.model("User", userSchema);
