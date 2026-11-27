import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    role: "customer",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.mobile ||
      !formData.password
    ) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:9000/auth/register",
        formData
      );

      setMessage(response.data.message || "Registration successful.");

      setFormData({
        name: "",
        email: "",
        mobile: "",
        password: "",
        role: "customer",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h1 style={styles.title}>Create Account</h1>
            <p style={styles.subtitle}>
              Join PropNexa and get started
            </p>
          </div>

          {message && <div style={styles.success}>{message}</div>}

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* NAME */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                style={styles.input}
              />
            </div>

            {/* EMAIL */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                style={styles.input}
              />
            </div>

            {/* MOBILE */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Mobile Number</label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter your mobile number"
                style={styles.input}
              />
            </div>

            {/* PASSWORD */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                style={styles.input}
              />
            </div>

            {/* ROLE */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Register As</label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="customer">Customer</option>
                <option value="owner">Property Owner</option>
                <option value="agent">Agent</option>
                <option value="builder">Builder</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>

          <div style={styles.footer}>
            <span>Already have an account?</span>{" "}
            <Link to="/login" style={styles.link}>
              Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#071525",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px 15px",
  },

  card: {
    width: "100%",
    maxWidth: "480px",
    background: "#102238",
    padding: "35px",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
  },

  header: {
    textAlign: "center",
    marginBottom: "25px",
  },

  title: {
    color: "#ffffff",
    marginBottom: "8px",
    fontSize: "30px",
  },

  subtitle: {
    color: "#aebed0",
    margin: 0,
  },

  inputGroup: {
    marginBottom: "18px",
  },

  label: {
    display: "block",
    color: "#ffffff",
    marginBottom: "7px",
    fontSize: "14px",
    fontWeight: "600",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    borderRadius: "8px",
    border: "1px solid #35516d",
    background: "#0b1f36",
    color: "#ffffff",
    outline: "none",
    fontSize: "14px",
  },

  button: {
    width: "100%",
    padding: "13px",
    marginTop: "8px",
    border: "none",
    borderRadius: "8px",
    background: "#0878e8",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },

  success: {
    background: "#164d35",
    color: "#7dffb2",
    padding: "10px",
    borderRadius: "7px",
    marginBottom: "18px",
    textAlign: "center",
  },

  error: {
    background: "#4d1c1c",
    color: "#ff8d8d",
    padding: "10px",
    borderRadius: "7px",
    marginBottom: "18px",
    textAlign: "center",
  },

  footer: {
    textAlign: "center",
    marginTop: "22px",
    color: "#aebed0",
    fontSize: "14px",
  },

  link: {
    color: "#33c1ff",
    textDecoration: "none",
    fontWeight: "600",
  },
};

export default Register;