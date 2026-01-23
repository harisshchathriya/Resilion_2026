import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabase";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = new URLSearchParams(location.search).get("role");

  /* COMMON STATE */
  const [loading, setLoading] = useState(false);

  /* DRIVER STATE */
  const [username, setUsername] = useState("");
  const [driverPassword, setDriverPassword] = useState("");

  /* ADMIN / WAREHOUSE STATE */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* REDIRECT IF ROLE MISSING */
  useEffect(() => {
    if (!role) navigate("/roles");
  }, [role, navigate]);

  /* ================= DRIVER LOGIN ================= */
  const handleDriverLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase
      .from("driver")
      .select("driver_id")
      .eq("u_n", username)
      .eq("password", Number(driverPassword))
      .single();

    if (error || !data) {
      alert("Invalid username or password");
      setLoading(false);
      return;
    }

    console.log("Driver logged in:", data.driver_id);
    navigate("/driver-dashboard");
    setLoading(false);
  };

  /* ================= ADMIN / WAREHOUSE LOGIN ================= */
  const handleAuthLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    if (role === "admin") {
      navigate("/admin-dashboard");
    }

    if (role === "warehouse") {
      navigate("/warehouse-dashboard");
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
        }

        .auth-card button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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
            {role === "driver"
              ? "Driver Login"
              : role === "warehouse"
              ? "Warehouse Login"
              : "Admin Login"}
            <span className="role-badge">{role}</span>
          </h2>

          <p className="subtitle">
            {role === "driver"
              ? "Login using driver credentials"
              : "Login using email & password"}
          </p>

          {/* DRIVER LOGIN FORM */}
          {role === "driver" && (
            <form onSubmit={handleDriverLogin}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="4-digit Password"
                value={driverPassword}
                onChange={(e) => setDriverPassword(e.target.value)}
                required
              />

              <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          )}

          {/* ADMIN / WAREHOUSE LOGIN FORM */}
          {(role === "admin" || role === "warehouse") && (
            <form onSubmit={handleAuthLogin}>
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
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
