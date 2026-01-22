import React, { useState } from "react";
import StockPopup from "./StockPopup";
import "./WarehouseDashboard.css";

// Mock data
const inbound = [180, 220, 210, 260, 240, 170, 150];
const outbound = [150, 190, 180, 230, 210, 140, 120];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const stockCategories = [
  { name: "Electronics", value: 1200 },
  { name: "Furniture", value: 800 },
  { name: "Clothing", value: 2100 },
  { name: "Food", value: 1600 },
  { name: "Books", value: 2900 },
];

const WarehouseDashboard = () => {
  const [open, setOpen] = useState(false);

  const totalStock = stockCategories.reduce((a, b) => a + b.value, 0);
  const maxFlow = 300;

  return (
    <div className="dashboard-page">
      <h2>Warehouse Dashboard</h2>
      <p className="subtitle">Operations, Storage & Monitoring</p>

      {/* KPI SECTION */}
      <div className="kpi-row">
        <div className="kpi-card">
          <span>Total Stock</span>
          <h3>{totalStock}</h3>
        </div>
        <div className="kpi-card">
          <span>Low Stock Items</span>
          <h3>495</h3>
        </div>
        <div className="kpi-card">
          <span>Incoming Shipments</span>
          <h3>12</h3>
        </div>
        <div className="kpi-card">
          <span>Avg Capacity</span>
          <h3>80.5%</h3>
        </div>
      </div>

      {/* WEEKLY ACTIVITY */}
      <div className="section">
        <h4>Weekly Activity (Inbound vs Outbound)</h4>

        <div className="weekly-chart">
          {days.map((day, i) => (
            <div key={day} className="day-column">
              <div className="bar-group">
                <div
                  className="bar inbound"
                  style={{ height: `${(inbound[i] / maxFlow) * 100}%` }}
                  title={`Inbound: ${inbound[i]}`}
                />
                <div
                  className="bar outbound"
                  style={{ height: `${(outbound[i] / maxFlow) * 100}%` }}
                  title={`Outbound: ${outbound[i]}`}
                />
              </div>
              <span className="day-label">{day}</span>
            </div>
          ))}
        </div>

        <div className="legend">
          <span><i className="dot inbound" /> Inbound</span>
          <span><i className="dot outbound" /> Outbound</span>
        </div>
      </div>

      {/* STOCK DISTRIBUTION */}
      <div className="section two-col">
        <div className="card">
          <h4>Stock Distribution</h4>

          {stockCategories.map((item) => (
            <div key={item.name} className="dist-row">
              <span>{item.name}</span>
              <div className="dist-bar">
                <div
                  className="dist-fill"
                  style={{
                    width: `${((item.value / totalStock) * 100).toFixed(1)}%`,
                  }}
                />
              </div>
              <span className="percent">
                {((item.value / totalStock) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>

        {/* ENVIRONMENT */}
        <div className="card">
          <h4>Environment Monitoring</h4>

          <div className="env-box orange">
            <h5>Temperature</h5>
            <p>22°C</p>
            <span>Optimal</span>
          </div>

          <div className="env-box blue">
            <h5>Humidity</h5>
            <p>45%</p>
            <span>Optimal</span>
          </div>
        </div>
      </div>

      {/* STORAGE UTILIZATION */}
      <div className="section">
        <h4>Storage Utilization</h4>

        {[
          ["Warehouse A", 75],
          ["Warehouse B", 92],
          ["Warehouse C", 45],
          ["Warehouse D", 68],
        ].map(([name, value]) => (
          <div key={name} className="util-row">
            <span>{name}</span>
            <div className="util-bar">
              <div className="util-fill" style={{ width: `${value}%` }} />
            </div>
            <span>{value}%</span>
          </div>
        ))}
      </div>

      {/* FLOATING ACTION BUTTON */}
      <button
        className="floating-btn"
        onClick={() => setOpen(true)}
      >
        +
      </button>

      {open && <StockPopup onClose={() => setOpen(false)} />}
    </div>
  );
};

export default WarehouseDashboard;
