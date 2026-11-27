import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function BuilderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [builder, setBuilder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBuilder();
  }, [id]);

  const fetchBuilder = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9000/builders/${id}`
      );

      setBuilder(response.data.builder);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load builder details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.centerMessage}>
        Loading builder details...
      </div>
    );
  }

  if (error || !builder) {
    return (
      <div style={styles.centerMessage}>
        <p style={styles.error}>{error || "Builder not found."}</p>

        <button
          style={styles.backButton}
          onClick={() => navigate("/builders")}
        >
          Back to Builders
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>

      {/* Back Button */}
      <button
        style={styles.backButton}
        onClick={() => navigate("/builders")}
      >
        ← Back to Builders
      </button>

      {/* Main Profile */}
      <div style={styles.profileCard}>

        {/* Logo */}
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

        {/* Company Name */}
        <h1 style={styles.companyName}>
          {builder.companyName}
        </h1>

        {/* Verification */}
        <div style={styles.verified}>
          ✓ {builder.verificationStatus}
        </div>

        {/* About */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>About Builder</h2>

          <p style={styles.about}>
            {builder.about || "No information available."}
          </p>
        </div>

        {/* Information */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Company Information</h2>

          <div style={styles.infoGrid}>

            <div style={styles.infoBox}>
              <span style={styles.label}>Established</span>
              <span style={styles.value}>
                {builder.establishedYear || "Not specified"}
              </span>
            </div>

            <div style={styles.infoBox}>
              <span style={styles.label}>City</span>
              <span style={styles.value}>
                {builder.city || "Not specified"}
              </span>
            </div>

            <div style={styles.infoBox}>
              <span style={styles.label}>Contact Person</span>
              <span style={styles.value}>
                {builder.contactPerson || "Not specified"}
              </span>
            </div>

            <div style={styles.infoBox}>
              <span style={styles.label}>Mobile</span>
              <span style={styles.value}>
                {builder.mobile || "Not specified"}
              </span>
            </div>

            <div style={styles.infoBox}>
              <span style={styles.label}>Email</span>
              <span style={styles.value}>
                {builder.email || "Not specified"}
              </span>
            </div>

            <div style={styles.infoBox}>
              <span style={styles.label}>Office Address</span>
              <span style={styles.value}>
                {builder.officeAddress || "Not specified"}
              </span>
            </div>

          </div>
        </div>

        {/* Website */}
        {builder.website && (
          <div style={styles.websiteSection}>
            <h2 style={styles.sectionTitle}>Website</h2>

            <a
              href={
                builder.website.startsWith("http")
                  ? builder.website
                  : `https://${builder.website}`
              }
              target="_blank"
              rel="noopener noreferrer"
              style={styles.website}
            >
              Visit Builder Website ↗
            </a>
          </div>
        )}

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

  backButton: {
    background: "transparent",
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
    color: "#33c1ff",
    fontSize: "48px",
    fontWeight: "700",
  },

  companyName: {
    textAlign: "center",
    fontSize: "34px",
    margin: "10px 0 15px",
    color: "#ffffff",
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
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
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

  websiteSection: {
    marginTop: "40px",
  },

  website: {
    color: "#33c1ff",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "600",
  },

  centerMessage: {
    minHeight: "calc(100vh - 70px)",
    backgroundColor: "#071525",
    color: "#ffffff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  error: {
    color: "#ff6b6b",
    marginBottom: "20px",
  },
};

export default BuilderDetails;