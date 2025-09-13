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
// Use fetch for HTTP requests
import fetch from "node-fetch";
// @desc    Update user by clerk_id with business, servicePreference, and faq
// @route   PUT /api/users/update-by-clerk-id
export const updateUserByClerkId = async (req, res) => {
  console.log("reached");
  try {
    console.log("Received body:", JSON.stringify(req.body, null, 2));
    const { clerk_id, business, servicePreference, faq } = req.body;
    if (!clerk_id) {
      console.log("Missing clerk_id");
      return res.status(400).json({ error: "clerk_id is required" });
    }
    const user = await User.findOne({ clerk_id });
    console.log("User found:", user);
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
    console.log("Updated businessDetails:", user.businessDetails);

    // Update preferences
    if (servicePreference) {
      user.preferences.voicemail = servicePreference === "voicemail";
      user.preferences.scheduling = servicePreference === "scheduling";
      console.log("Updated preferences:", user.preferences);
    }

    // Update FAQ as array of {question, answer}
    if (faq && Array.isArray(faq.questions)) {
      user.businessDetails.faq = faq.questions.map((q, i) => {
        if (!q.question || typeof q.answer === "undefined") {
          console.log(`Invalid FAQ at index ${i}:`, q);
        }
        return {
          question: q.question,
          answer: q.answer,
        };
      });
      console.log("Updated FAQ:", user.businessDetails.faq);
    } else {
      console.log("faq.questions is not an array or missing");
      return res.status(400).json({ error: "faq.questions must be an array" });
    }

    // First save after receiving client request
    await user.save();
    console.log("User after initial save:", user);

    // Then send request to external API and update user again
    try {
      const response = await fetch(
        "https://dhruvthc.app.n8n.cloud/webhook/f61980c4-6159-42a0-91ed-08b36ecc136c",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(req.body),
        }
      );
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`External API error: ${response.status} ${text}`);
      }
      const data = await response.json();
      console.log("Successfully forwarded request to external API", data);
      // Save the first object in the response array to the user document
      if (Array.isArray(data) && data.length > 0) {
        const info = data[0];
        // Save phone_number to assigned_phone_number and id to agent_id
        if (info.phone_number) user.assigned_phone_number = info.phone_number;
        if (info.id) user.agent_id = info.id;
        await user.save();
        console.log(
          "Saved agent_id and assigned_phone_number from n8n response"
        );
      }
    } catch (forwardErr) {
      console.error(
        "Error forwarding request to external API:",
        forwardErr.message
      );
      // Optionally, you can return an error or just log it
    }
    res.status(200).json(user);
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
