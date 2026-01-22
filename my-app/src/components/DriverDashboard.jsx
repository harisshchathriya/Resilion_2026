import { useEffect, useState } from "react";
import "./DriverDashboard.css";
import AdvancedMap from "../components/Map";


export default function DriverDashboard() {
  const [position, setPosition] = useState({ lat: 12.91, lng: 80.22 });
  const [activeWarehouse, setActiveWarehouse] = useState(null);
  const [rerouteAlert, setRerouteAlert] = useState(true);
  const [weather, setWeather] = useState({
    condition: "Heavy Rain",
    temp: "28°C",
    severity: "Moderate Alert"
  });
  const [riskZones, setRiskZones] = useState([
    { type: "theft", name: "Theft‑Prone Area", level: "High Risk", active: true },
    { type: "danger", name: "Accident Zone", level: "Medium Risk", active: false }
  ]);

  const driver = {
    name: "Harissh",
    id: "DRV-2048",
    vehicle: "TN-09-AX-4582",
    shipmentCount: 3,
    status: "On Trip",
    contact: "+91 98765 43210"
  };

  const shipments = [
    {
      id: "ORD-001",
      cargo: "Electronics",
      destination: "Bengaluru Hub",
      capacity: 80,
      available: 20,
    },
    {
      id: "ORD-002",
      cargo: "Perishable",
      destination: "Hosur Cold Storage",
      capacity: 60,
      available: 15,
    },
    {
      id: "ORD-003",
      cargo: "General Goods",
      destination: "Salem Warehouse",
      capacity: 90,
      available: 40,
    },
  ];

  const [warehouses, setWarehouses] = useState([
    { 
      id: 1, 
      name: "Chennai Central WH", 
      type: "Electronics", 
      capacity: 80, 
      distance: "3.2 km",
      lat: 12.92,
      lng: 80.23
    },
    { 
      id: 2, 
      name: "Guindy Cold Storage", 
      type: "Perishable", 
      capacity: 35, 
      distance: "5.1 km",
      lat: 12.90,
      lng: 80.21
    },
    { 
      id: 3, 
      name: "Sriperumbudur Hub", 
      type: "General", 
      capacity: 10, 
      distance: "8.7 km",
      lat: 12.89,
      lng: 80.25
    },
    { 
      id: 4, 
      name: "Ambattur Logistics", 
      type: "Electronics", 
      capacity: 65, 
      distance: "6.5 km",
      lat: 12.93,
      lng: 80.20
    },
  ]);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setPosition(p => ({ 
        lat: p.lat + 0.0001,
        lng: p.lng + 0.00005 
      }));
      
      // Update warehouse capacities dynamically
      setWarehouses(prev => prev.map(w => ({
        ...w,
        capacity: Math.max(5, Math.min(95, w.capacity + (Math.random() - 0.5) * 10))
      })));
      
      // Sort by distance and capacity
      setWarehouses(prev => 
        [...prev].sort((a, b) => {
          const distA = parseFloat(a.distance);
          const distB = parseFloat(b.distance);
          return distA - distB || b.capacity - a.capacity;
        })
      );
      
      // Update risk zones
      setRiskZones(prev => prev.map(zone => ({
        ...zone,
        active: Math.random() > 0.7 ? !zone.active : zone.active
      })));
      
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const handleReroute = () => {
    setRerouteAlert(false);
    // Add reroute logic here
  };

  const handleWarehouseClick = (warehouse) => {
    setActiveWarehouse(warehouse.id);
    // Add navigation logic here
  };

  const getWarehouseColor = (capacity) => {
    if (capacity >= 50) return "warehouse-green";
    if (capacity >= 20) return "warehouse-yellow";
    return "warehouse-red";
  };

  return (
    <div className="driver-dashboard">
      {/* HEADER SECTION */}
      <div className="dashboard-header">
        <div className="driver-profile-card">
          <div className="driver-avatar">
            <div className="avatar-circle">H</div>
            <div className="status-indicator"></div>
          </div>
          <div className="driver-info">
            <h1>Welcome back, <span className="gradient-text">{driver.name}</span> 👋</h1>
            <div className="driver-meta-grid">
              <div className="meta-item">
                <span className="meta-label">🆔 Driver ID</span>
                <span className="meta-value">{driver.id}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">🚚 Vehicle</span>
                <span className="meta-value">{driver.vehicle}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">📦 Shipments</span>
                <span className="meta-value">{driver.shipmentCount} Active</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">📱 Contact</span>
                <span className="meta-value">{driver.contact}</span>
              </div>
            </div>
          </div>
          <div className="status-badge">
            <div className="pulse-dot"></div>
            <span>{driver.status}</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="main-content-grid">
        
        {/* LEFT COLUMN */}
        <div className="left-column">
          {/* SHIPMENTS CARD */}
          <div className="dashboard-card shipments-card">
            <div className="card-header">
              <h3>📦 Active Shipments</h3>
              <span className="card-badge">{shipments.length}</span>
            </div>
            <div className="shipments-list">
              {shipments.map((s, i) => (
                <div key={i} className="shipment-item">
                  <div className="shipment-header">
                    <div className="shipment-id">{s.id}</div>
                    <div className={`cargo-tag ${s.cargo.toLowerCase().replace(/\s/g, '-')}`}>
                      {s.cargo}
                    </div>
                  </div>
                  <div className="shipment-destination">
                    <span className="destination-icon">📍</span>
                    <span>{s.destination}</span>
                  </div>
                  <div className="capacity-meter">
                    <div className="capacity-labels">
                      <span>Available: {s.available}%</span>
                      <span>Total: {s.capacity}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${(s.available / s.capacity) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="shipment-actions">
                    <button className="action-btn view-btn">View Details</button>
                    <button className="action-btn contact-btn">Contact</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RISK & WEATHER CARDS */}
          <div className="alert-cards-grid">
            <div className={`dashboard-card weather-card ${weather.severity.toLowerCase().includes('moderate') ? 'blue' : ''}`}>
              <div className="weather-icon">🌦️</div>
              <div className="weather-content">
                <h4>Weather Update</h4>
                <div className="weather-details">
                  <span className="weather-condition">{weather.condition}</span>
                  <span className="weather-temp">{weather.temp}</span>
                </div>
                <div className={`alert-badge ${weather.severity.toLowerCase().includes('moderate') ? 'blue' : ''}`}>
                  {weather.severity}
                </div>
              </div>
            </div>

            <div className="dashboard-card risk-zones-card">
              <h4>⚠️ Risk Zones</h4>
              <div className="risk-zones-list">
                {riskZones.map((zone, i) => (
                  <div 
                    key={i} 
                    className={`risk-zone-item ${zone.type} ${zone.active ? 'active' : ''}`}
                  >
                    <div className="risk-icon">
                      {zone.type === 'theft' ? '🟠' : '🔴'}
                    </div>
                    <div className="risk-details">
                      <span className="risk-name">{zone.name}</span>
                      <span className={`risk-level ${zone.type}`}>{zone.level}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - MAP & ROUTE */}
        <div className="right-column">
          {/* MAP CARD */}
          <div className="dashboard-card map-card">
            <div className="card-header">
              <h3>🗺️ Live Navigation</h3>
              <div className="map-controls">
                <button className="control-btn">📍</button>
                <button className="control-btn">🔍</button>
                <button className="control-btn">🗺️</button>
              </div>
            </div>
            <div className="map-container">
  <AdvancedMap />
</div>

            
            {/* ROUTE INFO */}
            <div className="route-info-card">
              <div className="route-points">
                <div className="route-point source">
                  <div className="point-indicator green"></div>
                  <div className="point-details">
                    <span className="point-label">Source</span>
                    <span className="point-name">Chennai Port</span>
                  </div>
                </div>
                <div className="route-divider">
                  <div className="route-line"></div>
                  <div className="route-arrow">➔</div>
                </div>
                <div className="route-point destination">
                  <div className="point-indicator red"></div>
                  <div className="point-details">
                    <span className="point-label">Destination</span>
                    <span className="point-name">Bengaluru Hub</span>
                  </div>
                </div>
              </div>
              
              <div className="route-stats">
                <div className="stat-item">
                  <span className="stat-label">ETA</span>
                  <span className="stat-value">2h 15m</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Remaining</span>
                  <span className="stat-value">148 km</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Avg Speed</span>
                  <span className="stat-value">65 km/h</span>
                </div>
              </div>
            </div>
          </div>

          {/* REROUTE CARD */}
          {rerouteAlert && (
            <div className="dashboard-card reroute-card orange">
              <div className="reroute-header">
                <div className="reroute-icon">🔁</div>
                <div className="reroute-content">
                  <h4>Reroute Suggested</h4>
                  <p>Traffic congestion + Weather detected ahead</p>
                </div>
              </div>
              <div className="reroute-actions">
                <button className="reroute-btn primary" onClick={handleReroute}>
                  Reroute Now
                </button>
                <button className="reroute-btn secondary" onClick={() => setRerouteAlert(false)}>
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* NEARBY WAREHOUSES */}
          <div className="dashboard-card warehouses-card">
            <div className="card-header">
              <h3>🏭 Nearby Warehouses</h3>
              <span className="card-badge purple">{warehouses.length}</span>
            </div>
            <div className="warehouses-scroll">
              {warehouses.map((w) => (
                <div 
                  key={w.id}
                  className={`warehouse-item ${getWarehouseColor(w.capacity)} ${activeWarehouse === w.id ? 'active' : ''}`}
                  onClick={() => handleWarehouseClick(w)}
                >
                  <div className="warehouse-header">
                    <h4>{w.name}</h4>
                    <span className="distance-badge">{w.distance}</span>
                  </div>
                  <div className="warehouse-details">
                    <span className="warehouse-type">📦 {w.type}</span>
                    <div className="capacity-meter">
                      <div className="capacity-labels">
                        <span>Available Space</span>
                        <span>{Math.round(w.capacity)}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${w.capacity}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <button className="navigate-btn">
                    Navigate
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}