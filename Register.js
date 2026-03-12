import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register({ login }) {
  const [form, setForm] = useState({
    name: "", phone: "", email: "", password: "",
    city: "Bangalore", zone: "", platform: "Swiggy",
    avgWeeklyEarnings: "", workHoursPerDay: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form);
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    }
    setLoading(false);
  };

  const update = (field, value) => setForm({ ...form, [field]: value });

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 520 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "Syne", fontSize: 28, fontWeight: 800, color: "var(--primary)" }}>Shield<span style={{ color: "var(--text-primary)" }}>Ride</span></span>
          </Link>
          <h2 style={{ marginTop: 16, fontSize: 24 }}>Create your account</h2>
          <p style={{ color: "var(--text-secondary)", marginTop: 8 }}>Get protected in under 2 minutes</p>
        </div>

        <div className="card">
          {error && <div className="alert alert-danger">⚠️ {error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" placeholder="Raju Kumar" value={form.name} onChange={(e) => update("name", e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" placeholder="9876543210" value={form.phone} onChange={(e) => update("phone", e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => update("email", e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="Create a password" value={form.password} onChange={(e) => update("password", e.target.value)} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">City</label>
                <select className="form-select" value={form.city} onChange={(e) => update("city", e.target.value)}>
                  {["Bangalore", "Mumbai", "Delhi", "Hyderabad", "Chennai"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Platform</label>
                <select className="form-select" value={form.platform} onChange={(e) => update("platform", e.target.value)}>
                  {["Swiggy", "Zomato", "Both"].map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Delivery Zone / Area</label>
              <input className="form-input" placeholder="e.g. Indiranagar, HSR Layout" value={form.zone} onChange={(e) => update("zone", e.target.value)} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Avg Weekly Earnings (₹)</label>
                <input className="form-input" type="number" placeholder="5000" value={form.avgWeeklyEarnings} onChange={(e) => update("avgWeeklyEarnings", e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Work Hours / Day</label>
                <input className="form-input" type="number" placeholder="8" value={form.workHoursPerDay} onChange={(e) => update("workHoursPerDay", e.target.value)} required />
              </div>
            </div>
            <button className="btn btn-primary btn-full" type="submit" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? "Creating account..." : "Create Account & Get Protected →"}
            </button>
          </form>
          <p style={{ textAlign: "center", marginTop: 20, color: "var(--text-secondary)", fontSize: 14 }}>
            Already have an account? <Link to="/login" style={{ color: "var(--primary)" }}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}