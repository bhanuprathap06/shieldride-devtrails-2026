const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Claim = require("../models/Claim");
const Policy = require("../models/Policy");

function calculateFraudScore(policyStartDate, weeklyClaimCount) {
  let score = 0;
  const policyAge = (new Date() - new Date(policyStartDate)) / (1000 * 60 * 60);
  if (policyAge < 1) score += 50;
  if (weeklyClaimCount > 2) score += 30;
  return Math.min(score, 100);
}

router.post("/create", auth, async (req, res) => {
  try {
    const { triggerType, triggerValue } = req.body;
    const policy = await Policy.findOne({ user: req.user.id, status: "Active" });
    if (!policy) return res.status(404).json({ message: "No active policy found" });

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    const weeklyClaimCount = await Claim.countDocuments({
      user: req.user.id,
      createdAt: { $gte: weekStart },
    });

    const fraudScore = calculateFraudScore(policy.startDate, weeklyClaimCount);
    const status = fraudScore > 60 ? "Flagged" : "Auto-Approved";
    const payoutAmount = status === "Auto-Approved" ? policy.maxDailyPayout : 0;

    const claim = new Claim({
      user: req.user.id, policy: policy._id,
      triggerType, triggerValue, payoutAmount, status, fraudScore,
      paidAt: status === "Auto-Approved" ? new Date() : null,
    });

    await claim.save();
    res.status(201).json(claim);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/my", auth, async (req, res) => {
  try {
    const claims = await Claim.find({ user: req.user.id })
      .populate("policy", "tier weeklyPremium")
      .sort({ createdAt: -1 });
    res.json(claims);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/stats", auth, async (req, res) => {
  try {
    const claims = await Claim.find({ user: req.user.id });
    const totalPayout = claims
      .filter((c) => c.status === "Auto-Approved" || c.status === "Paid")
      .reduce((sum, c) => sum + c.payoutAmount, 0);
    res.json({ totalPayout, totalClaims: claims.length, approvedClaims: claims.filter((c) => c.status !== "Rejected").length });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;