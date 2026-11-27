import React, { useEffect, useState } from "react";
import axios from "axios";

function BuildersManagement() {
  const [builders, setBuilders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBuilders = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login as admin.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "http://localhost:9000/builders/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBuilders(response.data.builders || []);
    } catch (error) {
      console.error("Error fetching builders:", error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to fetch builders.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuilders();
  }, []);

  const verifyBuilder = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:9000/builders/admin/verify/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchBuilders();
    } catch (error) {
      console.error("Verify builder error:", error);

      setError(
        error.response?.data?.message || "Failed to verify builder."
      );
    }
  };

  const rejectBuilder = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:9000/builders/admin/reject/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchBuilders();
    } catch (error) {
      console.error("Reject builder error:", error);

      setError(
        error.response?.data?.message || "Failed to reject builder."
      );
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Builder Management</h1>
            <p style={styles.subtitle}>
              Review and manage registered builders
            </p>
          </div>

          <div style={styles.countBox}>
            <span style={styles.countNumber}>{builders.length}</span>
            <span style={styles.countLabel}>Builders</span>
          </div>
        </div>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={styles.message}>
            Loading builders...
          </div>
        ) : builders.length === 0 ? (
          <div style={styles.message}>
            No builders found.
          </div>
        ) : (
          <div style={styles.grid}>
            {builders.map((builder) => (
              <div key={builder._id} style={styles.card}>

                <div style={styles.cardTop}>
                  <div style={styles.logo}>
                    {builder.companyName
                      ? builder.companyName.charAt(0).toUpperCase()
                      : "B"}
                  </div>

                  <div>
                    <h2 style={styles.companyName}>
                      {builder.companyName}
                    </h2>

                    <p style={styles.contactPerson}>
                      {builder.contactPerson || "No contact person"}
                    </p>
                  </div>
                </div>

                <div style={styles.details}>

                  <div style={styles.detailRow}>
                    <span style={styles.label}>Email</span>
                    <span style={styles.value}>
                      {builder.email || builder.user?.email || "-"}
                    </span>
                  </div>

                  <div style={styles.detailRow}>
                    <span style={styles.label}>Mobile</span>
                    <span style={styles.value}>
                      {builder.mobile || builder.user?.mobile || "-"}
                    </span>
                  </div>

                  <div style={styles.detailRow}>
                    <span style={styles.label}>City</span>
                    <span style={styles.value}>
                      {builder.city || "-"}
                    </span>
                  </div>

                  <div style={styles.detailRow}>
                    <span style={styles.label}>Established</span>
                    <span style={styles.value}>
                      {builder.establishedYear || "-"}
                    </span>
                  </div>

                </div>

                <div style={styles.statusSection}>
                  <span style={styles.statusLabel}>Status</span>

                  <span
                    style={{
                      ...styles.status,
                      ...(builder.verificationStatus === "Verified"
                        ? styles.verified
                        : builder.verificationStatus === "Rejected"
                        ? styles.rejected
                        : styles.pending),
                    }}
                  >
                    {builder.verificationStatus}
                  </span>
                </div>

                {builder.verificationStatus === "Pending" && (
                  <div style={styles.actions}>

                    <button
                      style={styles.verifyButton}
                      onClick={() => verifyBuilder(builder._id)}
                    >
                      Verify
                    </button>

                    <button
                      style={styles.rejectButton}
                      onClick={() => rejectBuilder(builder._id)}
                    >
                      Reject
                    </button>

                  </div>
                )}

              </div>
            ))}
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
    padding: "40px 60px",
    boxSizing: "border-box",
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "35px",
  },

  title: {
    margin: 0,
    color: "#ff5733",
    fontSize: "30px",
    fontWeight: "700",
  },

  subtitle: {
    color: "#9fb4c8",
    marginTop: "8px",
    fontSize: "14px",
  },

  countBox: {
    backgroundColor: "#0b1f36",
    border: "1px solid #1E4E78",
    borderRadius: "10px",
    padding: "14px 22px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  countNumber: {
    color: "#33c1ff",
    fontSize: "24px",
    fontWeight: "700",
  },

  countLabel: {
    color: "#9fb4c8",
    fontSize: "12px",
    marginTop: "3px",
  },

  error: {
    backgroundColor: "#3a1515",
    border: "1px solid #8b3030",
    color: "#ff9a9a",
    padding: "14px",
    borderRadius: "8px",
    marginBottom: "20px",
  },

  message: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#9fb4c8",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))",
    gap: "22px",
  },

  card: {
    backgroundColor: "#102238",
    border: "1px solid #1E4E78",
    borderRadius: "12px",
    padding: "22px",
  },

  cardTop: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "22px",
  },

  logo: {
    width: "52px",
    height: "52px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #0878e8, #1251c7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    fontWeight: "700",
  },

  companyName: {
    margin: 0,
    fontSize: "18px",
    color: "#ffffff",
  },

  contactPerson: {
    margin: "5px 0 0",
    color: "#9fb4c8",
    fontSize: "13px",
  },

  details: {
    borderTop: "1px solid #1E4E78",
    borderBottom: "1px solid #1E4E78",
    padding: "15px 0",
  },

  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    marginBottom: "10px",
  },

  label: {
    color: "#7893aa",
    fontSize: "12px",
  },

  value: {
    color: "#ffffff",
    fontSize: "13px",
    textAlign: "right",
    wordBreak: "break-word",
  },

  statusSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "18px",
  },

  statusLabel: {
    color: "#9fb4c8",
    fontSize: "13px",
  },

  status: {
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },

  pending: {
    backgroundColor: "#4a3510",
    color: "#ffc857",
  },

  verified: {
    backgroundColor: "#123d2a",
    color: "#4ade80",
  },

  rejected: {
    backgroundColor: "#421b1b",
    color: "#ff7070",
  },

  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  },

  verifyButton: {
    flex: 1,
    background: "linear-gradient(135deg, #0878e8, #1251c7)",
    color: "#ffffff",
    border: "none",
    padding: "10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },

  rejectButton: {
    flex: 1,
    backgroundColor: "#3a1515",
    color: "#ff8c8c",
    border: "1px solid #8b3030",
    padding: "10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default BuildersManagement;