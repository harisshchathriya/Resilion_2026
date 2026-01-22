import React from "react";
import { useNavigate } from "react-router-dom";
import "./warehouse_login.css";

const WarehouseLogin = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // ✅ Navigate to Warehouse Dashboard
    navigate("/warehouse-dashboard");
  };

  return (
    <div className="login-container">
      {/* RESILION BRANDING */}
      <div className="login-header">
        <h1>RESILION</h1>
        <span>Intelligent | Adaptive | Resilient</span>
      </div>

      {/* LOGIN CARD */}
      <form className="login-card" onSubmit={handleLogin}>
        <h2>Warehouse Admin Login</h2>

        <input
          type="text"
          placeholder="Username"
          required
        />

        <input
          type="password"
          placeholder="Password"
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default WarehouseLogin;
