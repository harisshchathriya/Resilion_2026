import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

function DriverClaims() {
  const navigate = useNavigate();

  const [claims, setClaims] = useState([]);
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [disputeData, setDisputeData] = useState({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/driver_login");
      return;
    }

    const { data: driverData } = await supabase
      .from("drivers")
      .select("*")
      .eq("auth_user_id", user.id)
      .single();

    setDriver(driverData);

    const { data } = await supabase
      .from("claims")
      .select(`*, trips (source, destination)`)
      .eq("driver_id", driverData.id)
      .eq("claim_type", "TOTAL_PAYOUT")
      .order("created_at", { ascending: false });

    setClaims(data || []);
    setLoading(false);
  };

  /* ================= ACCEPT CLAIM ================= */

  const acceptClaim = async (claimId) => {
    await supabase
      .from("claims")
      .update({
        validation_status: "accepted_by_driver",
        approved: true,
      })
      .eq("id", claimId);

    init();
  };

  /* ================= RAISE DISPUTE ================= */

  const raiseDispute = async (claim) => {
    const data = disputeData[claim.id];
    if (!data?.reason || !data?.description) {
      alert("Please fill all dispute fields");
      return;
    }

    setUploading(true);

    let imageUrl = null;

    if (data.file) {
      const fileName = `${claim.id}_${Date.now()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from("claim-proofs")
        .upload(fileName, data.file);

      if (uploadError) {
        alert("Image upload failed");
        setUploading(false);
        return;
      }

      const { data: publicUrl } = supabase.storage
        .from("claim-proofs")
        .getPublicUrl(fileName);

      imageUrl = publicUrl.publicUrl;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      await supabase
        .from("claims")
        .update({
          validation_status: "pending_review",
          approved: null,
          dispute_reason: data.reason,
          dispute_description: data.description,
          proof_image_url: imageUrl,
          dispute_lat: lat,
          dispute_lng: lng,
        })
        .eq("id", claim.id);

      setUploading(false);
      init();
    });
  };

  /* ================= FILTER CLAIMS ================= */
  
  // ✅ SECTION 1 — Active Salary (Generated Only)
  const pendingClaims = claims.filter(
    claim => claim.validation_status === "generated"
  );

  // ✅ SECTION 2 — Completed Claims (everything else)
  const historyClaims = claims.filter(
    claim => claim.validation_status !== "generated"
  );

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "auto" }}>
      <h2>💰 Salary Claim Review</h2>

      {claims.length === 0 && <p>No salary claims found.</p>}

      {/* ✅ SECTION 1 — PENDING CLAIMS (with buttons) */}
      {pendingClaims.length > 0 && (
        <>
          <h3 style={{ marginTop: "30px", marginBottom: "15px", color: "#0d47a1" }}>
            📋 Pending Review
          </h3>
          {pendingClaims.map((claim) => (
            <div
              key={claim.id}
              style={{
                background: "#f4f2fb",
                padding: "20px",
                borderRadius: "12px",
                marginBottom: "20px",
                borderLeft: "5px solid #ff9800"
              }}
            >
              <h3>
                {claim.trips?.source} → {claim.trips?.destination}
              </h3>

              <p>
                <strong>System Generated Salary:</strong> ₹
                {claim.system_calculated_value?.toFixed(2)}
              </p>

              <p>
                <strong>Status:</strong> {claim.validation_status}
              </p>

              {/* ✅ BUTTONS FOR PENDING CLAIMS */}
              <button
                onClick={() => acceptClaim(claim.id)}
                style={{
                  marginRight: "10px",
                  padding: "8px 15px",
                  background: "green",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                ✅ Accept Salary
              </button>

              <button
                onClick={() => {
                  // Toggle dispute form visibility
                  setDisputeData({
                    ...disputeData,
                    [claim.id]: { ...disputeData[claim.id], showForm: !disputeData[claim.id]?.showForm }
                  });
                }}
                style={{
                  padding: "8px 15px",
                  background: "#ff9800",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                ⚠ Raise Dispute
              </button>

              {/* DISPUTE FORM - shown only when toggled */}
              {disputeData[claim.id]?.showForm && (
                <div style={{ marginTop: "15px", padding: "15px", background: "#fff", borderRadius: "8px" }}>
                  <h4 style={{ margin: "0 0 10px 0" }}>Submit Dispute</h4>
                  
                  <select
                    onChange={(e) =>
                      setDisputeData({
                        ...disputeData,
                        [claim.id]: {
                          ...disputeData[claim.id],
                          reason: e.target.value,
                        },
                      })
                    }
                    style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
                  >
                    <option value="">Select Dispute Reason</option>
                    <option>Incorrect Distance</option>
                    <option>Fuel Price Mismatch</option>
                    <option>Extra Waiting Time</option>
                    <option>Route Diversion</option>
                  </select>

                  <textarea
                    placeholder="Describe the issue..."
                    style={{ width: "100%", padding: "8px", marginBottom: "10px", minHeight: "80px" }}
                    onChange={(e) =>
                      setDisputeData({
                        ...disputeData,
                        [claim.id]: {
                          ...disputeData[claim.id],
                          description: e.target.value,
                        },
                      })
                    }
                  />

                  <input
                    type="file"
                    accept="image/*"
                    style={{ marginBottom: "10px" }}
                    onChange={(e) =>
                      setDisputeData({
                        ...disputeData,
                        [claim.id]: {
                          ...disputeData[claim.id],
                          file: e.target.files[0],
                        },
                      })
                    }
                  />

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => raiseDispute(claim)}
                      disabled={uploading}
                      style={{
                        padding: "8px 15px",
                        background: "orange",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer"
                      }}
                    >
                      {uploading ? "Submitting..." : "Submit Dispute"}
                    </button>
                    
                    <button
                      onClick={() => {
                        setDisputeData({
                          ...disputeData,
                          [claim.id]: { ...disputeData[claim.id], showForm: false }
                        });
                      }}
                      style={{
                        padding: "8px 15px",
                        background: "#666",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer"
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* ✅ UPDATED: Proof Image with Timestamp and Location */}
              {claim.proof_image_url && (
                <>
                  <img
                    src={claim.proof_image_url}
                    alt="Proof"
                    style={{ width: "200px", marginTop: "10px", borderRadius: "8px" }}
                  />

                  {/* Timestamp */}
                  <p style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
                    🕒 {new Date(claim.created_at).toLocaleString()}
                  </p>

                  {/* Location */}
                  {claim.dispute_lat && claim.dispute_lng && (
                    <p style={{ fontSize: "12px", color: "#666" }}>
                      📍 {claim.dispute_lat}, {claim.dispute_lng}
                    </p>
                  )}
                </>
              )}
            </div>
          ))}
        </>
      )}

      {/* ✅ SECTION 2 — HISTORY CLAIMS (no buttons, only status) */}
      {historyClaims.length > 0 && (
        <>
          <h3 style={{ marginTop: "40px", marginBottom: "15px", color: "#2e7d32" }}>
            📜 Claim History
          </h3>
          {historyClaims.map((claim) => (
            <div
              key={claim.id}
              style={{
                background: "#f9f9f9",
                padding: "20px",
                borderRadius: "12px",
                marginBottom: "20px",
                borderLeft: "5px solid #9e9e9e",
                opacity: "0.9"
              }}
            >
              <h3 style={{ margin: "0 0 10px 0" }}>
                {claim.trips?.source} → {claim.trips?.destination}
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div>
                  <p style={{ margin: "5px 0" }}>
                    <strong>Amount:</strong> ₹{claim.system_calculated_value?.toFixed(2)}
                  </p>
                  <p style={{ margin: "5px 0" }}>
                    <strong>Status:</strong>{" "}
                    <span style={{
                      background: claim.validation_status === "accepted_by_driver" ? "#d4edda" : 
                                 claim.validation_status === "pending_review" ? "#fff3cd" : "#e2e3e5",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      color: claim.validation_status === "accepted_by_driver" ? "#155724" : 
                             claim.validation_status === "pending_review" ? "#856404" : "#383d41"
                    }}>
                      {claim.validation_status}
                    </span>
                  </p>
                </div>
                
                <div>
                  {claim.dispute_reason && (
                    <>
                      <p style={{ margin: "5px 0" }}>
                        <strong>Dispute:</strong> {claim.dispute_reason}
                      </p>
                      {claim.dispute_description && (
                        <p style={{ margin: "5px 0", fontSize: "14px", color: "#666" }}>
                          {claim.dispute_description}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* ✅ UPDATED: Proof Image with Timestamp and Location in History Section */}
              {claim.proof_image_url && (
                <>
                  <img
                    src={claim.proof_image_url}
                    alt="Proof"
                    style={{ width: "150px", marginTop: "10px", borderRadius: "8px" }}
                  />

                  {/* Timestamp */}
                  <p style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
                    🕒 {new Date(claim.created_at).toLocaleString()}
                  </p>

                  {/* Location */}
                  {claim.dispute_lat && claim.dispute_lng && (
                    <p style={{ fontSize: "12px", color: "#666" }}>
                      📍 {claim.dispute_lat}, {claim.dispute_lng}
                    </p>
                  )}
                </>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default DriverClaims;