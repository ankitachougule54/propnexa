import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Agents() {
  const navigate = useNavigate();

  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9000/agent-profiles/approved"
      );

      setAgents(response.data.profiles || []);
      setError("");
    } catch (err) {
      console.error("Fetch agents error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load agents."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.heading}>
          Trusted <span style={styles.blue}>Agents</span>
        </h1>

        <p style={styles.subtitle}>
          Connect with verified real estate agents and professionals.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <p style={styles.message}>
          Loading agents...
        </p>
      )}

      {/* Error */}
      {!loading && error && (
        <p style={styles.error}>
          {error}
        </p>
      )}

      {/* Empty */}
      {!loading && !error && agents.length === 0 && (
        <p style={styles.message}>
          No approved agents available yet.
        </p>
      )}

      {/* Agents */}
      {!loading && !error && agents.length > 0 && (
        <div style={styles.grid}>

          {agents.map((agent) => (
            <div
              key={agent._id}
              style={styles.card}
            >

              {/* Logo */}
              <div style={styles.logoBox}>

                {agent.logo ? (
                  <img
                    src={agent.logo}
                    alt={agent.agencyName}
                    style={styles.logo}
                  />
                ) : (
                  <div style={styles.logoText}>
                    {agent.agencyName
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>
                )}

              </div>

              {/* Agency */}
              <h2 style={styles.agencyName}>
                {agent.agencyName}
              </h2>

              {/* Agent Name */}
              <p style={styles.agentName}>
                {agent.user?.name || "Agent"}
              </p>

              {/* Location */}
              <p style={styles.location}>
                📍{" "}
                {agent.serviceLocations?.length > 0
                  ? agent.serviceLocations.join(", ")
                  : "Location not specified"}
              </p>

              {/* Experience */}
              <p style={styles.info}>
                💼 {agent.experience || 0} years experience
              </p>

              {/* RERA */}
              {agent.reraNumber && (
                <p style={styles.info}>
                  ✓ RERA: {agent.reraNumber}
                </p>
              )}

              {/* Status */}
              <div style={styles.verified}>
                ✓ Verified Agent
              </div>

              {/* Details */}
              <button
                style={styles.viewButton}
                onClick={() =>
                  navigate(`/agents/${agent._id}`)
                }
              >
                View Details
              </button>

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
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
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

  agencyName: {
    fontSize: "22px",
    margin: "10px 0 6px",
    color: "#ffffff",
  },

  agentName: {
    color: "#9fb3c8",
    margin: "0 0 12px",
  },

  location: {
    color: "#b8c7d9",
    fontSize: "14px",
    lineHeight: "1.5",
  },

  info: {
    color: "#b8c7d9",
    fontSize: "14px",
    margin: "8px 0",
  },

  verified: {
    display: "inline-block",
    marginTop: "12px",
    padding: "7px 12px",
    borderRadius: "20px",
    backgroundColor: "#0b1f36",
    color: "#33c1ff",
    fontSize: "13px",
    fontWeight: "600",
  },

  viewButton: {
    width: "100%",
    marginTop: "18px",
    padding: "11px",
    background:
      "linear-gradient(135deg, #0878e8, #1251c7)",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
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

export default Agents;