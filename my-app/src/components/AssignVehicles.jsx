import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./AssignVehicles.css";

/* MOCK DATA */
const pendingRequests = [
  { id: "#REQ-1045", priority: "HIGH", pickup: "Chennai", drop: "Logistics Hub", load: 120, goods: "Electronics" },
  { id: "#REQ-1046", priority: "NORMAL", pickup: "Bangalore", drop: "Logistics Hub", load: 95, goods: "Textiles" },
  { id: "#REQ-1047", priority: "NORMAL", pickup: "Trichy", drop: "Logistics Hub", load: 110, goods: "Perishables" },
  { id: "#REQ-1048", priority: "HIGH", pickup: "Salem", drop: "Logistics Hub", load: 110, goods: "Machinery" },
];

const vehicle = {
  name: "Volvo FH16",
  id: "V-402",
  desc: "Heavy Transport B7 Euro 6",
  driver: "Arjun Rao",
  phone: "+91 98765 11122",
  capacity: 500,
};

export default function AssignVehicles() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selected, setSelected] = useState([]);
  const [success, setSuccess] = useState(false);

  const isActive = (path) => location.pathname === path;

  const toggle = (req) => {
    setSelected((prev) =>
      prev.includes(req) ? prev.filter((r) => r !== req) : [...prev, req]
    );
  };

  const totalLoad = selected.reduce((sum, r) => sum + r.load, 0);
  const utilization = Math.round((totalLoad / vehicle.capacity) * 100);

  return (
    <div className="admin-container">
      {/* HEADER */}
      <header className="header">
        <div className="logo-section">
          <h1 className="logo">RESILION</h1>
          <span className="tagline">Intelligent | Adaptive | Resilient</span>
        </div>
        <div className="profile-section">🔍 🔔 ⚙️ 👤</div>
      </header>

      {/* NAVIGATION */}
      <nav className="nav-bar">
        <button
          className={`nav-btn ${isActive("/admin-dashboard") ? "active" : ""}`}
          onClick={() => navigate("/admin-dashboard")}
        >
          Dashboard
        </button>

        <button
          className={`nav-btn ${isActive("/idle-vehicles") ? "active" : ""}`}
          onClick={() => navigate("/idle-vehicles")}
        >
          Idle Vehicles
        </button>

        <button
          className={`nav-btn ${isActive("/assign-vehicles") ? "active" : ""}`}
          onClick={() => navigate("/assign-vehicles")}
        >
          Vehicle Assignment
        </button>

        <button
          className={`nav-btn ${isActive("/emission-calculator") ? "active" : ""}`}
          onClick={() => navigate("/emission-calculator")}
        >
          CO₂ Calculator
        </button>

        <button
          className={`nav-btn ${isActive("/reports") ? "active" : ""}`}
          onClick={() => navigate("/reports")}
        >
          Reports
        </button>

        <button
          className={`nav-btn ${isActive("/Driver Assignment") ? "active" : ""}`}
          onClick={() => navigate("/Driver Assignment")}
        >
          Driver Assignment
        </button>
      </nav>

      {/* CONTENT */}
      <main className="assign-container">
        <section className="panel">
          <h2>Assign Vehicles</h2>
          <p className="subtitle">Consolidate pending transport requests</p>

          <div className="request-list">
            {pendingRequests.map((r) => (
              <div
                key={r.id}
                className={`request-card ${selected.includes(r) ? "selected" : ""}`}
                onClick={() => toggle(r)}
              >
                <div className="req-top">
                  <strong>{r.id}</strong>
                  <span className={`priority ${r.priority === "HIGH" ? "high" : "normal"}`}>
                    {r.priority}
                  </span>
                </div>
                <p>Pickup: {r.pickup}</p>
                <p>Drop: {r.drop}</p>
                <p>Load: {r.load} kg</p>
                <p>Goods: {r.goods}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2>Consolidated Request Panel</h2>

          <div className="vehicle-card">
            🚚
            <div>
              <strong>{vehicle.name} (ID: {vehicle.id})</strong>
              <p>{vehicle.desc}</p>
            </div>
            <div className="driver">
              {vehicle.driver}<br />📞 {vehicle.phone}
            </div>
          </div>

          <div className="load-bar">
            <div className="load-fill" style={{ width: `${utilization || 0}%` }} />
          </div>

          <div className="summary">
            <div><strong>{selected.length}</strong><span>Requests</span></div>
            <div><strong>{totalLoad}kg</strong><span>Total Load</span></div>
            <div><strong>{utilization || 0}%</strong><span>Utilization</span></div>
          </div>

          <button
            className="primary-btn"
            disabled={!selected.length}
            onClick={() => setSuccess(true)}
          >
            Consolidate Requests
          </button>
        </section>
      </main>

      {success && (
        <div className="overlay">
          <div className="success-card">
            <div className="tick">✔</div>
            <h2>Consolidation Successful !!!</h2>
            <p>Requests merged and vehicle assigned</p>
            <button onClick={() => setSuccess(false)}>Done</button>
          </div>
        </div>
      )}
    </div>
  );
}
