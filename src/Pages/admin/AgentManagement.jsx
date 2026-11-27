import React, { useEffect, useState } from "react";
import axios from "axios";

function AgentManagement() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login as admin.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "http://localhost:9000/agent-profiles/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAgents(response.data.profiles || []);

    } catch (error) {
      console.error("Fetch agents error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load agent profiles."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `http://localhost:9000/agent-profiles/admin/approve/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);

      fetchAgents();

    } catch (error) {
      console.error("Approve agent error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to approve agent."
      );
    }
  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `http://localhost:9000/agent-profiles/admin/reject/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);

      fetchAgents();

    } catch (error) {
      console.error("Reject agent error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to reject agent."
      );
    }
  };

  if (loading) {
    return (
      <div style={styles.messagePage}>
        Loading agent profiles...
      </div>
    );
  }

  return (
    <div style={styles.page}>

      <div style={styles.header}>
        <h1 style={styles.heading}>
          Agent Management
        </h1>

        <p style={styles.subHeading}>
          Manage and verify registered agents
        </p>
      </div>

      <div style={styles.container}>

        {message && (
          <div style={styles.successBox}>
            {message}
          </div>
        )}

        {error && (
          <div style={styles.errorBox}>
            {error}
          </div>
        )}

        <div style={styles.summary}>
          <div>
            <span style={styles.summaryLabel}>
              Total Agents
            </span>

            <strong style={styles.summaryNumber}>
              {agents.length}
            </strong>
          </div>
        </div>

        {agents.length === 0 ? (
          <div style={styles.emptyBox}>
            No agent profiles found.
          </div>
        ) : (
          <div style={styles.grid}>

            {agents.map((agent) => (
              <div
                key={agent._id}
                style={styles.card}
              >

                <div style={styles.cardHeader}>
                  <div>
                    <h2 style={styles.agencyName}>
                      {agent.agencyName}
                    </h2>

                    <p style={styles.agentName}>
                      {agent.user?.name}
                    </p>
                  </div>

                  <span
                    style={{
                      ...styles.status,
                      ...(agent.status === "Approved"
                        ? styles.approved
                        : agent.status === "Blocked"
                        ? styles.blocked
                        : styles.pending),
                    }}
                  >
                    {agent.status}
                  </span>
                </div>

                <div style={styles.details}>

                  <p>
                    <strong>Email:</strong>{" "}
                    {agent.user?.email}
                  </p>

                  <p>
                    <strong>Phone:</strong>{" "}
                    {agent.phone}
                  </p>

                  <p>
                    <strong>Experience:</strong>{" "}
                    {agent.experience} years
                  </p>

                  <p>
                    <strong>RERA:</strong>{" "}
                    {agent.reraNumber || "Not provided"}
                  </p>

                  <p>
                    <strong>Office:</strong>{" "}
                    {agent.officeAddress}
                  </p>

                  <p>
                    <strong>Locations:</strong>{" "}
                    {agent.serviceLocations?.join(", ") ||
                      "Not provided"}
                  </p>

                </div>

                <div style={styles.actions}>

                  {agent.status !== "Approved" && (
                    <button
                      style={styles.approveButton}
                      onClick={() =>
                        handleApprove(agent._id)
                      }
                    >
                      Approve
                    </button>
                  )}

                  {agent.status !== "Blocked" && (
                    <button
                      style={styles.rejectButton}
                      onClick={() =>
                        handleReject(agent._id)
                      }
                    >
                      Reject
                    </button>
                  )}

                </div>

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
    minHeight: "100vh",
    backgroundColor: "#071525",
    color: "#ffffff",
    paddingBottom: "80px",
  },

  header: {
    padding: "55px 20px 35px",
    textAlign: "center",
    backgroundColor: "#0b1f36",
    borderBottom: "1px solid #1E4E78",
  },

  heading: {
    margin: "0 0 10px",
    fontSize: "40px",
    fontWeight: "700",
  },

  subHeading: {
    margin: 0,
    color: "#9eafc1",
  },

  container: {
    maxWidth: "1200px",
    margin: "40px auto",
    padding: "0 20px",
  },

  summary: {
    backgroundColor: "#102238",
    border: "1px solid #1E4E78",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "25px",
  },

  summaryLabel: {
    display: "block",
    color: "#9eafc1",
    fontSize: "14px",
    marginBottom: "5px",
  },

  summaryNumber: {
    fontSize: "28px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "25px",
  },

  card: {
    backgroundColor: "#102238",
    border: "1px solid #1E4E78",
    borderRadius: "12px",
    padding: "25px",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    marginBottom: "20px",
  },

  agencyName: {
    margin: "0 0 6px",
    fontSize: "22px",
  },

  agentName: {
    margin: 0,
    color: "#9eafc1",
  },

  status: {
    height: "fit-content",
    padding: "7px 13px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },

  pending: {
    backgroundColor: "#4a3b16",
    color: "#ffd66b",
  },

  approved: {
    backgroundColor: "#153d2b",
    color: "#6ee7a1",
  },

  blocked: {
    backgroundColor: "#421c24",
    color: "#ff8585",
  },

  details: {
    color: "#c4cfda",
    fontSize: "14px",
    lineHeight: "1.7",
  },

  actions: {
    display: "flex",
    gap: "12px",
    marginTop: "20px",
  },

  approveButton: {
    flex: 1,
    padding: "11px",
    border: "none",
    borderRadius: "6px",
    background:
      "linear-gradient(135deg, #0878e8, #1251c7)",
    color: "#ffffff",
    fontWeight: "600",
    cursor: "pointer",
  },

  rejectButton: {
    flex: 1,
    padding: "11px",
    border: "1px solid #6b2635",
    borderRadius: "6px",
    backgroundColor: "#2a1520",
    color: "#ff8585",
    fontWeight: "600",
    cursor: "pointer",
  },

  successBox: {
    backgroundColor: "#153d2b",
    border: "1px solid #2d7650",
    color: "#6ee7a1",
    padding: "14px",
    borderRadius: "7px",
    marginBottom: "20px",
  },

  errorBox: {
    backgroundColor: "#2a1520",
    border: "1px solid #6b2635",
    color: "#ff8585",
    padding: "14px",
    borderRadius: "7px",
    marginBottom: "20px",
  },

  emptyBox: {
    padding: "50px",
    textAlign: "center",
    backgroundColor: "#102238",
    border: "1px solid #1E4E78",
    borderRadius: "10px",
    color: "#9eafc1",
  },

  messagePage: {
    minHeight: "100vh",
    backgroundColor: "#071525",
    color: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "18px",
  },
};

export default AgentManagement;