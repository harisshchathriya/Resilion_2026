import React from "react";
import "./Reports.css";

const mockReports = [
  {
    driver: "Arun",
    vehicle: "RS201",
    route: "Trichy → Chennai",
    distance: "300 km",
    time: "03:20",
    idle: "00:10",
    co2: 2.4,
    status: "On Time",
  },
  {
    driver: "Karthik",
    vehicle: "RS305",
    route: "Salem → Madurai",
    distance: "280 km",
    time: "03:50",
    idle: "00:35",
    co2: 2.9,
    status: "Idle",
  },
  {
    driver: "Ravi",
    vehicle: "RS412",
    route: "Erode → Coimbatore",
    distance: "120 km",
    time: "02:10",
    idle: "00:45",
    co2: 1.6,
    status: "Delayed",
  },
  {
    driver: "Suresh",
    vehicle: "RS518",
    route: "Trichy → Salem",
    distance: "190 km",
    time: "02:45",
    idle: "00:05",
    co2: 1.9,
    status: "On Time",
  },
];

const carbonTrend = [2.1, 2.4, 2.0, 2.6, 2.3, 2.8, 2.5];

const Reports = () => {
  const exportCSV = () => {
    const headers = Object.keys(mockReports[0]).join(",");
    const rows = mockReports.map(row => Object.values(row).join(",")).join("\n");
    const csv = `${headers}\n${rows}`;

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "resilion_reports.csv";
    link.click();
  };

  return (
    <>
      {/* ===== TOP HEADER ===== */}
      <div className="top-header">
        <div className="brand">
          <h1>RESILION</h1>
          <span>Intelligent | Adaptive | Resilient</span>
        </div>

        <div className="top-icons">
          <span>🔍</span>
          <span>🔔</span>
          <span>⚙️</span>
          <span>👤</span>
        </div>
      </div>

      {/* ===== NAV PILLS ===== */}
      <div className="nav-pills">
        <button>Dashboard</button>
        <button>Idle Vehicles</button>
        <button>Vehicle Assignment</button>
        <button>CO₂ Calculator</button>
        <button className="active">Reports</button>
        <button>Driver Assignment</button>
      </div>

      {/* ===== REPORTS CONTENT ===== */}
      <div className="reports">
        <h2>Reports</h2>
        <p className="subtitle">
          Operational, Sustainability & Resilience Insights
        </p>

        {/* KPI */}
        <div className="kpis">
          <div className="kpi"><span>Total Trips</span><h3>{mockReports.length}</h3></div>
          <div className="kpi"><span>On-Time</span><h3>{mockReports.filter(r => r.status === "On Time").length}</h3></div>
          <div className="kpi"><span>Delayed</span><h3>{mockReports.filter(r => r.status === "Delayed").length}</h3></div>
          <div className="kpi"><span>Avg CO₂</span><h3>2.3 T</h3></div>
        </div>

        {/* TABLE */}
        <div className="table-box">
          <table>
            <thead>
              <tr>
                <th>Driver</th>
                <th>Vehicle</th>
                <th>Route</th>
                <th>Distance</th>
                <th>Time</th>
                <th>Idle</th>
                <th>CO₂</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockReports.map((r, i) => (
                <tr key={i}>
                  <td>{r.driver}</td>
                  <td>{r.vehicle}</td>
                  <td>{r.route}</td>
                  <td>{r.distance}</td>
                  <td>{r.time}</td>
                  <td>{r.idle}</td>
                  <td>{r.co2} T</td>
                  <td>
                    <span className={`status ${
                      r.status === "On Time" ? "green" :
                      r.status === "Idle" ? "yellow" : "red"
                    }`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="actions">
            <button onClick={exportCSV}>Export CSV</button>
            <button>Export PDF</button>
            <button>Schedule Report</button>
            <button>Save Template</button>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="bottom">
          <div className="card">
            <span>Idle Vehicle Cost</span>
            <h3>$8,250</h3>
          </div>

          <div className="card">
            <span>Route Deviations</span>
            <h3>18</h3>
          </div>

          <div className="card">
            <span>Carbon Emission Trend</span>
            <svg viewBox="0 0 200 80" className="chart-svg">
              <polyline
                fill="none"
                stroke="#6a00ff"
                strokeWidth="3"
                points={carbonTrend.map((v, i) => `${i * 30},${80 - v * 20}`).join(" ")}
              />
            </svg>
          </div>

          <div className="card">
            <span>Resilience Score</span>
            <h3>82</h3>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reports;
