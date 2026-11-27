import React from "react";
import { useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav style={styles.navbar}>

      {/* Logo */}
      <div
        style={styles.logo}
        onClick={() => navigate("/")}
      >
        Prop<span style={styles.logoNexa}>Nexa</span>
      </div>

      {/* Navigation Links */}
      <div style={styles.navLinks}>

        <button
          style={styles.link}
          onClick={() => navigate("/")}
        >
          Home
        </button>

        <button
          style={styles.link}
          onClick={() => navigate("/properties")}
        >
          Properties
        </button>

        <button
          style={styles.link}
          onClick={() => navigate("/agents")}
        >
          Agents
        </button>

        <button
          style={styles.link}
          onClick={() => navigate("/Builders")}
        >
          Builders
        </button>

        <button
          style={styles.link}
          onClick={() => navigate("/projects")}
        >
          Projects
        </button>

        <button
          style={styles.link}
          onClick={() => navigate("/wishlist")}
        >
          ♡ Wishlist
        </button>

      </div>

      {/* Notification Bell */}
      <NotificationBell />

      {/* Login Button */}
      <button
        style={styles.loginButton}
        onClick={() => navigate("/login")}
      >
        Login
      </button>

    </nav>
  );
}

const styles = {
  navbar: {
    height: "70px",
    backgroundColor: "#071525",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 60px",
    borderBottom: "1px solid #1E4E78",
    boxSizing: "border-box",
  },

  logo: {
    color: "#ff5733",
    fontSize: "28px",
    fontWeight: "700",
    letterSpacing: "1px",
    cursor: "pointer",
  },

  logoNexa: {
    color: "#33c1ff",
  },

  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "30px",
  },

  link: {
    background: "none",
    border: "none",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "500",
    cursor: "pointer",
    padding: "8px 0",
  },

  loginButton: {
    background: "linear-gradient(135deg, #0878e8, #1251c7)",
    color: "#ffffff",
    border: "none",
    padding: "11px 24px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default Navbar;