import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0A0F1E 0%, #0D1F2D 100%)" }}>
      <nav className="navbar">
        <a className="navbar-brand" href="/">Shield<span>Ride</span></a>
        <div className="nav-links">
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register"><button className="btn btn-primary">Get Started</button></Link>
        </div>
      </nav>

      <div style={{ textAlign: "center", padding: "100px 24px 60px" }}>
        <div className="badge badge-success" style={{ marginBottom: 24, fontSize: 13, padding: "6px 16px" }}>
          🛡️ India's First Parametric Income Insurance for Gig Workers
        </div>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 68px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 24, letterSpacing: "-1px" }}>
          Rain Stops You.<br />
          <span style={{ color: "var(--primary)" }}>We've Got You Covered.</span>
        </h1>
        <p style={{ fontSize: 18, color: "var(--text-secondary)", maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.7 }}>
          Automatic income protection for Zomato & Swiggy delivery partners.
          When disruptions hit — we detect it and pay you instantly. No forms. No calls. No wait.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/register"><button className="btn btn-primary" style={{ fontSize: 16, padding: "14px 32px" }}>Start Free →</button></Link>
          <Link to="/login"><button className="btn btn-outline" style={{ fontSize: 16, padding: "14px 32px" }}>Login</button></Link>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24, maxWidth: 1000, margin: "0 auto", padding: "0 24px 80px" }}>
        {[
          { icon: "⚡", title: "Auto Claims", desc: "Weather triggers detected automatically. Claims initiated without any action from you." },
          { icon: "🛡️", title: "Weekly Coverage", desc: "Pay as low as ₹29/week. Cancel anytime. No long term commitment needed." },
          { icon: "💸", title: "Instant Payout", desc: "Money hits your UPI account within minutes of a disruption being detected." },
          { icon: "🤖", title: "AI Pricing", desc: "Premium calculated based on your city's risk score. Fair, transparent, personalised." },
        ].map((f) => (
          <div key={f.title} className="card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>{f.icon}</div>
            <h3 style={{ marginBottom: 8, fontSize: 18 }}>{f.title}</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}