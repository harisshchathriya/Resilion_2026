import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import "./CreateShipment.css";

export default function CreateShipment() {
  const navigate = useNavigate();
  const [shipment, setShipment] = useState({
    truck_name: "",
    source: "",
    destination: "",
    type_of_goods: "",
    driver_id: "",
    driver_name: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleBackToDashboard = () => {
    navigate("/admin-dashboard");
  };

  const assignShipment = async () => {
    if (!shipment.truck_name || !shipment.source || !shipment.destination || !shipment.driver_name) {
      alert("Please fill in all required fields: Truck Name, Source, Destination, and Driver Name");
      return;
    }

    setLoading(true);
    setSuccess(false);

    const { error } = await supabase
      .from("shipments")
      .insert([{
        ...shipment,
        created_at: new Date().toISOString(),
        status: "Assigned"
      }]);

    if (error) {
      alert("Error: " + error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setShipment({
          truck_name: "",
          source: "",
          destination: "",
          type_of_goods: "",
          driver_id: "",
          driver_name: "",
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
          <h2>Create Shipment</h2>
          <p className="subtitle">
            Assign shipment details to a driver and vehicle
          </p>
        </div>

        {success && (
          <div className="success-message">
            ✅ Shipment assigned successfully!
          </div>
        )}

        <div className="form-grid">
          <div className="form-group">
            <label>Truck Name *</label>
            <input
              placeholder="e.g., Truck-101, Ashok Leyland"
              value={shipment.truck_name}
              onChange={(e) =>
                setShipment({ ...shipment, truck_name: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Source *</label>
            <input
              placeholder="e.g., Chennai, Mumbai Port"
              value={shipment.source}
              onChange={(e) =>
                setShipment({ ...shipment, source: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Destination *</label>
            <input
              placeholder="e.g., Bangalore, Delhi Hub"
              value={shipment.destination}
              onChange={(e) =>
                setShipment({ ...shipment, destination: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Type of Goods</label>
            <input
              placeholder="e.g., Electronics, Perishable, General Goods"
              value={shipment.type_of_goods}
              onChange={(e) =>
                setShipment({ ...shipment, type_of_goods: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Driver ID</label>
            <input
              placeholder="e.g., DRV-001, EMP-2048"
              value={shipment.driver_id}
              onChange={(e) =>
                setShipment({ ...shipment, driver_id: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Driver Name *</label>
            <input
              placeholder="e.g., Ravi Kumar, Harissh"
              value={shipment.driver_name}
              onChange={(e) =>
                setShipment({ ...shipment, driver_name: e.target.value })
              }
            />
          </div>
        </div>

        <div className="button-group">
          <button 
            className="assign-btn" 
            onClick={assignShipment}
            disabled={loading}
          >
            {loading ? "Assigning..." : "✅ Assign Shipment"}
          </button>
          
          <button 
            className="secondary-btn" 
            onClick={() => setShipment({
              truck_name: "",
              source: "",
              destination: "",
              type_of_goods: "",
              driver_id: "",
              driver_name: "",
            })}
          >
            Clear Form
          </button>
        </div>

        <div className="info-box">
          <h4>📋 Instructions:</h4>
          <ul>
            <li>Fields marked with * are required</li>
            <li>Driver Name should match exactly with driver's table entry</li>
            <li>Source and Destination will auto-fill on driver's map</li>
            <li>Shipments appear immediately in the system</li>
          </ul>
        </div>
      </div>
    </div>
  );
}