import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  agent_id: { type: String, default: "" },
  assigned_phone_number: { type: String, default: "" },
  // agent_id: { type: String, default: "e541fd80-4a50-4544-9f69-ac472a107288" },
  // assigned_phone_number: { type: String, default: "+15393790230" },
  campaignid: { type: [String], default: [] },
  calendar_tokens: {
    refresh_token: {
      type: String,
      default:
        "1//0gIQwdUokzrxhCgYIARAAGBASNwF-L9Ir3eaOZziMd-Wh6gcVkdwpj-pFzQBou9_58ulEt_VCvVx2Q5JJLKNxp-0-p3t4bcHhN5o",
    },
    access_token: {
      type: String,
      default:
        "ya29.a0AS3H6NzoE1G8HQdvm0ck_jEp5pz0V9BnLM6rTIxYL4OlW35UDL7aay4Jsru3dsd94e29oHTDRuQ3nw83FE5-xT3ukmqx6Y02frNI6VW-Pl59ykDdeas8cEEzbpFm_nY5PUDS0CXagTYAi0S7W2uJB9-c2idlpsY1sXpdBMHRpXjKIRZr55pZRVCLp4We8ksQnQ06PwkaCgYKAe4SARQSFQHGX2MizhWQkPTVzVOK1ItkEFvwAA0206",
    },
  },
  clerk_id: { type: String, required: true },
  businessDetails: {
    businessName: { type: String, default: "" },
    data: { type: mongoose.Schema.Types.Mixed },
    businessPhone: { type: String, default: "" },
    bussinessEmail: { type: String, default: "" },
    moreInformation: { type: String, default: "" },
    // faq is now array of { question, answer }
    faq: {
      type: [
        {
          question: { type: String, required: true },
          answer: { type: String, required: true },
        },
      ],
      default: [],
    },
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
