import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Builders() {
    const navigate = useNavigate();
  const [builders, setBuilders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBuilders();
  }, []);

  const fetchBuilders = async () => {
    try {
      const response = await axios.get("http://localhost:9000/Builders");

      setBuilders(response.data.builders || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load builders.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>

      <div style={styles.header}>
        <h1 style={styles.heading}>
          Trusted <span style={styles.blue}>Builders</span>
        </h1>

        <p style={styles.subtitle}>
          Discover verified builders and their professional profiles.
        </p>
      </div>

      {loading && (
        <p style={styles.message}>Loading builders...</p>
      )}

      {!loading && error && (
        <p style={styles.error}>{error}</p>
      )}

      {!loading && !error && builders.length === 0 && (
        <p style={styles.message}>
          No verified builders available yet.
        </p>
      )}

      {!loading && !error && builders.length > 0 && (
        <div style={styles.grid}>
          {builders.map((builder) => (
            <div key={builder._id} style={styles.card}>

              <div style={styles.logoBox}>
                {builder.logo ? (
                  <img
                    src={builder.logo}
                    alt={builder.companyName}
                    style={styles.logo}
                  />
                ) : (
                  <div style={styles.logoText}>
                    {builder.companyName?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <h2 style={styles.companyName}>
                {builder.companyName}
              </h2>

              <p style={styles.location}>
                📍 {builder.city || "Location not specified"}
              </p>

              {builder.establishedYear && (
                <p style={styles.info}>
                  Established: {builder.establishedYear}
                </p>
              )}

              {builder.about && (
                <p style={styles.about}>
                  {builder.about.length > 120
                    ? builder.about.substring(0, 120) + "..."
                    : builder.about}
                </p>
              )}

              <div style={styles.verified}>
                ✓ Verified Builder
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}

const styles = {
  page: {
    minHeight: "calc(100vh - 70px)",
    backgroundColor: "#071525",
    color: "#ffffff",
    padding: "60px",
    boxSizing: "border-box",
  },

  header: {
    textAlign: "center",
    marginBottom: "45px",
  },

  heading: {
    fontSize: "38px",
    margin: "0 0 12px",
    fontWeight: "700",
  },

  blue: {
    color: "#33c1ff",
  },

  subtitle: {
    color: "#9fb3c8",
    fontSize: "16px",
    margin: 0,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "25px",
    maxWidth: "1200px",
    margin: "0 auto",
  },

  card: {
    backgroundColor: "#102238",
    border: "1px solid #1E4E78",
    borderRadius: "12px",
    padding: "28px",
    textAlign: "center",
    transition: "0.3s",
  },

  logoBox: {
    width: "85px",
    height: "85px",
    margin: "0 auto 18px",
    borderRadius: "50%",
    backgroundColor: "#0b1f36",
    border: "1px solid #1E4E78",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  logo: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  logoText: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#33c1ff",
  },

  companyName: {
    fontSize: "22px",
    margin: "10px 0",
    color: "#ffffff",
  },

  location: {
    color: "#9fb3c8",
    margin: "8px 0",
  },

  info: {
    color: "#c8d6e5",
    fontSize: "14px",
  },

  about: {
    color: "#9fb3c8",
    fontSize: "14px",
    lineHeight: "1.6",
    marginTop: "15px",
  },

  viewButton: {
  marginTop: "18px",
  width: "100%",
  padding: "11px",
  background: "linear-gradient(135deg, #0878e8, #1251c7)",
  color: "#ffffff",
  border: "none",
  borderRadius: "6px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
},

  verified: {
    display: "inline-block",
    marginTop: "18px",
    padding: "7px 12px",
    borderRadius: "20px",
    backgroundColor: "#0b1f36",
    color: "#33c1ff",
    fontSize: "13px",
    fontWeight: "600",
  },

  message: {
    textAlign: "center",
    color: "#9fb3c8",
    fontSize: "16px",
    marginTop: "50px",
  },

  error: {
    textAlign: "center",
    color: "#ff6b6b",
    fontSize: "16px",
    marginTop: "50px",
  },
};

export default Builders;