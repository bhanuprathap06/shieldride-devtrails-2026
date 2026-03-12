import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Policy({ user, logout }) {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("shieldride_token");
  const headers = { Authorization: `Bearer ${token}` };

  const tiers = [
    { name: "Basic", price: 29, payout: 300, desc: "Perfect for part-time riders", features: ["₹300/day payout", "Rain + Heat triggers", "UPI instant transfer"] },
    { name: "Standard", price: 59, payout: 500, desc: "Most popular choice", features: ["₹500/day payout", "All 5 triggers covered", "Priority claim processing"], popular: true },
    { name: "Pro", price: 99, payout: 800, desc: "For full-time riders", features: ["₹800/day payout", "All triggers + Civic", "Dedicated support"] },
  ];

  useEffect(() => {
    axios.get("http://localhost:5000/api/policy/my", { headers }).then((r) => setPolicies(r.data)).catch(() => {});
  }, []);

  const buyPolicy = async (tier) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await axios.post("http://localhost:5000/api/policy/create", { tier }, { headers });
      setSuccess(`✅ ${tier} Shield activated! You're now protected for 7 days.`);
      const r = await axios.get("http://localhost:5000/api/policy/my", { headers });
      setPolicies(r.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create policy.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <nav className="navbar">
        <Link to="/" className="navbar-brand">Shield<span>Ride</span></Link>
        <div className="nav-links">
          <Link to="/dashboard" className="nav-link">🏠 Home</Link>
          <Link to="/policy" className="nav-link">🛡️ Policy</Link>
          <Link to="/claims" className="nav-link">📋 Claims</Link>
          <button className="btn btn-outline" style={{ padding: "8px 16px", fontSize: 13 }} onClick={() => { logout(); navigate("/"); }}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Choose Your Shield</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: 32 }}>Weekly coverage tailored to your earnings. Cancel anytime.</p>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">⚠️ {error}</div>}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24, marginBottom: 40 }}>
          {tiers.map((tier) => (
            <div key={tier.name} className="card" style={{ position: "relative", border: tier.popular ? "2px solid var(--primary)" : "1px solid var(--dark-border)" }}>
              {tier.popular && <div className="badge badge-success" style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)" }}>Most Popular</div>}
              <h3 style={{ fontSize: 20, marginBottom: 4 }}>{tier.name} Shield</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 16 }}>{tier.desc}</p>
              <div style={{ marginBottom: 16 }}>
                <span style={{ fontSize: 36, fontWeight: 800, color: "var(--primary)", fontFamily: "Syne" }}>₹{tier.price}</span>
                <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>/week</span>
              </div>
              <div style={{ marginBottom: 20 }}>
                {tier.features.map((f) => (
                  <div key={f} style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 14 }}>
                    <span style={{ color: "var(--primary)" }}>✓</span>
                    <span style={{ color: "var(--text-secondary)" }}>{f}</span>
                  </div>
                ))}
              </div>
              <button className={`btn btn-full ${tier.popular ? "btn-primary" : "btn-outline"}`}
                onClick={() => buyPolicy(tier.name)} disabled={loading}>
                {loading ? "Processing..." : `Activate ${tier.name} →`}
              </button>
            </div>
          ))}
        </div>

        {policies.length > 0 && (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>My Policies</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {policies.map((p) => (
                <div key={p._id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px" }}>
                  <div>
                    <span style={{ fontWeight: 600 }}>{p.tier} Shield</span>
                    <span style={{ color: "var(--text-secondary)", fontSize: 13, marginLeft: 12 }}>₹{p.weeklyPremium}/week • Max ₹{p.maxDailyPayout}/day</span>
                  </div>
                  <span className={`badge ${p.status === "Active" ? "badge-success" : "badge-warning"}`}>{p.status}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}