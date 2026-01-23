import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import "./CreateShipment.css";

export default function CreateShipment() {
  const navigate = useNavigate();

  const generateDriverId = () =>
    "DRV-" + Math.floor(1000 + Math.random() * 9000);

  const [driver, setDriver] = useState({
    driver_id: "",
    driver_name: "",
    vehicle_type: "",
    experience: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setDriver((prev) => ({
      ...prev,
      driver_id: generateDriverId(),
    }));
  }, []);

  const handleBackToDashboard = () => {
    navigate("/admin-dashboard");
  };

  const assignDriver = async () => {
    if (
      !driver.driver_name ||
      !driver.vehicle_type ||
      !driver.experience
    ) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);
    setSuccess(false);

    const { error } = await supabase
      .from("driver")
      .insert([
        {
          ...driver,
          experience: Number(driver.experience),
          created_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      alert("Error: " + error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);

      setTimeout(() => {
        setDriver({
          driver_id: generateDriverId(),
          driver_name: "",
          vehicle_type: "",
          experience: "",
        });
        setSuccess(false);
      }, 2000);
    }
  };

  return (
    <div className="create-shipment-page">
      <div className="shipment-card">
        <div className="header-section">
          <button className="back-btn" onClick={handleBackToDashboard}>
            ← Back to Dashboard
          </button>
          <h2>Add Driver</h2>
          <p className="subtitle">
            Register driver skills and experience
          </p>
        </div>

        {success && (
          <div className="success-message">
            ✅ Driver added successfully!
          </div>
        )}

        <div className="form-grid">
          {/* Driver ID (Auto Generated) */}
          <div className="form-group">
            <label>Driver ID</label>
            <input value={driver.driver_id} disabled />
          </div>

          {/* Driver Name */}
          <div className="form-group">
            <label>Driver Name *</label>
            <input
              placeholder="e.g., Ravi Kumar"
              value={driver.driver_name}
              onChange={(e) =>
                setDriver({ ...driver, driver_name: e.target.value })
              }
            />
          </div>

          {/* Vehicle Type */}
          <div className="form-group">
            <label>Vehicle Type *</label>
            <select
              value={driver.vehicle_type}
              onChange={(e) =>
                setDriver({ ...driver, vehicle_type: e.target.value })
              }
            >
              <option value="">Select vehicle</option>
              <option value="Truck">Truck</option>
              <option value="Mini Truck">Mini Truck</option>
              <option value="Container">Container</option>
              <option value="Trailer">Trailer</option>
              <option value="Tanker">Tanker</option>
            </select>
          </div>

          {/* Experience */}
          <div className="form-group">
            <label>Experience (Years) *</label>
            <input
              type="number"
              min="0"
              placeholder="e.g., 5"
              value={driver.experience}
              onChange={(e) =>
                setDriver({ ...driver, experience: e.target.value })
              }
            />
          </div>
        </div>

        <div className="button-group">
          <button
            className="assign-btn"
            onClick={assignDriver}
            disabled={loading}
          >
            {loading ? "Saving..." : "✅ Save Driver"}
          </button>

          <button
            className="secondary-btn"
            onClick={() =>
              setDriver({
                driver_id: generateDriverId(),
                driver_name: "",
                vehicle_type: "",
                experience: "",
              })
            }
          >
            Clear Form
          </button>
        </div>

        <div className="info-box">
          <h4>📋 Instructions:</h4>
          <ul>
            <li>Driver ID is auto-generated</li>
            <li>Vehicle type defines assignment eligibility</li>
            <li>Experience is stored in years</li>
            <li>Drivers become available immediately</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
