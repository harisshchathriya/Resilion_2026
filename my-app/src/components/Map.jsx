import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsRenderer,
  Marker,
  TrafficLayer,
  Circle,
} from "@react-google-maps/api";
import { FaMapMarkerAlt, FaCloudSun, FaDatabase, FaSync, FaFlagCheckered } from "react-icons/fa";
import { supabase } from "../supabase";

const containerStyle = { width: "100%", height: "600px" };
const center = { lat: 20.5937, lng: 78.9629 };

// Dark map style
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#212121" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#383838" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
];

// Danger zones
const dangerZones = [
  { center: { lat: 27.0238, lng: 74.2179 }, radius: 140000, reason: "Rajasthan - Accident-prone area" },
  { center: { lat: 25.0961, lng: 85.3131 }, radius: 90000, reason: "Bihar - Flood-prone zone" },
  { center: { lat: 18.5204, lng: 73.8567 }, radius: 90000, reason: "Pune - Heavy traffic area" },
  { center: { lat: 12.9716, lng: 77.5946 }, radius: 50000, reason: "Bengaluru - Construction zone" },
  { center: { lat: 22.5726, lng: 88.3639 }, radius: 50000, reason: "Kolkata - Industrial area" },
  { center: { lat: 23.0225, lng: 72.5714 }, radius: 50000, reason: "Ahmedabad - Flood-prone zone" },
  { center: { lat: 17.385, lng: 78.4867 }, radius: 70000, reason: "Hyderabad - Heavy traffic area" },
  { center: { lat: 28.6139, lng: 77.209 }, radius: 90000, reason: "Delhi - High congestion area" },
  { center: { lat: 26.8467, lng: 80.9462 }, radius: 60000, reason: "Lucknow - Accident-prone area" },
  { center: { lat: 21.1458, lng: 79.0882 }, radius: 70000, reason: "Nagpur - Heavy traffic area" },
  { center: { lat: 20.2961, lng: 85.8245 }, radius: 50000, reason: "Odisha - Cyclone-prone coastal zone" },
  { center: { lat: 10.8505, lng: 76.2711 }, radius: 40000, reason: "Kerala - Landslide-prone hilly region" },
  { center: { lat: 34.0837, lng: 74.7973 }, radius: 80000, reason: "Kashmir - Avalanche and conflict-prone zone" },
];

// City coordinates for auto-fill matching
const cities = {
  "Chennai": { lat: 13.0827, lng: 80.2707 },
  "Bangalore": { lat: 12.9716, lng: 77.5946 },
  "Bengaluru": { lat: 12.9716, lng: 77.5946 },
  "Mumbai": { lat: 19.076, lng: 72.8777 },
  "Delhi": { lat: 28.6139, lng: 77.209 },
  "Hyderabad": { lat: 17.385, lng: 78.4867 },
  "Kolkata": { lat: 22.5726, lng: 88.3639 },
  "Pune": { lat: 18.5204, lng: 73.8567 },
  "Ahmedabad": { lat: 23.0225, lng: 72.5714 },
  "Jaipur": { lat: 26.9124, lng: 75.7873 },
  "Lucknow": { lat: 26.8467, lng: 80.9462 },
  "Nagpur": { lat: 21.1458, lng: 79.0882 },
  "Indore": { lat: 22.7196, lng: 75.8577 },
  "Patna": { lat: 25.5941, lng: 85.1376 },
  "Bhopal": { lat: 23.2599, lng: 77.4126 },
  "Visakhapatnam": { lat: 17.6868, lng: 83.2185 },
  "Kanpur": { lat: 26.4499, lng: 80.3319 },
  "Vadodara": { lat: 22.3072, lng: 73.1812 },
  "Ludhiana": { lat: 30.9010, lng: 75.8573 },
  "Agra": { lat: 27.1767, lng: 78.0081 },
  "Nashik": { lat: 20.0059, lng: 73.7910 },
  "Varanasi": { lat: 25.3176, lng: 82.9739 },
  "Srinagar": { lat: 34.0837, lng: 74.7973 },
  "Amritsar": { lat: 31.6340, lng: 74.8723 },
  "Ranchi": { lat: 23.3441, lng: 85.3096 },
  "Coimbatore": { lat: 11.0168, lng: 76.9558 },
  "Madurai": { lat: 9.9252, lng: 78.1198 },
  "Trichy": { lat: 10.7905, lng: 78.7047 },
  "Bhubaneswar": { lat: 20.2961, lng: 85.8245 },
  "Chandigarh": { lat: 30.7333, lng: 76.7794 },
  "Guwahati": { lat: 26.1445, lng: 91.7362 },
  "Chennai Port": { lat: 13.0827, lng: 80.2707 },
  "Bengaluru Hub": { lat: 12.9716, lng: 77.5946 },
  "Hosur Cold Storage": { lat: 12.7406, lng: 77.8253 },
  "Salem Warehouse": { lat: 11.6643, lng: 78.1460 },
  "Chennai Central WH": { lat: 13.0827, lng: 80.2707 },
  "Salem": { lat: 11.6643, lng: 78.1460 },
  "Vellore": { lat: 12.9165, lng: 79.1325 },
};

// City name normalization for matching
const normalizeCityName = (city) => {
  if (!city) return "";
  return city
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
};

// Match city to coordinates
const matchCityToCoordinates = (cityName) => {
  if (!cityName) return null;
  
  const normalizedInput = normalizeCityName(cityName);
  
  // Try exact match
  for (const [city, coords] of Object.entries(cities)) {
    if (normalizeCityName(city) === normalizedInput) {
      return coords;
    }
  }
  
  // Try partial match
  for (const [city, coords] of Object.entries(cities)) {
    if (normalizedInput.includes(normalizeCityName(city)) || 
        normalizeCityName(city).includes(normalizedInput)) {
      return coords;
    }
  }
  
  return null;
};

function AdvancedMap() {
  const [origin, setOrigin] = useState("Salem");
  const [destination, setDestination] = useState("Vellore");
  const [directionsResult, setDirectionsResult] = useState(null);
  const [activeRouteIndex, setActiveRouteIndex] = useState(0);
  const [truckPosition, setTruckPosition] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [dangerAlert, setDangerAlert] = useState(false);
  const [trafficOn, setTrafficOn] = useState(false);
  const [showDangerZones, setShowDangerZones] = useState(false);
  const [mapKey, setMapKey] = useState(0);
  const [weatherCity, setWeatherCity] = useState("");
  const [showWeather, setShowWeather] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [driverName, setDriverName] = useState("");
  const [autoFilled, setAutoFilled] = useState(true);
  const [routeInfo, setRouteInfo] = useState(null);
  
  const directionsServiceRef = useRef(null);
  const truckAnimationRef = useRef(null);

  /* -------------------- SUPABASE LOGIC -------------------- */
  useEffect(() => {
    // Set static values
    setOrigin("Salem");
    setDestination("Vellore");
    setAutoFilled(true);
    setLoading(false);
    
    // Get driver name from Supabase
    const syncDriverName = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: driver } = await supabase
          .from("drivers")
          .select("id, name")
          .eq("email", user.email)
          .maybeSingle();
        
        if (driver) {
          setDriverName(driver.name || "");
        }
      }
    };
    
    syncDriverName();
  }, []);

  // Handle script load
  const handleScriptLoad = () => {
    setIsScriptLoaded(true);
    setScriptError(null);
  };

  const handleScriptError = () => {
    setScriptError("Failed to load Google Maps API");
    setIsScriptLoaded(false);
  };

  // Calculate route
  const calculateRoute = useCallback(() => {
    if (!origin || !destination || !window.google || !isScriptLoaded || isCalculating) return;

    setIsCalculating(true);
    
    const directionsService = new window.google.maps.DirectionsService();
    directionsServiceRef.current = directionsService;

    // Get coordinates for source and destination
    const sourceCoords = matchCityToCoordinates(origin);
    const destinationCoords = matchCityToCoordinates(destination);

    if (!sourceCoords || !destinationCoords) {
      setIsCalculating(false);
      alert(`Unable to find coordinates for: ${origin} or ${destination}. Please check city names.`);
      return;
    }

    directionsService.route(
      {
        origin: sourceCoords,
        destination: destinationCoords,
        travelMode: window.google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      },
      (result, status) => {
        setIsCalculating(false);
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirectionsResult(result);
          setActiveRouteIndex(0);
          
          // Store route info
          if (result.routes[0] && result.routes[0].legs[0]) {
            setRouteInfo({
              distance: result.routes[0].legs[0].distance.text,
              duration: result.routes[0].legs[0].duration.text,
              routesCount: result.routes.length,
            });
          }
          
          // Check for danger zones
          checkDangerZones(result.routes[0]);
        } else {
          console.error(`Error fetching directions: ${status}`);
          setDirectionsResult(null);
          alert("Failed to calculate route. Please check your inputs.");
        }
      }
    );
  }, [origin, destination, isScriptLoaded, isCalculating]);

  // Check if route intersects danger zones
  const checkDangerZones = (route) => {
    if (!route || !window.google || !showDangerZones) return;
    
    const path = route.overview_path || [];
    let intersects = false;

    path.forEach((point) => {
      dangerZones.forEach((zone) => {
        const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
          point,
          new window.google.maps.LatLng(zone.center.lat, zone.center.lng)
        );
        if (distance <= zone.radius) intersects = true;
      });
    });
    
    setDangerAlert(intersects);
  };

  // Animate truck along the route
  useEffect(() => {
    if (directionsResult && directionsResult.routes[activeRouteIndex]) {
      const path = directionsResult.routes[activeRouteIndex].overview_path || [];
      let i = 0;
      
      // Clear any existing animation
      if (truckAnimationRef.current) {
        clearInterval(truckAnimationRef.current);
      }
      
      truckAnimationRef.current = setInterval(() => {
        setTruckPosition(path[i]);
        i++;
        if (i >= path.length) {
          clearInterval(truckAnimationRef.current);
        }
      }, 300);
      
      return () => {
        if (truckAnimationRef.current) {
          clearInterval(truckAnimationRef.current);
        }
      };
    }
  }, [directionsResult, activeRouteIndex]);

  // Handle toggle danger zones
  const handleToggleDangerZones = () => {
    if (showDangerZones) {
      setMapKey(prev => prev + 1);
    }
    setShowDangerZones(prev => !prev);
  };

  // Simple weather function with mock data
  const handleShowWeather = () => {
    if (!weatherCity) {
      alert("Please enter a city name");
      return;
    }
    
    const city = matchCityToCoordinates(weatherCity);
    if (!city) {
      alert("City not found in our database. Try any major Indian city.");
      return;
    }

    // Mock weather data
    const mockWeatherData = {
      temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
      humidity: Math.floor(Math.random() * 40) + 50, // 50-90%
      condition: ["Sunny", "Cloudy", "Rainy", "Partly Cloudy"][Math.floor(Math.random() * 4)],
      wind: Math.floor(Math.random() * 20) + 5 // 5-25 km/h
    };

    setWeatherData({
      city: weatherCity,
      ...mockWeatherData
    });
    setShowWeather(true);
  };

  // Clear route
  const clearRoute = () => {
    setDirectionsResult(null);
    setTruckPosition(null);
    setDangerAlert(false);
    setRouteInfo(null);
    if (truckAnimationRef.current) {
      clearInterval(truckAnimationRef.current);
    }
  };

  // Refresh data from Supabase
  const refreshData = async () => {
    setLoading(true);
    
    // Reset to static values
    setOrigin("Salem");
    setDestination("Vellore");
    setAutoFilled(true);
    
    // Only refresh driver name
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: driver } = await supabase
        .from("drivers")
        .select("id, name")
        .eq("email", user.email)
        .maybeSingle();
      
      if (driver) {
        setDriverName(driver.name || "");
      }
    }
    
    setLoading(false);
  };

  if (scriptError) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        backgroundColor: "#6a0dad"
      }}>
        <div style={{ 
          background: "white", 
          padding: "30px", 
          borderRadius: "10px",
          textAlign: "center"
        }}>
          <h2>Map Error</h2>
          <p>{scriptError}</p>
          <p>Please check your Google Maps API key</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#6a0dad", minHeight: "100vh", padding: "40px", color: "white" }}>
      {/* Header with centered title only */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ textAlign: "center", fontSize: "2.5rem", fontWeight: "bold", margin: 0 }}>
          ADVANCED RE-ROUTE PLANNING FOR TRUCKS
        </h1>
      </div>

      <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "20px", color: "black" }}>
        {/* Supabase Data Section */}
        <div style={{ 
          padding: "15px", 
          backgroundColor: "#f0f8ff", 
          borderRadius: "10px", 
          marginBottom: "15px",
          border: "2px solid #007bff"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <h3 style={{ margin: 0, color: "#007bff", display: "flex", alignItems: "center", gap: "8px" }}>
              <FaDatabase /> Supabase Data Sync
              {driverName && (
                <span style={{ fontSize: "14px", color: "#555", marginLeft: "15px" }}>
                  Driver: <strong>{driverName}</strong>
                </span>
              )}
            </h3>
            <button
              onClick={refreshData}
              disabled={loading}
              style={{
                padding: "6px 12px",
                backgroundColor: loading ? "#ccc" : "#28a745",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px"
              }}
            >
              <FaSync /> {loading ? "Syncing..." : "Refresh Data"}
            </button>
          </div>
          
          {loading ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <p>Loading data from Supabase...</p>
            </div>
          ) : (
            <div style={{ 
              padding: "10px", 
              backgroundColor: "#e8f5e9", 
              borderRadius: "8px",
              border: "1px solid #4caf50"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <div style={{ 
                  width: "24px", 
                  height: "24px", 
                  backgroundColor: "#4caf50", 
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "12px"
                }}>
                  ✓
                </div>
                <span style={{ color: "#2e7d32", fontWeight: "bold" }}>Route Pre-configured (Salem → Vellore)</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "15px", alignItems: "center" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>SOURCE</div>
                  <div style={{ fontWeight: "bold", fontSize: "16px", color: "#2e7d32" }}>
                    {origin}
                  </div>
                </div>
                
                <div style={{ fontSize: "20px", color: "#4caf50" }}>→</div>
                
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>DESTINATION</div>
                  <div style={{ fontWeight: "bold", fontSize: "16px", color: "#2e7d32" }}>
                    {destination}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Source and Destination Input Boxes */}
        <div style={{ 
          padding: "15px", 
          backgroundColor: "#fff9e6", 
          borderRadius: "10px", 
          marginBottom: "15px",
          border: "2px solid #ff9800"
        }}>
          <h4 style={{ margin: "0 0 15px 0", color: "#e65100", display: "flex", alignItems: "center", gap: "8px" }}>
            📍 Route Information <span style={{ fontSize: "12px", backgroundColor: "#4caf50", color: "white", padding: "2px 8px", borderRadius: "10px" }}>Fixed Route</span>
          </h4>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
            {/* Source Input */}
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "#555", fontWeight: "bold" }}>
                <FaMapMarkerAlt style={{ marginRight: "8px", color: "#4caf50" }} />
                Source
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  value={origin}
                  readOnly
                  style={{
                    padding: "10px 10px 10px 40px",
                    borderRadius: "8px",
                    border: "2px solid #4caf50",
                    width: "100%",
                    fontSize: "16px",
                    backgroundColor: "#f1f8e9",
                    cursor: "not-allowed"
                  }}
                />
                <FaMapMarkerAlt style={{
                  position: "absolute",
                  top: "12px",
                  left: "12px",
                  color: "#4caf50"
                }} />
              </div>
            </div>
            
            {/* Destination Input */}
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "#555", fontWeight: "bold" }}>
                <FaFlagCheckered style={{ marginRight: "8px", color: "#f44336" }} />
                Destination
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  value={destination}
                  readOnly
                  style={{
                    padding: "10px 10px 10px 40px",
                    borderRadius: "8px",
                    border: "2px solid #4caf50",
                    width: "100%",
                    fontSize: "16px",
                    backgroundColor: "#f1f8e9",
                    cursor: "not-allowed"
                  }}
                />
                <FaFlagCheckered style={{
                  position: "absolute",
                  top: "12px",
                  left: "12px",
                  color: "#f44336"
                }} />
              </div>
            </div>
          </div>
          
          {/* Show Route Button */}
          <div style={{ textAlign: "center" }}>
            <button
              onClick={calculateRoute}
              disabled={!origin || !destination || !isScriptLoaded || isCalculating}
              style={{
                padding: "12px 30px",
                backgroundColor: (!origin || !destination || !isScriptLoaded) ? "#ccc" : "#007bff",
                color: "white",
                borderRadius: "8px",
                border: "none",
                cursor: (!origin || !destination || !isScriptLoaded) ? "not-allowed" : "pointer",
                fontWeight: "bold",
                fontSize: "16px",
                minWidth: "200px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                transition: "all 0.3s"
              }}
            >
              {isCalculating ? (
                <>
                  <div style={{ width: "20px", height: "20px", border: "3px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
                  Calculating Route...
                </>
              ) : (
                "📍 Show Route on Map"
              )}
            </button>
          </div>
        </div>

        {/* Danger Alert */}
        {dangerAlert && (
          <div
            style={{
              padding: "10px",
              backgroundColor: "#ffcccc",
              color: "#990000",
              borderRadius: "5px",
              marginBottom: "10px",
              fontWeight: "bold",
            }}
          >
            ⚠ Route passes through a danger zone! Consider rerouting.
          </div>
        )}

        {/* Loading State */}
        {!isScriptLoaded && !scriptError && (
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              marginBottom: "15px",
              textAlign: "center",
            }}
          >
            <p>Loading Google Maps...</p>
          </div>
        )}

        {/* Toggle Buttons */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            style={{
              padding: "8px 15px",
              backgroundColor: darkMode ? "#555" : "#eee",
              color: darkMode ? "white" : "black",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {darkMode ? "🌙 Night Mode" : "☀ Day Mode"}
          </button>

          <button
            onClick={() => setTrafficOn((prev) => !prev)}
            style={{
              padding: "8px 15px",
              backgroundColor: trafficOn ? "green" : "#ccc",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {trafficOn ? "🚦 Traffic On" : "🚦 Traffic Off"}
          </button>
          
          <button
            onClick={clearRoute}
            style={{
              padding: "8px 15px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Clear Route
          </button>
        </div>

        {/* Weather Input Section */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <FaCloudSun style={{ position: "absolute", top: "10px", left: "8px", color: "#007bff" }} />
            <input
              type="text"
              value={weatherCity}
              onChange={(e) => setWeatherCity(e.target.value)}
              placeholder="Enter city for weather"
              style={{ padding: "8px 8px 8px 30px", borderRadius: "8px", border: "1px solid #ccc", width: "200px" }}
            />
          </div>
          
          <button
            onClick={handleShowWeather}
            style={{
              padding: "8px 15px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Show Weather
          </button>

          {showWeather && (
            <button
              onClick={() => {
                setShowWeather(false);
                setWeatherData(null);
                setWeatherCity("");
              }}
              style={{
                padding: "8px 15px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Hide Weather
            </button>
          )}
        </div>

        {/* Weather Display */}
        {showWeather && weatherData && (
          <div style={{ 
            padding: "15px", 
            backgroundColor: "#e3f2fd", 
            borderRadius: "10px", 
            marginBottom: "15px",
            border: "2px solid #007bff"
          }}>
            <h3 style={{ margin: "0 0 10px 0", color: "#007bff" }}>
              🌤 Weather in {weatherData.city}
            </h3>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              <div><strong>Temperature:</strong> {weatherData.temperature}°C</div>
              <div><strong>Humidity:</strong> {weatherData.humidity}%</div>
              <div><strong>Condition:</strong> {weatherData.condition}</div>
              <div><strong>Wind Speed:</strong> {weatherData.wind} km/h</div>
            </div>
          </div>
        )}

        {/* Route Info Display */}
        {routeInfo && (
          <div style={{ 
            padding: "15px 20px", 
            backgroundColor: "#4caf50", 
            borderRadius: "10px", 
            marginBottom: "15px",
            color: "white"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <div style={{ fontSize: "12px", opacity: 0.9 }}>DISTANCE</div>
                <div style={{ fontWeight: "bold", fontSize: "20px" }}>
                  {routeInfo.distance}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "12px", opacity: 0.9 }}>ESTIMATED TIME</div>
                <div style={{ fontWeight: "bold", fontSize: "20px" }}>
                  {routeInfo.duration}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "12px", opacity: 0.9 }}>ROUTES AVAILABLE</div>
                <div style={{ fontWeight: "bold", fontSize: "20px" }}>
                  {routeInfo.routesCount}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Google Map */}
        <div style={{ background: "white", padding: "10px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <LoadScript
            googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyBthAa_IcLPDqnl8mZtk7XfcQRtFbDXl_E"}
            libraries={["places", "geometry"]}
            onLoad={handleScriptLoad}
            onError={handleScriptError}
          >
            {isScriptLoaded && (
              <div style={{ position: "relative" }}>
                <GoogleMap
                  key={mapKey}
                  mapContainerStyle={containerStyle}
                  center={matchCityToCoordinates(origin) || center}
                  zoom={matchCityToCoordinates(origin) ? 7 : 5}
                  options={{ 
                    styles: darkMode ? darkMapStyle : [],
                  }}
                >
                  {/* Traffic Layer */}
                  {trafficOn && <TrafficLayer />}

                  {/* Toggle button moved 120px left from the right edge */}
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "120px", // Moved from 10px to 120px
                      zIndex: 100,
                    }}
                  >
                    <button
                      onClick={handleToggleDangerZones}
                      style={{
                        padding: "8px 15px",
                        backgroundColor: showDangerZones ? "red" : "#444",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        whiteSpace: "nowrap", // Prevents text wrapping
                      }}
                    >
                      {showDangerZones ? "Hide Danger Zones" : "Show Danger Zones"}
                    </button>
                  </div>

                  {/* Danger Zones */}
                  {showDangerZones && dangerZones.map((zone, idx) => (
                    <Circle
                      key={idx}
                      center={zone.center}
                      radius={zone.radius}
                      options={{
                        fillColor: "red",
                        fillOpacity: 0.3,
                        strokeColor: "darkred",
                        strokeWeight: 2,
                      }}
                    />
                  ))}

                  {/* Markers for origin and destination */}
                  {origin && matchCityToCoordinates(origin) && (
                    <Marker position={matchCityToCoordinates(origin)} label="📍" />
                  )}
                  {destination && matchCityToCoordinates(destination) && (
                    <Marker position={matchCityToCoordinates(destination)} label="🏁" />
                  )}

                  {/* Directions */}
                  {directionsResult && <DirectionsRenderer directions={directionsResult} routeIndex={activeRouteIndex} />}

                  {/* Animated Truck */}
                  {truckPosition && (
                    <Marker
                      position={truckPosition}
                      icon={{
                        url: "https://img.icons8.com/emoji/48/truck-emoji.png",
                        scaledSize: new window.google.maps.Size(40, 40),
                      }}
                    />
                  )}
                </GoogleMap>
              </div>
            )}
          </LoadScript>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        input:focus {
          outline: none;
          border-color: #007bff !important;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }
      `}</style>
    </div>
  );
}

export default AdvancedMap;