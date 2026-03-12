import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login({ login }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "Syne", fontSize: 28, fontWeight: 800, color: "var(--primary)" }}>Shield<span style={{ color: "var(--text-primary)" }}>Ride</span></span>
          </Link>
          <h2 style={{ marginTop: 16, fontSize: 24 }}>Welcome back</h2>
          <p style={{ color: "var(--text-secondary)", marginTop: 8 }}>Login to your account</p>
        </div>

        <div className="card">
          {error && <div className="alert alert-danger">⚠️ {error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="you@example.com"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="Your password"
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button className="btn btn-primary btn-full" type="submit" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? "Logging in..." : "Login →"}
            </button>
          </form>
          <p style={{ textAlign: "center", marginTop: 20, color: "var(--text-secondary)", fontSize: 14 }}>
            No account? <Link to="/register" style={{ color: "var(--primary)" }}>Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}