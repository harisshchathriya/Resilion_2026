import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { LoadScript } from "@react-google-maps/api";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const AdminDashboard = () => {
  const [drivers, setDrivers] = useState([]);
  const [claims, setClaims] = useState([]);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDrivers();
    fetchPendingClaims();
  }, []);

  const fetchDrivers = async () => {
    const { data } = await supabase
      .from("drivers")
      .select("*")
      .eq("status", "AVAILABLE");

    setDrivers(data || []);
  };

  // ✅ STEP 1: Updated fetchPendingClaims with explicit field selection including risk_score
  const fetchPendingClaims = async () => {
    const { data, error } = await supabase
      .from("claims")
      .select(`
        id,
        system_calculated_value,
        dispute_reason,
        dispute_description,
        proof_image_url,
        risk_score,
        created_at,
        drivers(name, vehicle_id),
        trips(source, destination)
      `)
      .eq("validation_status", "pending_review")
      .order("created_at", { ascending: false });

    if (!error) setClaims(data || []);
  };

  // ✅ STEP 4: Updated approveClaim with risk score check
  const approveClaim = async (id) => {
    const claim = claims.find(c => c.id === id);
    
    // 🔥 Auto block high risk claims (risk_score >= 80)
    if (claim.risk_score >= 80) {
      alert("❌ Cannot auto-approve high risk claim (Risk Score ≥ 80). This claim requires manual investigation.");
      return;
    }
    
    // ⚠ Warning for medium-high risk (risk_score >= 70)
    if (claim.risk_score >= 70) {
      const confirmApprove = window.confirm(
        `⚠ High Risk Claim (Score: ${claim.risk_score})! Please review carefully.\n\nDo you still want to approve?`
      );
      if (!confirmApprove) return;
    }

    await supabase
      .from("claims")
      .update({
        approved: true,
        validation_status: "approved_by_admin",
      })
      .eq("id", id);

    fetchPendingClaims();
  };

  const rejectClaim = async (id) => {
    await supabase
      .from("claims")
      .update({
        approved: false,
        validation_status: "rejected_by_admin",
      })
      .eq("id", id);

    fetchPendingClaims();
  };

  const calculateRoute = () => {
    return new Promise((resolve, reject) => {
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin: source,
          destination: destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK") {
            const leg = result.routes[0].legs[0];

            resolve({
              distance_km: leg.distance.value / 1000,
              duration_minutes: leg.duration.value / 60,
            });
          } else {
            reject("Route not found");
          }
        }
      );
    });
  };

  const handleAssignTrip = async () => {
    if (!source || !destination || !selectedDriver) {
      alert("Fill all fields");
      return;
    }

    setLoading(true);

    try {
      const routeData = await calculateRoute();

      await supabase.from("trips").insert({
        source,
        destination,
        driver_id: selectedDriver,
        planned_distance_km: routeData.distance_km,
        planned_duration_minutes: routeData.duration_minutes,
        status: "ASSIGNED",
      });

      await supabase
        .from("drivers")
        .update({ status: "ASSIGNED" })
        .eq("id", selectedDriver);

      alert("Trip Assigned Successfully!");
      setSource("");
      setDestination("");
      setSelectedDriver("");
      fetchDrivers();
    } catch (err) {
      console.error(err);
      alert("Error assigning trip");
    }

    setLoading(false);
  };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div style={{ padding: "30px" }}>
        <h2>Admin Dashboard</h2>

        {/* ================= ASSIGN TRIP ================= */}
        <h3>Assign Trip</h3>

        <div>
          <label>Source:</label>
          <input value={source} onChange={(e) => setSource(e.target.value)} />
        </div>

        <div>
          <label>Destination:</label>
          <input value={destination} onChange={(e) => setDestination(e.target.value)} />
        </div>

        <div>
          <label>Select Driver:</label>
          <select
            value={selectedDriver}
            onChange={(e) => setSelectedDriver(e.target.value)}
          >
            <option value="">-- Select Driver --</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name}
              </option>
            ))}
          </select>
        </div>

        <button onClick={handleAssignTrip} disabled={loading}>
          {loading ? "Assigning..." : "Assign Trip"}
        </button>

        {/* ================= CLAIM REVIEW ================= */}
        <hr style={{ margin: "40px 0" }} />

        <h3>Pending Claim Reviews</h3>

        {claims.length === 0 ? (
          <p>No pending claims.</p>
        ) : (
          claims.map((claim) => (
            <div
              key={claim.id}
              // ✅ STEP 2: Dynamic styling based on risk_score
              style={{
                background:
                  claim.risk_score >= 60
                    ? "#ffe5e5"
                    : claim.risk_score >= 30
                    ? "#fff4e5"
                    : "#f4f2fb",
                border:
                  claim.risk_score >= 60
                    ? "2px solid red"
                    : claim.risk_score >= 30
                    ? "2px solid orange"
                    : "1px solid #ddd",
                padding: "20px",
                borderRadius: "12px",
                marginBottom: "20px",
              }}
            >
              <p><strong>Driver:</strong> {claim.drivers?.name}</p>
              <p><strong>Vehicle:</strong> {claim.drivers?.vehicle_id}</p>
              <p>
                <strong>Trip:</strong>{" "}
                {claim.trips?.source} → {claim.trips?.destination}
              </p>
              <p><strong>Amount:</strong> ₹{claim.system_calculated_value}</p>
              
              {/* ✅ STEP 3: Risk Score Display */}
              <p>
                <strong>Risk Score:</strong>{" "}
                <span
                  style={{
                    fontWeight: "bold",
                    color:
                      claim.risk_score >= 60
                        ? "red"
                        : claim.risk_score >= 30
                        ? "orange"
                        : "green",
                  }}
                >
                  {claim.risk_score || 0}
                </span>
              </p>
              
              <p><strong>Dispute Reason:</strong> {claim.dispute_reason}</p>
              <p><strong>Description:</strong> {claim.dispute_description}</p>

              {claim.proof_image_url && (
                <img
                  src={claim.proof_image_url}
                  alt="Proof"
                  style={{ width: 250, marginTop: 10, borderRadius: 8 }}
                />
              )}

              <p style={{ fontSize: 12, color: "#666" }}>
                🕒 {new Date(claim.created_at).toLocaleString()}
              </p>

              <div style={{ marginTop: 15 }}>
                <button
                  onClick={() => approveClaim(claim.id)}
                  style={{
                    padding: "8px 16px",
                    background: "green",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    marginRight: 10,
                    cursor: "pointer",
                    opacity: claim.risk_score >= 80 ? 0.5 : 1,
                  }}
                  disabled={claim.risk_score >= 80}
                  title={claim.risk_score >= 80 ? "High risk claims cannot be auto-approved" : ""}
                >
                  ✅ Approve
                </button>

                <button
                  onClick={() => rejectClaim(claim.id)}
                  style={{
                    padding: "8px 16px",
                    background: "red",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  ❌ Reject
                </button>
              </div>
              
              {/* ✅ Additional warning badge for high risk */}
              {claim.risk_score >= 70 && (
                <p style={{
                  marginTop: "10px",
                  color: claim.risk_score >= 80 ? "darkred" : "orange",
                  fontWeight: "bold",
                  fontSize: "14px"
                }}>
                  {claim.risk_score >= 80 
                    ? "⛔ HIGH RISK - Auto-approval blocked" 
                    : "⚠ HIGH RISK - Review carefully"}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </LoadScript>
  );
};

export default AdminDashboard;