// @desc    Proxy call to Vapi API with assistant_id from query param
// @route   POST /api/vapi-call?assistant_id=...

import fetch from "node-fetch";

export const vapiCallHandler = async (req, res) => {
  try {
    // const assistant_id = "5c916527-2c43-4815-970a-73b43fa6a49f";

    const assistant_id = req.query.assistant_id;
    if (!assistant_id) {
      return res.status(400).json({ error: "assistant_id is required" });
    }
    const response = await fetch(
      `https://api.vapi.ai/call?assistantId=${assistant_id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer c25561a2-c5db-4293-9f02-de7715a5e2f3`,
          // Authorization: `Bearer ${process.env.VAPI_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      }
    );
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// @desc    Update calendar_tokens by clerk_id
// @route   PUT /api/users/calendar-tokens/clerk/:clerk_id
export const updateCalendarTokensByClerkId = async (req, res) => {
  try {
    const { clerk_id } = req.params;
    const { refresh_token, access_token } = req.body;
    if (!clerk_id) {
      return res.status(400).json({ error: "clerk_id is required" });
    }
    const user = await User.findOne({ clerk_id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (refresh_token !== undefined)
      user.calendar_tokens.refresh_token = refresh_token;
    if (access_token !== undefined)
      user.calendar_tokens.access_token = access_token;
    await user.save();
    res.status(200).json(user.calendar_tokens);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// @desc    Get a user by clerk_id
// @route   GET /api/users/clerk/:clerk_id
export const getUserByClerkId = async (req, res) => {
  try {
    const { clerk_id } = req.params;
    if (!clerk_id) {
      return res.status(400).json({ error: "clerk_id is required" });
    }
    const user = await User.findOne({ clerk_id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// @desc    Get calendar_tokens by clerk_id
// @route   GET /api/users/calendar-tokens/clerk/:clerk_id
export const getCalendarTokensByClerkId = async (req, res) => {
  try {
    const { clerk_id } = req.params;
    if (!clerk_id) {
      return res.status(400).json({ error: "clerk_id is required" });
    }
    const user = await User.findOne({ clerk_id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user.calendar_tokens);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get calendar_tokens by agent_id
// @route   GET /api/users/calendar-tokens/agent/:agent_id
export const getCalendarTokensByAgentId = async (req, res) => {
  try {
    const { agent_id } = req.params;
    if (!agent_id) {
      return res.status(400).json({ error: "agent_id is required" });
    }
    const user = await User.findOne({ agent_id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user.calendar_tokens);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// @desc    Update agent_id and assigned_phone_number by clerk_id
// @route   PUT /api/users/update-agent-and-phone-by-clerk-id
export const updateAgentAndPhoneByClerkId = async (req, res) => {
  try {
    const { clerk_id, agent_id, assigned_phone_number } = req.body;
    if (!clerk_id) {
      return res.status(400).json({ error: "clerk_id is required" });
    }
    const user = await User.findOne({ clerk_id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (agent_id !== undefined) user.agent_id = agent_id;
    if (assigned_phone_number !== undefined)
      user.assigned_phone_number = assigned_phone_number;
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
import User from "../models/user.model.js";
// import fetch from "node-fetch";

// Helper function to call external API and update user
export const updateAgentIdAndPhoneFromN8n = async (clerk_id) => {
  try {
    const user = await User.findOne({ clerk_id });
    if (!user) {
      console.error("User not found for n8n update");
      return;
    }

    // console.log("> data sent to n8n: ", user);
    console.log("> data is sent to n8n: ");
    // Send the user data to the external API with a long timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5 * 60 * 1000); // 5 minutes
    let response;
    try {
      response = await fetch(
        "https://dhruvthc.app.n8n.cloud/webhook/f61980c4-6159-42a0-91ed-08b36ecc136c",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
          signal: controller.signal,
        }
      );
    } catch (fetchErr) {
      if (fetchErr.name === "AbortError") {
        throw new Error("Request to n8n timed out after 5 minutes");
      }
      throw fetchErr;
    } finally {
      clearTimeout(timeout);
    }
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`External API error: ${response.status} ${text}`);
    }
    let data;
    try {
      const text = await response.text();
      if (!text) {
        throw new Error("Empty response from n8n");
      }
      data = JSON.parse(text);
    } catch (jsonErr) {
      throw new Error(
        "Failed to parse n8n response as JSON: " + jsonErr.message
      );
    }
    console.log("> n8n res: ", data);
    if (Array.isArray(data) && data.length > 0) {
      const info = data[0];
      if (info.phone_number) user.assigned_phone_number = info.phone_number;
      if (info.id) user.agent_id = info.id;
      console.log("> n8n res: ", info.phone_number, info.id);
      await user.save();
      // console.log("Saved agent_id and assigned_phone_number from n8n response");
    }
  } catch (err) {
    console.error("Error in updateAgentIdAndPhoneFromN8n:", err.message);
  }
};
// @desc    Update user by clerk_id with business, servicePreference, and faq
// @route   PUT /api/users/update-by-clerk-id
export const updateUserByClerkId = async (req, res) => {
  // console.log("reached");
  try {
    // console.log("Received body:", JSON.stringify(req.body, null, 2));
    const { clerk_id, business, servicePreference, faq } = req.body;
    if (!clerk_id) {
      console.log("Missing clerk_id");
      return res.status(400).json({ error: "clerk_id is required" });
    }
    const user = await User.findOne({ clerk_id });
    // console.log("User found:", user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update businessDetails fields
    if (!business) {
      console.log("Missing business field in request body");
      return res
        .status(400)
        .json({ error: "Missing business field in request body" });
    }
    if (!faq) {
      console.log("Missing faq field in request body");
      return res
        .status(400)
        .json({ error: "Missing faq field in request body" });
    }
    user.businessDetails.data = business;
    user.businessDetails.businessName = business.name || "";
    user.businessDetails.businessPhone = business.phone || "";
    user.businessDetails.bussinessEmail = business.email || "";
    user.businessDetails.moreInformation = business.category || "";
    // console.log("Updated businessDetails:", user.businessDetails);

    // Update preferences
    if (servicePreference) {
      user.preferences.voicemail = servicePreference === "voicemail";
      user.preferences.scheduling = servicePreference === "scheduling";
      // console.log("Updated preferences:", user.preferences);
    }

    // Update FAQ as array of {question, answer}
    if (faq && Array.isArray(faq.questions)) {
      user.businessDetails.faq = faq.questions.map((q, i) => {
        if (!q.question || typeof q.answer === "undefined") {
          // console.log(`Invalid FAQ at index ${i}:`, q);
        }
        return {
          question: q.question,
          answer: q.answer,
        };
      });
      // console.log("Updated FAQ:", user.businessDetails.faq);
    } else {
      // console.log("faq.questions is not an array or missing");
      return res.status(400).json({ error: "faq.questions must be an array" });
    }

    // First save after receiving client request
    await user.save();
    console.log("User after initial save:", user);

    // Call the new function to update agent_id and assigned_phone_number
    // updateAgentIdAndPhoneFromN8n(clerk_id);
    // Call without awaiting, let it run in background
    updateAgentIdAndPhoneFromN8n(clerk_id).catch((err) =>
      console.error("Async n8n update failed:", err.message)
    );

    // Return the latest user document (may not have n8n data yet if async)
    res.status(200).json(await User.findOne({ clerk_id }));
  } catch (err) {
    console.error("Error in updateUserByClerkId:", err);
    if (err && err.message) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(400).json({ error: "Unknown error" });
    }
  }
};

// @desc    Get all users
// @route   GET /api/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get a user by ID
// @route   GET /api/users/:id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Create a new user
// @route   POST /api/users
export const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc    Update a user by ID
// @route   PUT /api/users/:id
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc    Delete a user by ID
// @route   DELETE /api/users/:id
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Update the current plan for a user
// @route   PUT /api/users/:id/current-plan
export const updateCurrentPlan = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { activePlan: req.body.activePlan } },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc    Update the account status for a user (example: activate/deactivate)
// @route   PUT /api/users/:id/account-status
export const updateAccountStatus = async (req, res) => {
  try {
    const { status } = req.body;
    // You may want to add a field like 'accountStatus' in the schema for this
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { accountStatus: status } },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc    Update the payment status for a user
// @route   PUT /api/users/:id/payment-status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    // You may want to add a field like 'paymentStatus' in the schema for this
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { paymentStatus } },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc    Assign a number to a user (example: assign phone number)
// @route   PUT /api/users/:id/assign-number
export const assignNumber = async (req, res) => {
  try {
    const { number } = req.body;
    // Update assigned_phone_number as per schema
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { assigned_phone_number: number } },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc    Update campaignid by clerk_id
// @route   PUT /api/users/campaignid/clerk/:clerk_id
export const updateCampaignIdByClerkId = async (req, res) => {
  try {
    const { clerk_id } = req.params;
    const { campaignid } = req.body;
    if (!clerk_id) {
      return res.status(400).json({ error: "clerk_id is required" });
    }
    if (!campaignid) {
      return res.status(400).json({ error: "campaignid is required" });
    }
    const user = await User.findOne({ clerk_id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!Array.isArray(user.campaignid)) user.campaignid = [];
    if (!user.campaignid.includes(campaignid)) {
      user.campaignid.push(campaignid);
    }
    await user.save();
    res.status(200).json({ campaignid: user.campaignid });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc    Get all campaign API responses by clerk_id
// @route   GET /api/users/campaigns/call/clerk/:clerk_id
export const getAllCampaignApiResponsesByClerkId = async (req, res) => {
  try {
    const { clerk_id } = req.params;
    if (!clerk_id) {
      return res.status(400).json({ error: "clerk_id is required" });
    }
    const user = await User.findOne({ clerk_id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!Array.isArray(user.campaignid) || user.campaignid.length === 0) {
      return res.status(404).json({ error: "No campaign ids found for user" });
    }
    const token = "c25561a2-c5db-4293-9f02-de7715a5e2f3";
    const results = await Promise.all(
      user.campaignid.map(async (id) => {
        try {
          const response = await fetch(`https://api.vapi.ai/campaign/${id}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          return { id, status: response.status, data };
        } catch (err) {
          return { id, error: err.message };
        }
      })
    );
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
