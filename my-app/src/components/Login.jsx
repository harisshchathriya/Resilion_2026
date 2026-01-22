import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabase";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = new URLSearchParams(location.search).get("role");

  const [name, setName] = useState("");      // only for driver
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------- REDIRECT IF ROLE MISSING ---------------- */
  useEffect(() => {
    if (!role) navigate("/roles");
  }, [role, navigate]);

  /* ---------------- CHECK EXISTING SESSION ---------------- */
  // useEffect(() => {
  //   const checkSession = async () => {
  //     const { data } = await supabase.auth.getSession();
  //     if (data.session) {
  //       // Check user role from database and redirect accordingly
  //       const user = data.session.user;
        
  //       // Check if user is in drivers table
  //       const { data: driver } = await supabase
  //         .from("drivers")
  //         .select("*")
  //         .eq("email", user.email)
  //         .single();
        
  //       if (driver) {
  //         navigate("/map"); // Driver goes to map
  //       } else {
  //         navigate("/admin-dashboard"); // Admin goes to admin dashboard
  //       }
  //     }
  //   };
    
  //   checkSession();
  // }, [navigate]);

  /* ---------------- LOGIN HANDLER ---------------- */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1️⃣ Supabase Auth login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    const user = data.user;
    console.log("User logged in:", user.email);

    // 2️⃣ DRIVER FLOW
    if (role === "driver") {
      if (!name) {
        alert("Driver name is required");
        setLoading(false);
        return;
      }

      // Ensure driver profile exists
      const { error: driverError } = await supabase
        .from("drivers")
        .upsert({
          id: user.id,
          name: name,
          email: email,
        });

      if (driverError) {
        console.error(driverError);
        alert("Failed to save driver profile");
        setLoading(false);
        return;
      }

      console.log("Driver logged in, redirecting to /map");
      navigate("/map");
    }

    // 3️⃣ ADMIN FLOW
    if (role === "admin") {
      console.log("Admin logged in, redirecting to /admin-dashboard");
      navigate("/admin-dashboard");
    }

    setLoading(false);
  };

  return (
    <>
      <style>{`
        body {
          margin: 0;
          font-family: "Inter", Arial, sans-serif;
          background: radial-gradient(circle at top, #1b0030, #090012 70%);
          color: #f5f5f5;
        }

        .auth-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .auth-card {
          width: 100%;
          max-width: 420px;
          padding: 50px 40px;
          border-radius: 18px;
          background: linear-gradient(
            160deg,
            rgba(118,0,188,0.25),
            rgba(138,0,194,0.15)
          );
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(10px);
          text-align: center;
        }

        .auth-card h2 {
          font-size: 32px;
          margin-bottom: 10px;
          color: white;
        }

        .subtitle {
          color: #bdbdbd;
          margin-bottom: 30px;
          font-size: 16px;
        }

        .auth-card form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .auth-card input {
          padding: 14px 18px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.08);
          color: white;
          font-size: 16px;
        }

        .auth-card input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .auth-card button {
          background: linear-gradient(135deg, #7600bc, #8a00c2);
          border: none;
          color: white;
          padding: 14px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          font-size: 16px;
          margin-top: 10px;
          transition: all 0.3s ease;
        }

        .auth-card button:hover:not(:disabled) {
          background: linear-gradient(135deg, #8a00c2, #9c00d6);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(138, 0, 194, 0.4);
        }

        .auth-card button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .back-link {
          display: inline-block;
          margin-top: 20px;
          color: #b39ddb;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.3s;
        }

        .back-link:hover {
          color: #d1c4e9;
        }

        .role-badge {
          display: inline-block;
          padding: 4px 12px;
          background: rgba(138, 0, 194, 0.3);
          border-radius: 20px;
          font-size: 12px;
          margin-left: 10px;
          border: 1px solid rgba(138, 0, 194, 0.5);
        }
      `}</style>

      <div className="auth-page">
        <div className="auth-card">
          <h2>
            {role === "admin" ? "Admin Login" : "Driver Login"}
            <span className="role-badge">{role}</span>
          </h2>
          <p className="subtitle">
            {role === "admin"
              ? "Manage supply chain operations"
              : "Access your shipment & routes"}
          </p>

          <form onSubmit={handleLogin}>
            {/* DRIVER NAME (ONLY FOR DRIVER) */}
            {role === "driver" && (
              <input
                type="text"
                placeholder="Driver Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading
                ? "Logging in..."
                : `Login as ${role === "admin" ? "Admin" : "Driver"}`}
            </button>
          </form>

          <a href="/roles" className="back-link">
            ← Back to role selection
          </a>
        </div>
      </div>
    </>
  );
}