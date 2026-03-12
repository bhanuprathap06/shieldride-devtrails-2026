const mongoose = require("mongoose");
const policySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tier: { type: String, enum: ["Basic", "Standard", "Pro"], required: true },
  weeklyPremium: { type: Number, required: true },
  maxDailyPayout: { type: Number, required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ["Active", "Expired", "Cancelled"], default: "Active" },
  city: { type: String, required: true },
  zone: { type: String, required: true },
});
module.exports = mongoose.model("Policy", policySchema);