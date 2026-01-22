import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        body {
          margin: 0;
          font-family: "Inter", Arial, sans-serif;
          background: radial-gradient(
            circle at top,
            #1b0030,
            #090012 70%
          );
          color: #f5f5f5;
        }

        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 60px;
          background: linear-gradient(
            90deg,
            rgba(118,0,188,0.35),
            rgba(138,0,194,0.35)
          );
          backdrop-filter: blur(10px);
        }

        .logo {
          font-size: 18px;
          font-weight: 700;
        }

        .logo span {
          background: linear-gradient(135deg, #7600bc, #8a00c2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .btn {
          background: linear-gradient(135deg, #7600bc, #8a00c2);
          border: none;
          color: white;
          padding: 12px 22px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(118,0,188,0.35);
        }

        .hero {
          text-align: center;
          padding: 110px 20px;
          background: radial-gradient(
            circle at center,
            rgba(118,0,188,0.35),
            transparent 65%
          );
        }

        h1 {
          font-size: 56px;
          line-height: 1.15;
          margin-bottom: 24px;
        }

        .gradient-text {
          background: linear-gradient(135deg, #7600bc, #00e0c6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero p {
          max-width: 720px;
          margin: 0 auto 40px;
          color: #cfcfcf;
          font-size: 18px;
          line-height: 1.6;
        }

        .features {
          padding: 90px 70px;
          text-align: center;
        }

        .features h2 {
          font-size: 38px;
          margin-bottom: 16px;
        }

        .features p {
          color: #bdbdbd;
          margin-bottom: 60px;
          font-size: 16px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }

        .card {
          padding: 28px;
          border-radius: 18px;
          background: linear-gradient(
            160deg,
            rgba(118,0,188,0.25),
            rgba(138,0,194,0.15)
          );
          border: 1px solid rgba(255,255,255,0.12);
          text-align: left;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(118,0,188,0.45);
        }

        .card h3 {
          margin: 15px 0 10px 0;
          font-size: 22px;
        }

        .card p {
          color: #cfcfcf;
          line-height: 1.5;
          margin: 0;
        }

        .cta {
          padding: 100px 20px;
          text-align: center;
          background: radial-gradient(
            circle at center,
            rgba(138,0,194,0.35),
            transparent 65%
          );
        }

        .badge {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 999px;
          background: rgba(118,0,188,0.25);
          color: #e0c7ff;
          margin-bottom: 24px;
          font-size: 14px;
          font-weight: 500;
        }

        @media (max-width: 1024px) {
          .grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          h1 {
            font-size: 48px;
          }
          
          .features {
            padding: 70px 40px;
          }
        }

        @media (max-width: 640px) {
          .grid {
            grid-template-columns: 1fr;
          }
          
          .navbar {
            padding: 20px 30px;
          }
          
          h1 {
            font-size: 36px;
          }
          
          .hero {
            padding: 80px 20px;
          }
          
          .features {
            padding: 60px 20px;
          }
          
          .cta {
            padding: 70px 20px;
          }
        }
      `}</style>

      {/* Navbar - Note: Navigation path changed to "/roles" as in present code */}
      <div className="navbar">
        <div className="logo">
          🚚 <span>RESILION</span>
        </div>
        <button className="btn" onClick={() => navigate("/roles")}>
          Get Started
        </button>
      </div>

      {/* Hero */}
      <section className="hero">
        <div className="badge">
          ⚡ AI-Powered Supply Chain Intelligence
        </div>

        <h1>
          Resilient <span className="gradient-text">Global Supply Chain</span>
          <br /> Management Platform
        </h1>

        <p>
          Predict disruptions, dynamically adapt routes, switch suppliers,
          and optimize warehouses with AI-driven intelligence.
        </p>

        <button className="btn" onClick={() => navigate("/roles")}>
          Get Started
        </button>
      </section>

      {/* Features */}
      <section className="features">
        <h2>
          Built for <span className="gradient-text">Resilience</span>
        </h2>
        <p>Every feature is designed to predict, prevent, and adapt</p>

        <div className="grid">
          {features.map((f, i) => (
            <div className="card" key={i}>
              <div style={{ fontSize: 30 }}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>
          Ready to Build{" "}
          <span className="gradient-text">Resilient Supply Chains</span>?
        </h2>
        <button className="btn" onClick={() => navigate("/roles")}>
          Get Started
        </button>
      </section>
    </>
  );
}

const features = [
  { icon: "📦", title: "Live Shipment Tracking", desc: "Real-time GPS tracking with ETA predictions." },
  { icon: "🛡️", title: "AI Risk Prediction", desc: "Predict disruptions using AI signals." },
  { icon: "🧠", title: "Decision Engine", desc: "AI-recommended supply chain decisions." },
  { icon: "🧪", title: "Scenario Simulation", desc: "Test decisions before execution." },
  { icon: "🏭", title: "Warehouse Intelligence", desc: "Smart warehouse selection." },
  { icon: "📡", title: "IoT Sensor Integration", desc: "Live sensor monitoring & anomaly detection." }
];