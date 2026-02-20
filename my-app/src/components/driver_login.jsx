import React, { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

export default function DriverLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDriverLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1️⃣ Supabase Auth Login
      const { data, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      const user = data.user;

      // 2️⃣ Check if this user is a DRIVER
      const { data: driver, error: driverError } = await supabase
        .from("drivers")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();

      if (driverError || !driver) {
        setError("Access denied. Not registered as a driver.");
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      // 3️⃣ Success → Go to Driver Dashboard
      navigate("/driver-dashboard");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <form style={styles.card} onSubmit={handleDriverLogin}>
        <h2 style={styles.title}>🚚 Driver Login</h2>

        <input
          type="email"
          placeholder="Driver Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <button
          type="button"
          style={styles.backBtn}
          onClick={() => navigate("/role-select")}
        >
          ← Back
        </button>
      </form>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "radial-gradient(circle at top, #1b0030, #090012 70%)",
  },
  card: {
    background: "rgba(255,255,255,0.08)",
    padding: "40px",
    borderRadius: "18px",
    width: "100%",
    maxWidth: "380px",
    backdropFilter: "blur(12px)",
    textAlign: "center",
    color: "white",
  },
  title: {
    marginBottom: "24px",
    background: "linear-gradient(135deg, #7600bc, #00e0c6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "14px",
    borderRadius: "8px",
    border: "none",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #7600bc, #8a00c2)",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
  },
  backBtn: {
    marginTop: "14px",
    background: "transparent",
    border: "none",
    color: "#ccc",
    cursor: "pointer",
  },
  error: {
    color: "#ff8080",
    fontSize: "14px",
    marginBottom: "10px",
  },
};
