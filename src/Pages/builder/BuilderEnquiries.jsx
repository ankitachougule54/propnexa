import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function BuilderEnquiries() {
  const navigate = useNavigate();

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9000/enquiries",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEnquiries(
        Array.isArray(response.data)
          ? response.data
          : response.data.enquiries || []
      );
    } catch (err) {
      console.error("Fetch builder enquiries error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load enquiries."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:9000/enquiries/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchEnquiries();
    } catch (err) {
      console.error("Update enquiry error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update enquiry."
      );
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "New":
        return {
          background: "#dbeafe",
          color: "#1d4ed8",
        };

      case "Contacted":
        return {
          background: "#fef3c7",
          color: "#92400e",
        };

      case "Follow up":
        return {
          background: "#ede9fe",
          color: "#6d28d9",
        };

      case "Converted":
        return {
          background: "#dcfce7",
          color: "#166534",
        };

      case "Closed":
        return {
          background: "#e5e7eb",
          color: "#374151",
        };

      default:
        return {
          background: "#e5e7eb",
          color: "#374151",
        };
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#071525",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "20px",
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
        color: "white",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "32px",
              }}
            >
              Builder Enquiries
            </h1>

            <p
              style={{
                color: "#9ca3af",
                marginTop: "8px",
              }}
            >
              Manage enquiries received for your properties.
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/builder/dashboard")
            }
            style={{
              background: "#102238",
              border: "1px solid #1E4E78",
              color: "#33c1ff",
              padding: "10px 18px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            ← Dashboard
          </button>
        </div>

        {/* ERROR */}

        {error && (
          <div
            style={{
              background: "#450a0a",
              border: "1px solid #ef4444",
              color: "#fecaca",
              padding: "14px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {/* COUNT */}

        <div
          style={{
            background: "#102238",
            border: "1px solid #1E4E78",
            borderRadius: "10px",
            padding: "18px 20px",
            marginBottom: "22px",
          }}
        >
          Total Enquiries:{" "}
          <strong style={{ color: "#33c1ff" }}>
            {enquiries.length}
          </strong>
        </div>

        {/* EMPTY */}

        {enquiries.length === 0 ? (
          <div
            style={{
              background: "#102238",
              border: "1px solid #1E4E78",
              borderRadius: "12px",
              padding: "60px 20px",
              textAlign: "center",
            }}
          >
            <h2>No Enquiries Yet</h2>

            <p
              style={{
                color: "#9ca3af",
              }}
            >
              No customer enquiries have been received
              for your properties yet.
            </p>
          </div>
        ) : (
          /* ENQUIRY LIST */

          <div
            style={{
              display: "grid",
              gap: "18px",
            }}
          >
            {enquiries.map((enquiry) => (
              <div
                key={enquiry._id}
                style={{
                  background: "#102238",
                  border: "1px solid #1E4E78",
                  borderRadius: "12px",
                  padding: "22px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "20px",
                    flexWrap: "wrap",
                  }}
                >
                  {/* LEFT */}

                  <div
                    style={{
                      flex: 1,
                      minWidth: "260px",
                    }}
                  >
                    <h2
                      style={{
                        marginTop: 0,
                        marginBottom: "10px",
                      }}
                    >
                      {enquiry.property?.title ||
                        "Property Enquiry"}
                    </h2>

                    <p
                      style={{
                        color: "#33c1ff",
                        margin: "6px 0",
                      }}
                    >
                      Customer:{" "}
                      <strong>
                        {enquiry.customer?.name ||
                          "Unknown Customer"}
                      </strong>
                    </p>

                    {enquiry.customer?.email && (
                      <p
                        style={{
                          color: "#cbd5e1",
                          margin: "6px 0",
                        }}
                      >
                        📧 {enquiry.customer.email}
                      </p>
                    )}

                    {enquiry.customer?.mobile && (
                      <p
                        style={{
                          color: "#cbd5e1",
                          margin: "6px 0",
                        }}
                      >
                        📞 {enquiry.customer.mobile}
                      </p>
                    )}

                    {enquiry.message && (
                      <div
                        style={{
                          marginTop: "15px",
                          background: "#0b1f36",
                          borderRadius: "8px",
                          padding: "14px",
                          color: "#cbd5e1",
                        }}
                      >
                        <strong
                          style={{
                            color: "white",
                          }}
                        >
                          Message
                        </strong>

                        <p
                          style={{
                            marginBottom: 0,
                            lineHeight: "1.6",
                          }}
                        >
                          {enquiry.message}
                        </p>
                      </div>
                    )}

                    {enquiry.createdAt && (
                      <p
                        style={{
                          color: "#64748b",
                          fontSize: "13px",
                          marginTop: "15px",
                        }}
                      >
                        Received:{" "}
                        {new Date(
                          enquiry.createdAt
                        ).toLocaleString("en-IN")}
                      </p>
                    )}
                  </div>

                  {/* RIGHT */}

                  <div
                    style={{
                      minWidth: "180px",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        padding: "7px 12px",
                        borderRadius: "20px",
                        fontSize: "13px",
                        fontWeight: "600",
                        ...getStatusStyle(
                          enquiry.status
                        ),
                      }}
                    >
                      {enquiry.status || "New"}
                    </span>

                    <div
                      style={{
                        marginTop: "15px",
                      }}
                    >
                      <label
                        style={{
                          display: "block",
                          color: "#94a3b8",
                          fontSize: "13px",
                          marginBottom: "6px",
                        }}
                      >
                        Update Status
                      </label>

                      <select
                        value={
                          enquiry.status || "New"
                        }
                        onChange={(e) =>
                          updateStatus(
                            enquiry._id,
                            e.target.value
                          )
                        }
                        style={{
                          width: "100%",
                          padding: "9px",
                          background: "#0b1f36",
                          color: "white",
                          border:
                            "1px solid #1E4E78",
                          borderRadius: "7px",
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BuilderEnquiries;