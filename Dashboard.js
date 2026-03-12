import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard({ user, logout }) {
  const [stats, setStats] = useState({ totalPayout: 0, totalClaims: 0, approvedClaims: 0 });
  const [policy, setPolicy] = useState(null);
  const [weather, setWeather] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("shieldride_token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get("http://localhost:5000/api/claims/stats", { headers }).then((r) => setStats(r.data)).catch(() => {});
    axios.get("http://localhost:5000/api/policy/my", { headers }).then((r) => setPolicy(r.data[0] || null)).catch(() => {});
    axios.get(`http://localhost:5000/api/weather/check?city=${user.city}`, { headers }).then((r) => setWeather(r.data)).catch(() => {});
  }, []);

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

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>Hey, {user.name?.split(" ")[0]} 👋</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: 4 }}>{user.city} • Risk Score: <span style={{ color: user.riskScore > 70 ? "var(--danger)" : "var(--primary)" }}>{user.riskScore}/100</span></p>
        </div>

        {weather && (
          <div className={`alert ${weather.disruption ? "alert-danger" : "alert-success"}`} style={{ marginBottom: 24 }}>
            {weather.disruption ? "⚠️ Disruption detected in your area! Claim being processed..." : `✅ Weather clear in ${weather.city} — ${weather.description}, ${weather.temperature}°C`}
          </div>
        )}

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Payout Received</div>
            <div className="stat-value">₹{stats.totalPayout.toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Claims</div>
            <div className="stat-value">{stats.totalClaims}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Approved Claims</div>
            <div className="stat-value">{stats.approvedClaims}</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div className="card">
            <h3 style={{ marginBottom: 16, fontSize: 18 }}>🛡️ Active Policy</h3>
            {policy ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ color: "var(--text-secondary)" }}>Tier</span>
                  <span className="badge badge-success">{policy.tier}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ color: "var(--text-secondary)" }}>Weekly Premium</span>
                  <span style={{ fontWeight: 600 }}>₹{policy.weeklyPremium}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                  <span style={{ color: "var(--text-secondary)" }}>Max Daily Payout</span>
                  <span style={{ fontWeight: 600, color: "var(--primary)" }}>₹{policy.maxDailyPayout}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Status</span>
                  <span className={`badge ${policy.status === "Active" ? "badge-success" : "badge-warning"}`}>{policy.status}</span>
                </div>
              </>
            ) : (
              <>
                <p style={{ color: "var(--text-secondary)", marginBottom: 16 }}>No active policy. Get covered now!</p>
                <Link to="/policy"><button className="btn btn-primary btn-full">Get Coverage →</button></Link>
              </>
            )}
          </div>

          <div className="card">
            <h3 style={{ marginBottom: 16, fontSize: 18 }}>⚡ Quick Actions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Link to="/policy"><button className="btn btn-primary btn-full">🛡️ {policy ? "Renew Policy" : "Buy Coverage"}</button></Link>
              <Link to="/claims"><button className="btn btn-outline btn-full">📋 View My Claims</button></Link>
            </div>
            <div style={{ marginTop: 20, padding: 16, background: "var(--dark)", borderRadius: 12 }}>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                🌧️ Disruption trigger: Rain &gt; 25mm/hr<br />
                🌡️ Heat trigger: Temp &gt; 44°C<br />
                💨 Pollution trigger: AQI &gt; 400
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}