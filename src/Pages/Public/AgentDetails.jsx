import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function AgentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAgent();
  }, [id]);

  const fetchAgent = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9000/agent-profiles/${id}`
      );

      setAgent(response.data.profile);
      setError("");
    } catch (err) {
      console.error("Fetch agent error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load agent details."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.centerPage}>
        Loading agent details...
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div style={styles.centerPage}>
        <p style={styles.error}>
          {error || "Agent not found."}
        </p>

        <button
          style={styles.backButton}
          onClick={() => navigate("/agents")}
        >
          ← Back to Agents
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>

      <button
        style={styles.backButton}
        onClick={() => navigate("/agents")}
      >
        ← Back to Agents
      </button>

      <div style={styles.profileCard}>

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
              {agent.agencyName?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Agency */}
        <h1 style={styles.agencyName}>
          {agent.agencyName}
        </h1>

        {/* Agent */}
        <p style={styles.agentName}>
          {agent.user?.name || "Real Estate Agent"}
        </p>

        {/* Status */}
        <div style={styles.verified}>
          ✓ Verified Agent
        </div>

        {/* About */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            About Agent
          </h2>

          <p style={styles.about}>
            {agent.about ||
              "No information about this agent is available."}
          </p>
        </div>

        {/* Professional Information */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            Professional Information
          </h2>

          <div style={styles.infoGrid}>

            <div style={styles.infoBox}>
              <span style={styles.label}>
                Experience
              </span>

              <span style={styles.value}>
                {agent.experience || 0} years
              </span>
            </div>

            <div style={styles.infoBox}>
              <span style={styles.label}>
                RERA Number
              </span>

              <span style={styles.value}>
                {agent.reraNumber || "Not provided"}
              </span>
            </div>

            <div style={styles.infoBox}>
              <span style={styles.label}>
                Phone
              </span>

              <span style={styles.value}>
                {agent.phone || "Not provided"}
              </span>
            </div>

            <div style={styles.infoBox}>
              <span style={styles.label}>
                WhatsApp
              </span>

              <span style={styles.value}>
                {agent.whatsapp || "Not provided"}
              </span>
            </div>

            <div style={styles.infoBox}>
              <span style={styles.label}>
                Email
              </span>

              <span style={styles.value}>
                {agent.user?.email || "Not provided"}
              </span>
            </div>

            <div style={styles.infoBox}>
              <span style={styles.label}>
                Office Address
              </span>

              <span style={styles.value}>
                {agent.officeAddress || "Not provided"}
              </span>
            </div>

          </div>
        </div>

        {/* Service Locations */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            Service Locations
          </h2>

          {agent.serviceLocations?.length > 0 ? (
            <div style={styles.locationContainer}>
              {agent.serviceLocations.map(
                (location, index) => (
                  <span
                    key={index}
                    style={styles.locationTag}
                  >
                    📍 {location}
                  </span>
                )
              )}
            </div>
          ) : (
            <p style={styles.about}>
              No service locations provided.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "calc(100vh - 70px)",
    backgroundColor: "#071525",
    color: "#ffffff",
    padding: "40px 60px 70px",
    boxSizing: "border-box",
  },

  centerPage: {
    minHeight: "calc(100vh - 70px)",
    backgroundColor: "#071525",
    color: "#ffffff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  backButton: {
    backgroundColor: "transparent",
    border: "1px solid #1E4E78",
    color: "#33c1ff",
    padding: "10px 18px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    marginBottom: "30px",
  },

  profileCard: {
    maxWidth: "950px",
    margin: "0 auto",
    backgroundColor: "#102238",
    border: "1px solid #1E4E78",
    borderRadius: "14px",
    padding: "45px",
    boxSizing: "border-box",
  },

  logoBox: {
    width: "120px",
    height: "120px",
    margin: "0 auto 20px",
    borderRadius: "50%",
    backgroundColor: "#0b1f36",
    border: "2px solid #1E4E78",
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
    fontSize: "48px",
    fontWeight: "700",
    color: "#33c1ff",
  },

  agencyName: {
    textAlign: "center",
    fontSize: "34px",
    margin: "10px 0 8px",
  },

  agentName: {
    textAlign: "center",
    color: "#9fb3c8",
    fontSize: "16px",
    margin: "0 0 15px",
  },

  verified: {
    width: "fit-content",
    margin: "0 auto",
    padding: "8px 16px",
    borderRadius: "20px",
    backgroundColor: "#0b1f36",
    color: "#33c1ff",
    fontSize: "14px",
    fontWeight: "600",
  },

  section: {
    marginTop: "45px",
  },

  sectionTitle: {
    color: "#ff5733",
    fontSize: "21px",
    marginBottom: "18px",
  },

  about: {
    color: "#b8c7d9",
    lineHeight: "1.8",
    fontSize: "15px",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "15px",
  },

  infoBox: {
    backgroundColor: "#0b1f36",
    border: "1px solid #1E4E78",
    borderRadius: "8px",
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  label: {
    color: "#7f9ab3",
    fontSize: "13px",
  },

  value: {
    color: "#ffffff",
    fontSize: "15px",
    wordBreak: "break-word",
  },

  locationContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
  },

  locationTag: {
    backgroundColor: "#0b1f36",
    border: "1px solid #1E4E78",
    color: "#b8c7d9",
    padding: "9px 14px",
    borderRadius: "20px",
    fontSize: "14px",
  },

  error: {
    color: "#ff6b6b",
    marginBottom: "20px",
  },
};

export default AgentDetails;