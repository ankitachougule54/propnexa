import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CustomerProfile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:9000/auth/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response.data.user || response.data);
    } catch (error) {
      console.error("Fetch customer profile error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#071525",
      color: "#ffffff",
      padding: "40px",
    },

    container: {
      maxWidth: "900px",
      margin: "0 auto",
    },

    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "30px",
      flexWrap: "wrap",
      gap: "15px",
    },

    title: {
      margin: 0,
      fontSize: "32px",
    },

    subtitle: {
      color: "#9db2c8",
      marginTop: "8px",
    },

    backButton: {
      background: "#102238",
      border: "1px solid #1E4E78",
      color: "#ffffff",
      padding: "11px 18px",
      borderRadius: "8px",
      cursor: "pointer",
    },

    card: {
      background: "#102238",
      border: "1px solid #1E4E78",
      borderRadius: "14px",
      padding: "30px",
    },

    profileTop: {
      display: "flex",
      alignItems: "center",
      gap: "20px",
      paddingBottom: "25px",
      marginBottom: "25px",
      borderBottom: "1px solid #1E4E78",
    },

    avatar: {
      width: "75px",
      height: "75px",
      borderRadius: "50%",
      background: "#0878e8",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "32px",
      fontWeight: "700",
    },

    name: {
      margin: 0,
      fontSize: "24px",
    },

    role: {
      color: "#33c1ff",
      marginTop: "6px",
    },

    grid: {
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "20px",
    },

    infoBox: {
      background: "#071525",
      borderRadius: "10px",
      padding: "18px",
    },

    label: {
      color: "#6f8ca8",
      fontSize: "13px",
      marginBottom: "7px",
    },

    value: {
      margin: 0,
      color: "#ffffff",
      fontSize: "16px",
      wordBreak: "break-word",
    },

    error: {
      background: "#3a1717",
      border: "1px solid #8b3030",
      color: "#ffb3b3",
      padding: "15px",
      borderRadius: "8px",
    },

    loading: {
      textAlign: "center",
      padding: "60px",
      color: "#9db2c8",
    },

    logoutButton: {
      marginTop: "25px",
      background: "#ff5733",
      border: "none",
      color: "#ffffff",
      padding: "12px 24px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
    },
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.loading}>
            Loading your profile...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* HEADER */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              My Profile
            </h1>

            <p style={styles.subtitle}>
              View your PropNexa account information.
            </p>
          </div>

          <button
            style={styles.backButton}
            onClick={() =>
              navigate("/customer/dashboard")
            }
          >
            ← Dashboard
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {/* PROFILE */}
        {!error && user && (
          <div style={styles.card}>

            <div style={styles.profileTop}>

              <div style={styles.avatar}>
                {user.name
                  ? user.name.charAt(0).toUpperCase()
                  : "C"}
              </div>

              <div>
                <h2 style={styles.name}>
                  {user.name || "Customer"}
                </h2>

                <div style={styles.role}>
                  {user.role || "customer"}
                </div>
              </div>

            </div>

            <div style={styles.grid}>

              {/* NAME */}
              <div style={styles.infoBox}>
                <div style={styles.label}>
                  Full Name
                </div>

                <p style={styles.value}>
                  {user.name || "Not available"}
                </p>
              </div>

              {/* EMAIL */}
              <div style={styles.infoBox}>
                <div style={styles.label}>
                  Email
                </div>

                <p style={styles.value}>
                  {user.email || "Not available"}
                </p>
              </div>

              {/* MOBILE */}
              <div style={styles.infoBox}>
                <div style={styles.label}>
                  Mobile
                </div>

                <p style={styles.value}>
                  {user.mobile || "Not available"}
                </p>
              </div>

              {/* ROLE */}
              <div style={styles.infoBox}>
                <div style={styles.label}>
                  Account Role
                </div>

                <p style={styles.value}>
                  {user.role || "customer"}
                </p>
              </div>

            </div>

            <button
              style={styles.logoutButton}
              onClick={logout}
            >
              Logout
            </button>

          </div>
        )}

      </div>
    </div>
  );
};

export default CustomerProfile;