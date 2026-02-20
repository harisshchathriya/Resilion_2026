import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import {
  GoogleMap,
  LoadScript,
  Marker,
  TrafficLayer,
} from "@react-google-maps/api";

/* =========================================================
   GOOGLE MAP CONFIG
========================================================= */

const GOOGLE_MAPS_API_KEY =
  "AIzaSyBthAa_IcLPDqnl8mZtk7XfcQRtFbDXl_E";

const MAP_CONTAINER_STYLE = {
  width: "100%",
  height: "480px",
  borderRadius: "16px",
};

/* =========================================================
   DRIVER DASHBOARD
========================================================= */

function DriverDashboard() {
  const navigate = useNavigate();

  /* ================= REFS ================= */

  const gpsIntervalRef = useRef(null);
  const hasAutoCompletedRef = useRef(false);

  /* ================= STATE ================= */

  const [driver, setDriver] = useState(null);
  const [trip, setTrip] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [autoCompletionMessage, setAutoCompletionMessage] = useState("");

  /* =========================================================
     FINANCIAL LAYER - USES REAL DATA FROM DB
     NEVER DEPENDS ON SIMULATION
  ========================================================= */

  const getRealPlannedDistance = () => {
    return trip?.planned_distance_km || 0;
  };

  const getRealPlannedDuration = () => {
    return trip?.planned_duration_minutes || 0;
  };

  const calculateSalary = () => {
    // Example salary calculation based on real distance
    const distance = getRealPlannedDistance();
    const ratePerKm = 12; // ₹12 per km
    return (distance * ratePerKm).toFixed(2);
  };

  /* =========================================================
     ✅ UPDATED CLAIM GENERATION - Single TOTAL_PAYOUT claim only
     Uses real data from DB for accurate calculations
     Deletes any existing generated claims before inserting
  ========================================================= */

  const generateClaims = async (tripId, driverId) => {
    try {
      console.log("🚀 Generating claims for trip:", tripId, "driver:", driverId);
      
      // 1️⃣ Get trip data with planned distance
      const { data: tripData, error: tripError } = await supabase
        .from("trips")
        .select("*")
        .eq("id", tripId)
        .single();

      if (tripError) throw tripError;
      if (!tripData) throw new Error("Trip not found");

      // 2️⃣ Get driver data with rate, mileage, and fuel price
      const { data: driverData, error: driverError } = await supabase
        .from("drivers")
        .select("*")
        .eq("id", driverId)
        .single();

      if (driverError) throw driverError;
      if (!driverData) throw new Error("Driver not found");

      // 3️⃣ Extract values for calculation
      const distance = tripData.planned_distance_km;
      
      // Use driver-specific rates (with fallbacks)
      const rate = driverData.base_rate_per_km || 12; // ₹ per km
      const mileage = driverData.mileage_kmpl || 4; // km per liter (default truck mileage)
      const fuelPrice = driverData.fuel_price_per_l || 90; // ₹ per liter

      console.log("📊 Calculation Data:", {
        distance: distance.toFixed(2),
        rate,
        mileage,
        fuelPrice
      });

      // 4️⃣ Base Salary Calculation
      const baseSalary = distance * rate;

      // 5️⃣ Fuel Cost Calculation
      const fuelLiters = distance / mileage;
      const fuelCost = fuelLiters * fuelPrice;

      // 6️⃣ Total Payout
      const totalPayout = baseSalary + fuelCost;

      console.log("💰 Calculated Values:", {
        baseSalary: baseSalary.toFixed(2),
        fuelLiters: fuelLiters.toFixed(2),
        fuelCost: fuelCost.toFixed(2),
        totalPayout: totalPayout.toFixed(2)
      });

      // 🔥 DELETE any existing generated claims for this driver first
      console.log("🗑️ Deleting existing generated claims for driver:", driverId);
      const { error: deleteError } = await supabase
        .from("claims")
        .delete()
        .eq("driver_id", driverId)
        .eq("validation_status", "generated");

      if (deleteError) {
        console.error("❌ Error deleting existing claims:", deleteError);
        // Continue anyway - don't throw
      } else {
        console.log("✅ Existing generated claims deleted successfully");
      }

      // 7️⃣ Insert ONLY ONE claim - TOTAL_PAYOUT
      const claims = [
        {
          trip_id: tripId,
          driver_id: driverId,
          claim_type: "TOTAL_PAYOUT",
          claimed_value: totalPayout,
          system_calculated_value: totalPayout,
          approved: null,
          validation_status: "generated",
          reason: `
            Base Salary: ₹${baseSalary.toFixed(2)}
            Fuel Cost: ₹${fuelCost.toFixed(2)}
            Total: ₹${totalPayout.toFixed(2)}
          `
        }
      ];

      const { data, error } = await supabase
        .from("claims")
        .upsert(claims, { onConflict: "trip_id,claim_type" });

      if (error) {
        console.error("❌ Error inserting claim:", error);
        throw error;
      }

      console.log("✅ Single TOTAL_PAYOUT claim generated successfully:", data);
      
      // Return the generated claim for any further use
      return data;

    } catch (error) {
      console.error("❌ Failed to generate claims:", error);
      throw error; // Re-throw to handle in calling function
    }
  };

  /* =========================================================
     AUTO-COMPLETE TRIP
  ========================================================= */

  const autoCompleteTrip = async () => {
    if (!trip || !driver || hasAutoCompletedRef.current) {
      console.log("❌ Cannot auto-complete: missing data or already completed");
      return;
    }
    
    try {
      console.log("🏁 AUTO-COMPLETING TRIP:", trip.id);
      setAutoCompletionMessage("🎉 Destination reached! Completing trip...");
      hasAutoCompletedRef.current = true;

      // 1. Stop tracking
      stopGpsTracking();

      // 2. Update trip → COMPLETED
      const { error: tripError } = await supabase
        .from("trips")
        .update({
          status: "COMPLETED",
          actual_end_time: new Date().toISOString(),
        })
        .eq("id", trip.id);

      if (tripError) {
        console.error("❌ Failed to update trip:", tripError);
        throw tripError;
      }

      console.log("✅ Trip marked as COMPLETED");

      // 3. Update driver → AVAILABLE
      await supabase
        .from("drivers")
        .update({
            status: "AVAILABLE",
            last_lat: null,
            last_lng: null,
        })
        .eq("id", driver.id);

      console.log("✅ Driver marked as AVAILABLE");

      // 4. GENERATE SINGLE CLAIM with proper salary + fuel calculation
      console.log("💰 GENERATING SINGLE CLAIM NOW...");
      await generateClaims(trip.id, driver.id);

      // 5. Update local state
      setTrip(null);

      // 6. Reload dashboard
      setTimeout(async () => {
        await initDashboard();
        setAutoCompletionMessage("✅ Trip completed! Your total payout claim has been generated.");
        
        setTimeout(() => {
          setAutoCompletionMessage("");
        }, 3000);
      }, 1000);

    } catch (err) {
      console.error("❌ Auto-completion failed:", err);
      setAutoCompletionMessage("❌ Failed to complete trip. Please use manual button.");
      hasAutoCompletedRef.current = false;
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    initDashboard();
    return () => {
      stopGpsTracking();
    };
  }, []);

  const initDashboard = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/driver_login");
        return;
      }

      /* ---------- DRIVER ---------- */
      const { data: driverData } = await supabase
        .from("drivers")
        .select("*")
        .eq("auth_user_id", user.id)
        .single();

      if (!driverData) {
        navigate("/unauthorized");
        return;
      }

      setDriver(driverData);

      /* ---------- TRIP ---------- */
      // 🔧 FIX: Use maybeSingle() instead of single() to avoid 406 error when no trips
      const { data: tripData, error: tripError } = await supabase
        .from("trips")
        .select("*")
        .eq("driver_id", driverData.id)
        .in("status", ["ASSIGNED", "STARTED"])
        .maybeSingle(); // ✅ This returns null instead of 406 error

      if (tripError) {
        console.error("Error fetching trip:", tripError);
      }

      console.log("Current trip:", tripData);
      setTrip(tripData || null);
      
      hasAutoCompletedRef.current = false;

    } catch (err) {
      console.error(err);
      setError("Failed to load driver dashboard");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     🔥 STEP 2 — REAL GPS TRACKING
  ========================================================= */

  const startRealGpsTracking = () => {
    if (!trip || !driver) return;

    stopGpsTracking();

    gpsIntervalRef.current = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // 1️⃣ Update driver live position
          await supabase
            .from("drivers")
            .update({
              last_lat: latitude,
              last_lng: longitude,
              last_location_updated_at: new Date().toISOString(),
            })
            .eq("id", driver.id);

          // 2️⃣ Update local driver state for map marker
          setDriver(prev => ({ ...prev, last_lat: latitude, last_lng: longitude }));

          // 3️⃣ Insert into GPS log table
          await supabase
            .from("driver_gps_logs")
            .insert({
              trip_id: trip.id,
              driver_id: driver.id,
              latitude,
              longitude,
            });

          console.log("📍 Real GPS saved:", latitude, longitude);
        },
        (err) => console.log("GPS error:", err),
        { enableHighAccuracy: true }
      );
    }, 5000);
  };

  /* =========================================================
     🔥 STEP 4 — STOP TRACKING
  ========================================================= */

  const stopGpsTracking = () => {
    if (gpsIntervalRef.current) {
      clearInterval(gpsIntervalRef.current);
      gpsIntervalRef.current = null;
    }
  };

  /* =========================================================
     🔥 STEP 3 — MODIFIED START TRIP
  ========================================================= */

  const startTrip = async () => {
    if (!trip) return;
    setActionLoading(true);
    setAutoCompletionMessage("");

    console.log("▶ Starting trip:", trip.id);

    await supabase
      .from("trips")
      .update({
        status: "STARTED",
        actual_start_time: new Date().toISOString(),
      })
      .eq("id", trip.id);

    await supabase
      .from("drivers")
      .update({ status: "ON_TRIP" })
      .eq("id", driver.id);

    await initDashboard();
    startRealGpsTracking(); // ✅ Replaced startGpsTracking with real GPS
    setActionLoading(false);
    console.log("✅ Trip started successfully");
  };

  /* =========================================================
     MANUAL END TRIP
  ========================================================= */

  const endTrip = async () => {
    if (!trip) return;
    setActionLoading(true);

    console.log("⏹ Manually ending trip:", trip.id);

    stopGpsTracking();

    await supabase
      .from("trips")
      .update({
        status: "COMPLETED",
        actual_end_time: new Date().toISOString(),
      })
      .eq("id", trip.id);

    await supabase
      .from("drivers")
      .update({ status: "AVAILABLE" })
      .eq("id", driver.id);

    console.log("💰 Generating single claim for manual completion...");
    await generateClaims(trip.id, driver.id);

    setTrip(null);

    await initDashboard();
    setActionLoading(false);
    
    setAutoCompletionMessage("✅ Trip completed manually! Your total payout claim has been generated.");
    setTimeout(() => setAutoCompletionMessage(""), 3000);
  };

  /* Resume tracking if trip is started */
  useEffect(() => {
    if (trip?.status === "STARTED") {
      startRealGpsTracking();
    } else {
      stopGpsTracking();
    }
  }, [trip]);

  /* =========================================================
     UI STATES
  ========================================================= */

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h3>Loading driver dashboard...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "40px", color: "red" }}>
        {error}
      </div>
    );
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div style={{ padding: "30px", maxWidth: "1200px", margin: "auto" }}>
      {/* ================= DRIVER INFO ================= */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h2>Welcome, {driver.name}</h2>
          <p><strong>Vehicle ID:</strong> {driver.vehicle_id}</p>
          <p><strong>Status:</strong> {driver.status}</p>
          <p><strong>Rate/km:</strong> ₹{driver.base_rate_per_km || 12}</p>
          <p><strong>Mileage:</strong> {driver.mileage_kmpl || 4} kmpl</p>
        </div>
        
        <button
          onClick={() => navigate("/driver-claims")}
          style={{
            padding: "10px 20px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
            height: "40px"
          }}
        >
          📑 View My Claims
        </button>
      </div>

      {/* Live GPS Info */}
      {/* 🔧 FIX: Only show GPS if lat/lng are valid numbers */}
      {typeof driver.last_lat === "number" && typeof driver.last_lng === "number" && (
        <p style={{ color: "green", marginBottom: "10px" }}>
          📡 Live GPS: {driver.last_lat.toFixed(5)}, {driver.last_lng.toFixed(5)}
        </p>
      )}

      {/* 🎯 REAL DISTANCE INFO - Financial Layer */}
      {trip && (
        <div style={{
          background: "#e3f2fd",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
          border: "1px solid #90caf9"
        }}>
          <h4 style={{ margin: "0 0 10px 0", color: "#0d47a1" }}>📊 Trip Financial Data (Real)</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>
            <div>
              <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>Planned Distance</p>
              <p style={{ margin: 0, fontSize: "18px", fontWeight: "bold" }}>
                {getRealPlannedDistance().toFixed(2)} km
              </p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>Planned Duration</p>
              <p style={{ margin: 0, fontSize: "18px", fontWeight: "bold" }}>
                {getRealPlannedDuration().toFixed(2)} min
              </p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>Estimated Salary</p>
              <p style={{ margin: 0, fontSize: "18px", fontWeight: "bold", color: "#2e7d32" }}>
                ₹{calculateSalary()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Auto-completion Messages */}
      {autoCompletionMessage && (
        <div style={{
          padding: "15px",
          background: autoCompletionMessage.includes("❌") ? "#f8d7da" : "#d4edda",
          color: autoCompletionMessage.includes("❌") ? "#721c24" : "#155724",
          borderRadius: "8px",
          marginBottom: "20px",
          fontWeight: "bold",
          textAlign: "center"
        }}>
          {autoCompletionMessage}
        </div>
      )}

      <hr />

      {/* ================= MAP ================= */}
      <h3>Live Route & Vehicle Movement</h3>

      <LoadScript
        googleMapsApiKey={GOOGLE_MAPS_API_KEY}
        onLoad={() => setMapLoaded(true)}
      >
        {mapLoaded && (
          <GoogleMap
            mapContainerStyle={MAP_CONTAINER_STYLE}
            center={
              // 🔥 STEP 5: Use default center if lat/lng are not valid numbers
              typeof driver.last_lat === "number" && typeof driver.last_lng === "number"
                ? { lat: driver.last_lat, lng: driver.last_lng }
                : { lat: 13.0827, lng: 80.2707 } // Default Chennai
            }
            zoom={7}
          >
            <TrafficLayer />

            {/* START PIN */}
            {trip && (
              <Marker
                position={trip.source}
                icon="http://maps.google.com/mapfiles/ms/icons/green-dot.png"
              />
            )}

            {/* DESTINATION PIN */}
            {trip && (
              <Marker
                position={trip.destination}
                icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
              />
            )}

            {/* 🔥 STEP 5: MOVING TRUCK - Real GPS position */}
            {/* Only render marker if lat/lng are valid numbers */}
            {typeof driver.last_lat === "number" && 
             typeof driver.last_lng === "number" && (
              <Marker
                position={{
                  lat: driver.last_lat,
                  lng: driver.last_lng,
                }}
                icon={{
                  path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  scale: 6,
                  fillColor: "#ff5722",
                  fillOpacity: 1,
                  strokeWeight: 2,
                }}
              />
            )}
          </GoogleMap>
        )}
      </LoadScript>

      <hr />

      {/* ================= TRIP CARD ================= */}
      <h3>Assigned Trip</h3>

      {!trip ? (
        <div>
          <p>No active trips assigned.</p>
          <p style={{ color: "#666", marginTop: "10px" }}>
            You can view your past claims by clicking the "View My Claims" button above.
          </p>
        </div>
      ) : (
        <div
          style={{
            background: "#f4f2fb",
            padding: "20px",
            borderRadius: "12px",
            maxWidth: "520px",
          }}
        >
          <p><strong>Trip ID:</strong> {trip.id}</p>
          <p><strong>Source:</strong> {trip.source}</p>
          <p><strong>Destination:</strong> {trip.destination}</p>
          <p><strong>Status:</strong> {trip.status}</p>
          
          {/* Show both real and simulated data */}
          <div style={{
            background: "#e8eaf6",
            padding: "10px",
            borderRadius: "8px",
            margin: "10px 0"
          }}>
            <p style={{ margin: "0 0 5px 0", fontWeight: "bold", color: "#1a237e" }}>
              📊 Financial Data (Fixed)
            </p>
            <p style={{ margin: 0, fontSize: "14px" }}>
              Distance: {trip.planned_distance_km.toFixed(2)} km | 
              Duration: {trip.planned_duration_minutes.toFixed(2)} min
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
            <button
              onClick={startTrip}
              disabled={trip.status !== "ASSIGNED" || actionLoading}
              style={{
                padding: "10px 20px",
                background: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: trip.status === "ASSIGNED" ? "pointer" : "not-allowed",
                opacity: trip.status === "ASSIGNED" ? 1 : 0.6
              }}
            >
              {actionLoading ? "Loading..." : "▶ Start Trip"}
            </button>

            <button
              onClick={endTrip}
              disabled={trip.status !== "STARTED" || actionLoading}
              style={{
                padding: "10px 20px",
                background: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: trip.status === "STARTED" ? "pointer" : "not-allowed",
                opacity: trip.status === "STARTED" ? 1 : 0.6
              }}
            >
              {actionLoading ? "Loading..." : "⏹ End Trip Now"}
            </button>
          </div>
          
          {trip.status === "STARTED" && (
            <p style={{ 
              fontSize: "12px", 
              color: "#666", 
              marginTop: "10px",
              fontStyle: "italic"
            }}>
              ℹ️ Financial calculations use planned distance: {trip.planned_distance_km.toFixed(2)} km (fixed)<br/>
              Real GPS tracking active - position updates every 5 seconds<br/>
              Upon completion: Single TOTAL_PAYOUT claim will be generated (Base Salary + Fuel Cost)
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default DriverDashboard;