import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:9000/auth/login",
        {
          email,
          password,
        }
      );

      console.log("LOGIN RESPONSE:", response.data);

if (!response.data.token) {
  console.error("❌ TOKEN NOT RECEIVED FROM BACKEND");
  setError("Login successful, but token was not received.");
  return;
}

localStorage.setItem("token", response.data.token);

console.log("TOKEN SAVED:", localStorage.getItem("token"));
      // Save user information
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      setSuccess("Login successful!");

      console.log("Token saved successfully.");

      // Go to home page
       // Redirect user according to role
setTimeout(() => {
  const role = response.data.user?.role;

  if (role === "owner") {
    navigate("/owner/dashboard");
  } else if (role === "customer") {
    navigate("/customer/dashboard");
  } else if (role === "agent") {
    navigate("/agent/dashboard");
  } else if (role === "builder") {
    navigate("/builder/dashboard");
  } else if (role === "admin") {
    navigate("/admin/dashboard");
  } else {
    navigate("/");
  }
}, 800);
    } catch (error) {
      console.error("Login error:", error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <div style={styles.logo}>
          Prop<span>Nexa</span>
        </div>

        <h1 style={styles.title}>
          Welcome Back
        </h1>

        <p style={styles.subtitle}>
          Login to your PropNexa account
        </p>

        <form onSubmit={handleLogin}>

          {/* Email */}
          <div style={styles.field}>
            <label style={styles.label}>
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
          </div>

          {/* Password */}
          <div style={styles.field}>
            <label style={styles.label}>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
          </div>

          {/* Error */}
          {error && (
            <p style={styles.error}>
              {error}
            </p>
          )}

          {/* Success */}
          {success && (
            <p style={styles.success}>
              {success}
            </p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            style={styles.loginButton}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p style={styles.registerText}>
          Don't have an account?{" "}
          <span
            style={styles.registerLink}
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#071525",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    backgroundColor: "#102238",
    border: "1px solid #1E4E78",
    borderRadius: "12px",
    padding: "35px",
    boxSizing: "border-box",
  },

  logo: {
    textAlign: "center",
    color: "#ff5733",
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "20px",
  },

  title: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: "28px",
    margin: "0 0 8px",
  },

  subtitle: {
    color: "#8fa4b8",
    textAlign: "center",
    fontSize: "14px",
    marginBottom: "30px",
  },

  field: {
    marginBottom: "20px",
  },

  label: {
    display: "block",
    color: "#ffffff",
    fontSize: "13px",
    marginBottom: "8px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px",
    backgroundColor: "#071525",
    border: "1px solid #1E4E78",
    borderRadius: "6px",
    color: "#ffffff",
    fontSize: "14px",
    outline: "none",
  },

  error: {
    color: "#ff6b6b",
    fontSize: "13px",
    marginBottom: "15px",
  },

  success: {
    color: "#33c1ff",
    fontSize: "13px",
    marginBottom: "15px",
  },

  loginButton: {
    width: "100%",
    padding: "13px",
    border: "none",
    borderRadius: "6px",
    background: "linear-gradient(135deg, #0878e8, #1251c7)",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },

  registerText: {
    textAlign: "center",
    color: "#8fa4b8",
    fontSize: "13px",
    marginTop: "25px",
  },

  registerLink: {
    color: "#33c1ff",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default Login;