const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  city: { type: String, required: true },
  zone: { type: String, required: true },
  platform: { type: String, enum: ["Zomato", "Swiggy", "Both"], required: true },
  avgWeeklyEarnings: { type: Number, required: true },
  workHoursPerDay: { type: Number, required: true },
  riskScore: { type: Number, default: 50 },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("User", userSchema);