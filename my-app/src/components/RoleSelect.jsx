import React from "react";
import { useNavigate } from "react-router-dom";

export default function RoleSelect() {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        body {
          margin: 0;
          font-family: "Inter", Arial, sans-serif;
          background: radial-gradient(
            circle at top,
            #1b0030,
            #090012 70%
          );
          color: #f5f5f5;
        }

        .role-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .role-container {
          display: flex;
          gap: 40px;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
        }

        .role-card {
          width: 300px;
          padding: 40px 30px;
          cursor: pointer;
          border-radius: 18px;
          background: linear-gradient(
            160deg,
            rgba(118,0,188,0.25),
            rgba(138,0,194,0.15)
          );
          border: 1px solid rgba(255,255,255,0.12);
          text-align: center;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .role-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(118,0,188,0.45);
          background: linear-gradient(
            160deg,
            rgba(118,0,188,0.35),
            rgba(138,0,194,0.25)
          );
        }

        .role-card h2 {
          margin: 0 0 15px 0;
          font-size: 28px;
          background: linear-gradient(135deg, #7600bc, #00e0c6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .role-card p {
          color: #cfcfcf;
          font-size: 16px;
          margin: 0;
        }

        .role-header {
          position: absolute;
          top: 0;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 60px;
          background: linear-gradient(
            90deg,
            rgba(118,0,188,0.35),
            rgba(138,0,194,0.35)
          );
          backdrop-filter: blur(10px);
        }

        .logo {
          font-size: 18px;
          font-weight: 700;
        }

        .logo span {
          background: linear-gradient(135deg, #7600bc, #8a00c2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .back-btn {
          background: linear-gradient(135deg, #7600bc, #8a00c2);
          border: none;
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }
      `}</style>

      {/* HEADER */}
      <div className="role-header">
        <div className="logo">
          🚚 <span>RESILION</span>
        </div>
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
      </div>

      {/* ROLE SELECTION */}
      <div className="role-page">
        <div className="role-container">
          <div
            className="role-card"
            onClick={() => navigate("/driver_login")}
          >
            <h2>🚚 Driver Login</h2>
            <p>Access shipment & route details</p>
          </div>

          <div
            className="role-card"
            onClick={() => navigate("/login?role=admin")}
          >
            <h2>🛠️ Admin Login</h2>
            <p>Manage supply chain operations</p>
          </div>

          <div
            className="role-card"
            onClick={() => navigate("/warehouse_login")}
          >
            <h2>🏬 Warehouse Management</h2>
            <p>Manage inventory, loading & dispatch</p>
          </div>
        </div>
      </div>
    </>
  );
}
