import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OwnerEnquiries = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // =========================
  // FETCH OWNER ENQUIRIES
  // =========================
  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await axios.get(
        "http://localhost:9000/enquiries",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEnquiries(response.data.enquiries || []);
    } catch (error) {
      console.error("Fetch enquiries error:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to load enquiries"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchEnquiries();
  }, []);

  // =========================
  // UPDATE STATUS
  // =========================
  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:9000/enquiries/${id}/status`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEnquiries((prev) =>
        prev.map((enquiry) =>
          enquiry._id === id
            ? { ...enquiry, status }
            : enquiry
        )
      );
    } catch (error) {
      console.error("Update enquiry status error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update enquiry status"
      );
    }
  };

  // =========================
  // STATUS STYLE
  // =========================
  const getStatusStyle = (status) => {
    switch (status) {
      case "New":
        return {
          background: "#443815",
          color: "#ffd84d",
        };

      case "Contacted":
        return {
          background: "#173554",
          color: "#55b8ff",
        };

      case "Follow up":
        return {
          background: "#352047",
          color: "#d78cff",
        };

      case "Converted":
        return {
          background: "#123d2b",
          color: "#35e89a",
        };

      case "Closed":
        return {
          background: "#263244",
          color: "#aebdca",
        };

      default:
        return {
          background: "#263244",
          color: "#cbd5e1",
        };
    }
  };

  // =========================
  // DATE FORMAT
  // =========================
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#071525",
          color: "#ffffff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Loading enquiries...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#071525",
        color: "#ffffff",
        padding: "35px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* ================= HEADER ================= */}
        <button
          onClick={() => navigate("/owner/dashboard")}
          style={{
            background: "transparent",
            border: "none",
            color: "#55b8ff",
            cursor: "pointer",
            fontSize: "15px",
            marginBottom: "18px",
          }}
        >
          ← Back to Dashboard
        </button>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
            marginBottom: "30px",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "30px",
              }}
            >
              My Enquiries
            </h1>

            <p
              style={{
                color: "#8ea3ba",
                marginTop: "8px",
              }}
            >
              Manage enquiries received for your properties
            </p>
          </div>

          <div
            style={{
              background: "#102238",
              border: "1px solid #1E4E78",
              borderRadius: "10px",
              padding: "12px 18px",
            }}
          >
            <span style={{ color: "#8ea3ba" }}>
              Total Enquiries
            </span>

            <strong
              style={{
                color: "#55b8ff",
                fontSize: "20px",
                marginLeft: "10px",
              }}
            >
              {enquiries.length}
            </strong>
          </div>
        </div>

        {/* ================= ERROR ================= */}
        {message && (
          <div
            style={{
              background: "#421d24",
              color: "#ff8b98",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            {message}
          </div>
        )}

        {/* ================= EMPTY ================= */}
        {enquiries.length === 0 ? (
          <div
            style={{
              background: "#102238",
              border: "1px solid #1E4E78",
              borderRadius: "14px",
              padding: "60px 30px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "48px",
                marginBottom: "15px",
              }}
            >
              📩
            </div>

            <h2>No Enquiries Yet</h2>

            <p
              style={{
                color: "#8ea3ba",
              }}
            >
              You haven't received any property enquiries yet.
            </p>
          </div>
        ) : (
          /* ================= ENQUIRY LIST ================= */
          <div
            style={{
              display: "grid",
              gap: "18px",
            }}
          >
            {enquiries.map((enquiry) => {
              const customer = enquiry.customer;
              const property = enquiry.property;

              return (
                <div
                  key={enquiry._id}
                  style={{
                    background: "#102238",
                    border: "1px solid #1E4E78",
                    borderRadius: "14px",
                    padding: "22px",
                  }}
                >
                  {/* TOP */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "15px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <h2
                        style={{
                          margin: 0,
                          fontSize: "20px",
                        }}
                      >
                        {property?.title ||
                          "Property Enquiry"}
                      </h2>

                      <p
                        style={{
                          color: "#8ea3ba",
                          marginTop: "7px",
                          marginBottom: 0,
                        }}
                      >
                        {property?.city || "Location not available"}
                        {property?.propertyType
                          ? ` • ${property.propertyType}`
                          : ""}
                      </p>
                    </div>

                    <span
                      style={{
                        ...getStatusStyle(enquiry.status),
                        padding: "7px 14px",
                        borderRadius: "20px",
                        fontSize: "13px",
                        fontWeight: "600",
                      }}
                    >
                      {enquiry.status}
                    </span>
                  </div>

                  {/* CONTENT */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(250px, 1fr))",
                      gap: "20px",
                      marginTop: "22px",
                      paddingTop: "20px",
                      borderTop:
                        "1px solid #1E4E78",
                    }}
                  >
                    {/* CUSTOMER */}
                    <div>
                      <h3
                        style={{
                          color: "#55b8ff",
                          fontSize: "15px",
                          marginTop: 0,
                        }}
                      >
                        Customer
                      </h3>

                      <p
                        style={{
                          margin: "8px 0",
                        }}
                      >
                        <strong>
                          {customer?.name || "-"}
                        </strong>
                      </p>

                      <p
                        style={{
                          color: "#b5c4d4",
                          margin: "6px 0",
                        }}
                      >
                        📧 {customer?.email || "-"}
                      </p>

                      <p
                        style={{
                          color: "#b5c4d4",
                          margin: "6px 0",
                        }}
                      >
                        📱 {customer?.mobile || "-"}
                      </p>
                    </div>

                    {/* ENQUIRY */}
                    <div>
                      <h3
                        style={{
                          color: "#55b8ff",
                          fontSize: "15px",
                          marginTop: 0,
                        }}
                      >
                        Enquiry
                      </h3>

                      <p
                        style={{
                          color: "#b5c4d4",
                          lineHeight: "1.6",
                        }}
                      >
                        {enquiry.message ||
                          "No message provided"}
                      </p>

                      <p
                        style={{
                          color: "#8ea3ba",
                          fontSize: "13px",
                        }}
                      >
                        Received:{" "}
                        {formatDate(enquiry.createdAt)}
                      </p>
                    </div>

                    {/* STATUS */}
                    <div>
                      <h3
                        style={{
                          color: "#55b8ff",
                          fontSize: "15px",
                          marginTop: 0,
                        }}
                      >
                        Update Status
                      </h3>

                      <select
                        value={enquiry.status}
                        onChange={(e) =>
                          updateStatus(
                            enquiry._id,
                            e.target.value
                          )
                        }
                        style={{
                          width: "100%",
                          padding: "11px",
                          background: "#071525",
                          border:
                            "1px solid #1E4E78",
                          borderRadius: "7px",
                          color: "#ffffff",
                          outline: "none",
                        }}
                      >
                        <option value="New">
                          New
                        </option>

                        <option value="Contacted">
                          Contacted
                        </option>

                        <option value="Follow up">
                          Follow up
                        </option>

                        <option value="Converted">
                          Converted
                        </option>

                        <option value="Closed">
                          Closed
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerEnquiries;