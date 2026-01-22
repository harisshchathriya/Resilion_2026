import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // PRESENT CODE LOGIC: Navigate to /roles after successful signup
  const handleSignup = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({ 
      email, 
      password 
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Signup successful!");
      navigate("/roles");
    }
  };

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

        .auth-card h2 span {
          background: linear-gradient(135deg, #7600bc, #00e0c6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
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

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .auth-card input {
          padding: 14px 18px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.08);
          color: white;
          font-size: 16px;
          transition: all 0.25s ease;
        }

        .auth-card input:focus {
          outline: none;
          border-color: rgba(118,0,188,0.6);
          box-shadow: 0 0 0 3px rgba(118,0,188,0.2);
        }

        .auth-card input::placeholder {
          color: rgba(255,255,255,0.5);
        }

        .auth-btn {
          background: linear-gradient(135deg, #7600bc, #8a00c2);
          border: none;
          color: white;
          padding: 14px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          font-size: 16px;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          margin-top: 10px;
        }

        .auth-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(118,0,188,0.35);
        }

        .switch-text {
          margin-top: 25px;
          color: #bdbdbd;
          font-size: 14px;
        }

        .switch-text a {
          color: #8a00c2;
          text-decoration: none;
          font-weight: 600;
        }

        .switch-text a:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .auth-card {
            padding: 40px 30px;
            margin: 0 20px;
          }
          
          .auth-card h2 {
            font-size: 28px;
          }
        }

        @media (max-width: 480px) {
          .auth-card {
            padding: 35px 25px;
          }
        }
      `}</style>

      {/* PAST CODE UI DESIGN */}
      <div className="auth-page">
        <div className="auth-card">
          <h2>
            Create <span>Account</span>
          </h2>
          <p className="subtitle">
            Join the Resilion supply chain platform
          </p>

          {/* PRESENT CODE FORM LOGIC */}
          <form onSubmit={handleSignup}>
            <div className="input-group">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="auth-btn">
              Sign Up
            </button>
          </form>

          {/* PAST CODE NAVIGATION LINK */}
          <p className="switch-text">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </>
  );
}