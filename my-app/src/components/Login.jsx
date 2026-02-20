import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = new URLSearchParams(location.search).get("role");

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  /* DRIVER STATE */
  const [username, setUsername] = useState("");
  const [driverPassword, setDriverPassword] = useState("");

  /* OTP STATE (ADMIN / WAREHOUSE) */
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  /* REDIRECT IF ROLE MISSING */
  useEffect(() => {
    if (!role) navigate("/roles");
  }, [role, navigate]);

  /* ================= DRIVER LOGIN ================= */
  const handleDriverLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Mock driver authentication - DEMO ONLY
    // In a real app, you would validate against a backend
    setTimeout(() => {
      // For demo purposes, accept any username with 4-digit password
      if (username && driverPassword.length === 4) {
        navigate("/driver-dashboard");
      } else {
        alert("Please enter username and 4-digit password");
      }
      setLoading(false);
    }, 500);
  };

  /* ================= SEND OTP ================= */
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Mock OTP sending - DEMO ONLY
    setTimeout(() => {
      alert(`Demo OTP: 123456 would be sent to ${email}`);
      setStep(2);
      setLoading(false);
    }, 500);
  };

  /* ================= VERIFY OTP ================= */
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Accept any 6-digit code for both admin and warehouse (DEMO ONLY)
    if ((role === "admin" || role === "warehouse") && otp.length === 6) {
      // Simulate a brief loading state
      setTimeout(() => {
        if (role === "admin") {
          navigate("/admin-dashboard");
        } else if (role === "warehouse") {
          navigate("/warehouse-dashboard");
        }
        setLoading(false);
      }, 500);
      return;
    }

    alert("Please enter a 6-digit code");
    setLoading(false);
  };

  return (
    <>
      <style>{`
        body {
          margin: 0;
          font-family: Inter, Arial, sans-serif;
          background: radial-gradient(circle at top, #1b0030, #090012 70%);
          color: white;
        }

        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
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
          backdrop-filter: blur(12px);
          text-align: center;
        }

        .auth-card h2 {
          font-size: 30px;
          margin-bottom: 10px;
        }

        .subtitle {
          color: #cfcfcf;
          margin-bottom: 30px;
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
          outline: none;
        }

        .auth-card input:focus {
          border-color: #a855f7;
        }

        .auth-card input::placeholder {
          color: rgba(255,255,255,0.5);
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
          transition: opacity 0.2s;
        }

        .auth-card button:hover {
          opacity: 0.9;
        }

        .auth-card button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .role-badge {
          display: inline-block;
          padding: 4px 12px;
          background: rgba(138,0,194,0.3);
          border-radius: 20px;
          font-size: 12px;
          margin-left: 10px;
          text-transform: capitalize;
        }

        .demo-badge {
          display: inline-block;
          padding: 2px 8px;
          background: rgba(255,193,7,0.2);
          border: 1px solid rgba(255,193,7,0.5);
          border-radius: 12px;
          font-size: 10px;
          margin-top: 8px;
          color: #ffc107;
        }

        .back-link {
          margin-top: 20px;
          color: #cfcfcf;
          font-size: 14px;
        }

        .back-link a {
          color: #a855f7;
          text-decoration: none;
          cursor: pointer;
        }

        .back-link a:hover {
          text-decoration: underline;
        }

        .demo-note {
          margin-top: 15px;
          padding: 8px;
          background: rgba(255,255,255,0.05);
          border-radius: 8px;
          font-size: 12px;
          color: #aaa;
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
              : role === "admin"
              ? "Admin: Any 6-digit code works"
              : "Warehouse: Any 6-digit code works"}
          </p>

          <div className="demo-badge">🔧 DEMO MODE - No Supabase</div>

          {/* DRIVER LOGIN */}
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
                maxLength="4"
                pattern="\d{4}"
                title="Please enter a 4-digit number"
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          )}

          {/* ADMIN / WAREHOUSE LOGIN */}
          {(role === "admin" || role === "warehouse") && (
            <>
              {step === 1 && (
                <form onSubmit={handleSendOTP}>
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" disabled={loading}>
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </button>
                  <div className="demo-note">
                    📧 Demo: Any email works. Click "Send OTP" to continue.
                  </div>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handleVerifyOTP}>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    inputMode="numeric"
                    pattern="\d{6}"
                    title="Please enter a 6-digit code"
                    autoFocus
                    required
                  />
                  <button 
                    type="submit" 
                    disabled={loading || otp.length !== 6}
                  >
                    {loading ? "Verifying..." : "Verify & Login"}
                  </button>
                  
                  <div className="demo-note">
                    🔑 Demo: Any 6-digit code works (e.g., 123456)
                  </div>
                  
                  <div className="back-link">
                    <a 
                      onClick={(e) => {
                        e.preventDefault();
                        setStep(1);
                        setOtp("");
                      }}
                    >
                      ← Back to email
                    </a>
                  </div>
                </form>
              )}
            </>
          )}

          <div className="back-link">
            <a href="/roles">← Change role</a>
          </div>
        </div>
      </div>
    </>
  );
}