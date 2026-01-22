import React, { useState } from "react";
import "./EmissionCalculator.css";

export default function EmissionCalculator() {
  const [showProfile, setShowProfile] = useState(false);

  /* ---------------- MOCK DATA ---------------- */

  const metrics = [
    {
      title: "Optimized Route Distance",
      value: "1,245 km",
      sub: "+12% shorter vs baseline routes",
    },
    {
      title: "Emission Factor",
      value: "0.18 kg CO₂ / km",
      sub: "Average per km across active fleet",
    },
    {
      title: "Vehicle Load",
      value: "8.2 tons",
      sub: "82% of capacity",
    },
    {
      title: "Total CO₂ Emissions",
      value: "2,430 kg CO₂",
      sub: "+2.4% vs target this period",
    },
    {
      title: "Carbon Credits Earned",
      value: "145",
      sub: "Based on reduced emissions",
    },
  ];

  const utilization = [
    { id: "V-01", value: 60 },
    { id: "V-02", value: 80 },
    { id: "V-03", value: 45 },
    { id: "V-04", value: 90, best: true },
    { id: "V-05", value: 70 },
  ];

  const routes = [
    {
      id: "RT-2023-089",
      distance: 452.5,
      load: 12.4,
      emissions: 89.2,
      savings: "14.2%",
      status: "High savings",
    },
    {
      id: "RT-2023-104",
      distance: 680.2,
      load: 18.5,
      emissions: 142.1,
      savings: "0.0%",
      status: "Standard",
    },
  ];

  return (
    <>
      {/* ===== TOP HEADER ===== */}
      <div className="top-header">
        <div className="brand">
          <h1>RESILION</h1>
          <span>Intelligent | Adaptive | Resilient</span>
        </div>

        <div className="top-icons">
          <span>🔔</span>
          <span>⚙️</span>

          <div className="profile-wrapper">
            <div
              className="avatar"
              onClick={() => setShowProfile(!showProfile)}
            >
              A
            </div>

            {showProfile && (
              <div className="profile-dropdown">
                <div className="profile-preview">Admin</div>
                <button>Profile</button>
                <button>Settings</button>
                <button className="logout">Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== NAV PILLS ===== */}
      <div className="nav-pills">
        <button>Dashboard</button>
        <button>Idle Vehicles</button>
        <button>Vehicle Assignment</button>
        <button className="active">Co2 Calculator</button>
        <button>Reports</button>
        <button>Driver Assignment</button>
      </div>

      {/* ===== PAGE CONTENT ===== */}
      <div className="ec-page">
        {/* OVERVIEW */}
        <section className="ec-overview">
          <h2>Overview</h2>
          <p>Fleet efficiency, emissions, and utilization at a glance.</p>
        </section>

        {/* METRICS */}
        <section className="ec-metrics">
          {metrics.map((m, i) => (
            <div className="metric-card" key={i}>
              <span>{m.title}</span>
              <h3>{m.value}</h3>
              <p>{m.sub}</p>
            </div>
          ))}
        </section>

        {/* CHARTS */}
        <section className="ec-charts">
          <div className="chart-card wide">
            <h3>Emissions Over Time</h3>
            <div className="mock-line-chart">
              <span className="baseline" />
              <span className="optimized" />
            </div>
            <div className="legend">
              <span className="dot baseline-dot" /> Baseline
              <span className="dot optimized-dot" /> Optimized
            </div>
          </div>

          <div className="chart-card">
            <h3>Vehicle Utilization</h3>
            <div className="bar-chart">
              {utilization.map((v) => (
                <div key={v.id} className="bar-group">
                  <div
                    className={`bar ${v.best ? "best" : ""}`}
                    style={{ height: `${v.value}%` }}
                  />
                  <span>{v.id}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TABLE */}
        <section className="ec-table">
          <div className="table-header">
            <h3>Route Optimization Insights</h3>
            <button className="export-btn">Export CSV</button>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Route ID</th>
                  <th>Distance</th>
                  <th>Load</th>
                  <th>Emissions</th>
                  <th>Savings</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {routes.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.distance}</td>
                    <td>{r.load}</td>
                    <td>{r.emissions}</td>
                    <td className="green">{r.savings}</td>
                    <td>
                      <span
                        className={`badge ${r.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
