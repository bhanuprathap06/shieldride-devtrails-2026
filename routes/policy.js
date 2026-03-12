const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Policy = require("../models/Policy");
const User = require("../models/User");

function calculatePremium(tier, city, riskScore) {
  const basePrices = { Basic: 29, Standard: 59, Pro: 99 };
  const maxPayouts = { Basic: 300, Standard: 500, Pro: 800 };
  const highRiskCities = ["Mumbai", "Chennai", "Kolkata"];
  const mediumRiskCities = ["Bangalore", "Hyderabad"];

  let premium = basePrices[tier];
  if (highRiskCities.includes(city)) premium += 20;
  else if (mediumRiskCities.includes(city)) premium += 10;
  if (riskScore > 75) premium += 10;
  else if (riskScore < 40) premium -= 5;

  return { weeklyPremium: Math.max(premium, basePrices[tier]), maxDailyPayout: maxPayouts[tier] };
}

router.post("/create", auth, async (req, res) => {
  try {
    const { tier } = req.body;
    const user = await User.findById(req.user.id);
    const { weeklyPremium, maxDailyPayout } = calculatePremium(tier, user.city, user.riskScore);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const policy = new Policy({
      user: user._id, tier, weeklyPremium, maxDailyPayout,
      city: user.city, zone: user.zone, endDate,
    });

    await policy.save();
    res.status(201).json(policy);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/my", auth, async (req, res) => {
  try {
    const policies = await Policy.find({ user: req.user.id }).sort({ startDate: -1 });
    res.json(policies);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/quote", auth, async (req, res) => {
  try {
    const { tier } = req.query;
    const user = await User.findById(req.user.id);
    const quote = calculatePremium(tier || "Standard", user.city, user.riskScore);
    res.json({ tier: tier || "Standard", ...quote, city: user.city, riskScore: user.riskScore });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;