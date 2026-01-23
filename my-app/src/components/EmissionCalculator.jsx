import { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import "./CreateShipment.css";

export default function CreateShipment() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    truck_name: "",
    source: "",
    destination: "",
  });

  const [assignedDriver, setAssignedDriver] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  /* Tamil Nadu Cities */
  const cities = [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Trichy",
    "Salem",
    "Erode",
    "Tirunelveli",
    "Vellore",
    "Thoothukudi",
    "Thanjavur",
  ];

  const handleAssign = async () => {
    if (!form.truck_name || !form.source || !form.destination) {
      alert("Fill all fields");
      return;
    }

    /* 1️⃣ Fetch idle drivers */
    const { data: drivers, error } = await supabase
      .from("driver")
      .select("driver_id, driver_name, vehicle_type, status")
      .eq("status", "idle");

    if (error) {
      alert(error.message);
      return;
    }

    /* 2️⃣ Find first matching driver */
    const driver = drivers.find(
      (d) =>
        d.vehicle_type?.toLowerCase() === form.truck_name.toLowerCase()
    );

    if (!driver) {
      alert("No available driver for this truck");
      return;
    }

    /* 3️⃣ Create shipment */
    const { error: shipmentError } = await supabase
      .from("shipment")
      .insert([
        {
          truck_name: form.truck_name,
          source: form.source,
          destination: form.destination,
          driver_id: driver.driver_id,
          created_at: new Date().toISOString(),
        },
      ]);

    if (shipmentError) {
      alert(shipmentError.message);
      return;
    }

    /* 4️⃣ Update driver status */
    const { error: updateError } = await supabase
      .from("driver")
      .update({ status: "in_trip" })
      .eq("driver_id", driver.driver_id);

    if (updateError) {
      alert(updateError.message);
      return;
    }

    /* 5️⃣ Show success popup */
    setAssignedDriver(driver);
    setShowPopup(true);
  };

  return (
    <div className="shipment-card">
      <h2>Create Shipment</h2>

      {/* Truck Name */}
      <div className="form-group">
        <label>Truck Name *</label>
        <select
          value={form.truck_name}
          onChange={(e) =>
            setForm({ ...form, truck_name: e.target.value })
          }
        >
          <option value="">Select Truck</option>
          <option value="Truck">Truck</option>
          <option value="Mini Truck">Mini Truck</option>
          <option value="Container">Container</option>
          <option value="Trailer">Trailer</option>
          <option value="Tanker">Tanker</option>
        </select>
      </div>

      {/* Source */}
      <div className="form-group">
        <label>Source *</label>
        <select
          value={form.source}
          onChange={(e) =>
            setForm({ ...form, source: e.target.value })
          }
        >
          <option value="">Select Source</option>
          {cities.map((city) => (
            <option key={city}>{city}</option>
          ))}
        </select>
      </div>

      {/* Destination */}
      <div className="form-group">
        <label>Destination *</label>
        <select
          value={form.destination}
          onChange={(e) =>
            setForm({ ...form, destination: e.target.value })
          }
        >
          <option value="">Select Destination</option>
          {cities.map((city) => (
            <option key={city}>{city}</option>
          ))}
        </select>
      </div>

      <button className="assign-btn" onClick={handleAssign}>
        Assign
      </button>

      {/* ================= SUCCESS POPUP ================= */}
      {showPopup && assignedDriver && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>✅ Driver Assigned Successfully</h3>

            <p>
              <strong>Driver ID:</strong> {assignedDriver.driver_id}
            </p>
            <p>
              <strong>Driver Name:</strong> {assignedDriver.driver_name}
            </p>

            <button
              className="assign-btn"
              onClick={() => navigate("/admin-dashboard")}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
