import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleMap, Marker, InfoWindow, LoadScript } from "@react-google-maps/api";
import "./idleVehicles.css";

const idleVehicles = [
  {
    id: "FL-4029",
    driver: "Ravi Kumar",
    phone: "+91 98765 43210",
    idleMins: 45,
    position: { lat: 13.0827, lng: 80.2707 },
  },
  {
    id: "FL-1183",
    driver: "Suresh",
    phone: "+91 91234 56789",
    idleMins: 12,
    position: { lat: 13.0674, lng: 80.2376 },
  },
  {
    id: "FL-8891",
    driver: "Manoj",
    phone: "+91 99887 66554",
    idleMins: 6,
    position: { lat: 13.05, lng: 80.2121 },
  },
];

export default function IdleVehicles() {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ IMPORTANT
  const [selected, setSelected] = useState(idleVehicles[0]);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-container">
      {/* HEADER */}
      <header className="header">
        <div className="logo-section">
          <h1 className="logo">RESILION</h1>
          <span className="tagline">Intelligent | Adaptive | Resilient</span>
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
          idle Vehicles
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
      <div className="idle-content">
        {/* LEFT PANEL */}
        <aside className="idle-list">
          <h2>idle Vehicles</h2>
          <input placeholder="Search fleet ID or driver..." />

          <div className="list-scroll">
            {idleVehicles.map((v) => (
              <div
                key={v.id}
                className={`vehicle-card ${
                  selected.id === v.id ? "selected" : ""
                }`}
                onClick={() => setSelected(v)}
              >
                🚚
                <div>
                  <strong>{v.id}</strong>
                  <p>{v.driver}</p>
                </div>
                <span className="badge">{v.idleMins}m</span>
              </div>
            ))}
          </div>
        </aside>

        {/* MAP PANEL */}
        <section className="map-section">
          <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={selected.position}
              zoom={12}
            >
              {idleVehicles.map((v) => (
                <Marker
                  key={v.id}
                  position={v.position}
                  onClick={() => setSelected(v)}
                />
              ))}

              <InfoWindow position={selected.position}>
                <div className="info-card">
                  <h4>{selected.driver}</h4>
                  <p>{selected.phone}</p>
                  <span>idle for {selected.idleMins} mins</span>
                </div>
              </InfoWindow>
            </GoogleMap>
          </LoadScript>
        </section>
      </div>
    </div>
  );
}
