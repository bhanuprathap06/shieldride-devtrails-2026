const mongoose = require("mongoose");
const claimSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  policy: { type: mongoose.Schema.Types.ObjectId, ref: "Policy", required: true },
  triggerType: {
    type: String,
    enum: ["Heavy Rain", "Flood Alert", "Extreme Heat", "Severe Pollution", "Civic Disruption"],
    required: true,
  },
  triggerValue: { type: String, required: true },
  disruptionDate: { type: Date, default: Date.now },
  payoutAmount: { type: Number, required: true },
  status: { type: String, enum: ["Auto-Approved", "Flagged", "Rejected", "Paid"], default: "Auto-Approved" },
  fraudScore: { type: Number, default: 0 },
  paidAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Claim", claimSchema);