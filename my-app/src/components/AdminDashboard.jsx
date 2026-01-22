import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./AdminDashboard.css";

/* ---------------- MOCK DATA ---------------- */
const activeShipments = [
  { id: "SHP-101", location: "Chennai", eta: "Today 6:30 PM", status: "In-Transit" },
  { id: "SHP-102", location: "Bangalore", eta: "Tomorrow 9:00 AM", status: "Delayed" },
  { id: "SHP-103", location: "Trichy", eta: "Delivered", status: "Delivered" },
];

const vehicles = [
  { id: "VH-01", name: "Ashok Leyland", capacity: "12 Tons", goods: "Electronics", driver: "Ravi Kumar", status: "Active" },
  { id: "VH-02", name: "Tata Ace", capacity: "2 Tons", goods: "FMCG", driver: "Suresh", status: "Idle" },
  { id: "VH-03", name: "Eicher Pro", capacity: "8 Tons", goods: "Machinery", driver: "Manoj", status: "Maintenance" },
];

const inboundShipments = [
  { id: "IN-201", supplier: "ABC Pvt Ltd", items: "Steel Rods", time: "11:30 AM", status: "On Route" },
  { id: "IN-202", supplier: "XYZ Corp", items: "Auto Parts", time: "2:00 PM", status: "Arrived" },
];

const outboundShipments = [
  { id: "OUT-301", supplier: "Retail Hub", items: "Consumer Goods", time: "4:00 PM", status: "Dispatched" },
  { id: "OUT-302", supplier: "Warehouse B", items: "Medical Supplies", time: "6:30 PM", status: "Pending" },
];

export default function AdminDashboard() {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    // Add logout logic here
    navigate("/roles");
  };

  return (
    <div className="admin-container">
      {/* HEADER */}
      <header className="header">
        <div className="logo-section">
          <h1 className="logo">RESILION</h1>
          <span className="tagline">Intelligent | Adaptive | Resilient</span>
        </div>

        <div className="profile-section">
          <div
            className="profile-icon"
            onClick={() => setShowMenu(!showMenu)}
          >
            👤
          </div>
          {showMenu && (
            <div className="profile-dropdown">
              <img
                src="https://i.pravatar.cc/100"
                alt="profile"
                className="avatar"
              />
              <ul>
                <li>Profile</li>
                <li>Settings</li>
                <li className="logout" onClick={handleLogout}>Logout</li>
              </ul>
            </div>
          )}
        </div>
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
          className={`nav-btn ${isActive("/driver-assignment") ? "active" : ""}`}
          onClick={() => navigate("/driver-assignment")}
        >
          Driver Assignment
        </button>
      </nav>

      {/* MAIN CONTENT */}
      <main className="dashboard">
        <div className="welcome-section">
          <h1>Admin Dashboard</h1>
          <p className="subtitle">Manage your logistics operations efficiently</p>
        </div>

        <section className="card">
          <div className="card-header">
            <h2>Active Shipments</h2>
            <span className="badge count-badge">{activeShipments.length}</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Location</th>
                <th>ETA</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {activeShipments.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.location}</td>
                  <td>{s.eta}</td>
                  <td>
                    <span className={`badge ${s.status.toLowerCase()}`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="card">
          <div className="card-header">
            <h2>Vehicle Management</h2>
            <span className="badge count-badge">{vehicles.length}</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Capacity</th>
                <th>Goods</th>
                <th>Driver</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id}>
                  <td>{v.id}</td>
                  <td>{v.name}</td>
                  <td>{v.capacity}</td>
                  <td>{v.goods}</td>
                  <td>{v.driver}</td>
                  <td>
                    <span className={`badge ${v.status.toLowerCase()}`}>
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="split">
          <div className="card">
            <div className="card-header">
              <h2>Inbound Shipments</h2>
              <span className="badge count-badge blue">{inboundShipments.length}</span>
            </div>
            <table>
              <tbody>
                {inboundShipments.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.supplier}</td>
                    <td>{s.items}</td>
                    <td>{s.time}</td>
                    <td>
                      <span className={`badge ${s.status.toLowerCase().replace(' ', '-')}`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card">
            <div className="card-header">
              <h2>Outbound Shipments</h2>
              <span className="badge count-badge orange">{outboundShipments.length}</span>
            </div>
            <table>
              <tbody>
                {outboundShipments.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.supplier}</td>
                    <td>{s.items}</td>
                    <td>{s.time}</td>
                    <td>
                      <span className={`badge ${s.status.toLowerCase()}`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="quick-stats">
          <div className="stat-card">
            <h3>Total Vehicles</h3>
            <p className="stat-number">{vehicles.length}</p>
            <span className="stat-label">Active: 1 | Idle: 1 | Maintenance: 1</span>
          </div>
          <div className="stat-card">
            <h3>Total Shipments</h3>
            <p className="stat-number">{activeShipments.length + inboundShipments.length + outboundShipments.length}</p>
            <span className="stat-label">Active: 3 | Inbound: 2 | Outbound: 2</span>
          </div>
          <div className="stat-card">
            <h3>System Status</h3>
            <p className="stat-number status-good">Operational</p>
            <span className="stat-label">All systems running</span>
          </div>
        </section>
      </main>
    </div>
  );
}