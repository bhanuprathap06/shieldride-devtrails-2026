import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Claims({ user, logout }) {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("shieldride_token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get("http://localhost:5000/api/claims/my", { headers }).then((r) => setClaims(r.data)).catch(() => {});
  }, []);

  const simulateClaim = async (scenario) => {
    setSimulating(true);
    setError("");
    setSuccess("");
    try {
      const weatherRes = await axios.get(`http://localhost:5000/api/weather/simulate?scenario=${scenario}`, { headers });
      const weather = weatherRes.data;
      if (!weather.disruption) {
        setError("No disruption detected in simulation.");
        setSimulating(false);
        return;
      }
      const trigger = weather.triggers[0];
      const claimRes = await axios.post("http://localhost:5000/api/claims/create",
        { triggerType: trigger.type, triggerValue: trigger.value }, { headers });
      const claim = claimRes.data;
      setSuccess(`🎉 Claim Auto-Approved! ₹${claim.payoutAmount} will be credited to your UPI account within 5 minutes.`);
      const r = await axios.get("http://localhost:5000/api/claims/my", { headers });
      setClaims(r.data);
    } catch (err) {
      setError(err.response?.data?.message || "Claim failed. Make sure you have an active policy.");
    }
    setSimulating(false);
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
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Claims Center</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: 32 }}>Simulate a disruption and see instant auto-claim in action.</p>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">⚠️ {error}</div>}

        <div className="card" style={{ marginBottom: 32 }}>
          <h3 style={{ marginBottom: 8, fontSize: 18 }}>🧪 Simulate Disruption (Demo)</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 20 }}>
            Trigger a fake weather event to demonstrate the zero-touch claim process.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={() => simulateClaim("rain")} disabled={simulating}>
              🌧️ {simulating ? "Processing..." : "Simulate Heavy Rain"}
            </button>
            <button className="btn btn-outline" onClick={() => simulateClaim("heat")} disabled={simulating}>
              🌡️ {simulating ? "Processing..." : "Simulate Extreme Heat"}
            </button>
          </div>
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>My Claims History</h2>
        {claims.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: 40 }}>
            <p style={{ fontSize: 32, marginBottom: 12 }}>📋</p>
            <p style={{ color: "var(--text-secondary)" }}>No claims yet. Buy a policy and simulate a disruption above!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {claims.map((c) => (
              <div key={c._id} className="card" style={{ padding: "16px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{c.triggerType}</div>
                    <div style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 4 }}>{c.triggerValue}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: 12 }}>{new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 800, color: "var(--primary)", marginBottom: 6 }}>₹{c.payoutAmount}</div>
                    <span className={`badge ${c.status === "Auto-Approved" || c.status === "Paid" ? "badge-success" : c.status === "Flagged" ? "badge-warning" : "badge-danger"}`}>
                      {c.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

