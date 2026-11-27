import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CustomerEnquiries = () => {
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
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:9000/enquiries/customer",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEnquiries(
        response.data.enquiries ||
        response.data.data ||
        []
      );
    } catch (error) {
      console.error("Fetch customer enquiries error:", error);

      setError(
        error.response?.data?.message ||
        "Failed to load your enquiries."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      New: {
        background: "#0878e8",
        color: "#ffffff",
      },

      Contacted: {
        background: "#8e44ad",
        color: "#ffffff",
      },

      "Follow up": {
        background: "#f39c12",
        color: "#ffffff",
      },

      Converted: {
        background: "#27ae60",
        color: "#ffffff",
      },

      Closed: {
        background: "#7f8c8d",
        color: "#ffffff",
      },
    };

    return (
      styles[status] || {
        background: "#34495e",
        color: "#ffffff",
      }
    );
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#071525",
      color: "#ffffff",
      padding: "40px",
    },

    container: {
      maxWidth: "1200px",
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
      fontWeight: "700",
    },

    subtitle: {
      color: "#9db2c8",
      marginTop: "8px",
    },

    backButton: {
      background: "#102238",
      color: "#ffffff",
      border: "1px solid #1E4E78",
      padding: "11px 18px",
      borderRadius: "8px",
      cursor: "pointer",
    },

    loading: {
      textAlign: "center",
      padding: "60px",
      color: "#9db2c8",
    },

    error: {
      background: "#3a1717",
      border: "1px solid #8b3030",
      color: "#ffb3b3",
      padding: "16px",
      borderRadius: "10px",
      marginBottom: "20px",
    },

    empty: {
      background: "#102238",
      border: "1px solid #1E4E78",
      borderRadius: "14px",
      padding: "60px 20px",
      textAlign: "center",
    },

    emptyIcon: {
      fontSize: "50px",
      marginBottom: "15px",
    },

    emptyText: {
      color: "#9db2c8",
      marginBottom: "25px",
    },

    browseButton: {
      background: "#0878e8",
      color: "#ffffff",
      border: "none",
      padding: "12px 22px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
    },

    grid: {
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit, minmax(320px, 1fr))",
      gap: "22px",
    },

    card: {
      background: "#102238",
      border: "1px solid #1E4E78",
      borderRadius: "14px",
      padding: "24px",
    },

    cardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "15px",
      marginBottom: "18px",
    },

    propertyTitle: {
      margin: 0,
      fontSize: "20px",
      color: "#ffffff",
    },

    status: {
      padding: "6px 10px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "600",
      whiteSpace: "nowrap",
    },

    info: {
      marginBottom: "15px",
    },

    label: {
      color: "#6f8ca8",
      fontSize: "13px",
      marginBottom: "4px",
    },

    value: {
      color: "#ffffff",
      margin: 0,
    },

    messageBox: {
      background: "#071525",
      borderRadius: "9px",
      padding: "14px",
      marginTop: "18px",
      marginBottom: "18px",
    },

    message: {
      color: "#c7d5e3",
      lineHeight: "1.6",
      margin: 0,
    },

    date: {
      color: "#7891aa",
      fontSize: "13px",
    },

    viewButton: {
      width: "100%",
      background: "#0878e8",
      color: "#ffffff",
      border: "none",
      padding: "11px",
      borderRadius: "7px",
      cursor: "pointer",
      marginTop: "18px",
      fontWeight: "600",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* HEADER */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              My Enquiries
            </h1>

            <p style={styles.subtitle}>
              Track your property enquiries and their current status.
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

        {/* LOADING */}
        {loading ? (
          <div style={styles.loading}>
            Loading your enquiries...
          </div>
        ) : enquiries.length === 0 ? (

          /* EMPTY STATE */
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>
              📩
            </div>

            <h2>
              No Enquiries Yet
            </h2>

            <p style={styles.emptyText}>
              You haven't sent any property enquiries yet.
            </p>

            <button
              style={styles.browseButton}
              onClick={() =>
                navigate("/properties")
              }
            >
              Browse Properties
            </button>
          </div>

        ) : (

          /* ENQUIRY CARDS */
          <div style={styles.grid}>

            {enquiries.map((enquiry) => {

              const property =
                enquiry.property || {};

              const propertyId =
                property._id || enquiry.property;

              const propertyTitle =
                property.title ||
                enquiry.propertyTitle ||
                "Property";

              const propertyCity =
                property.city ||
                "Location not available";

              const status =
                enquiry.status || "New";

              return (
                <div
                  key={enquiry._id}
                  style={styles.card}
                >

                  {/* CARD HEADER */}
                  <div style={styles.cardHeader}>

                    <h2 style={styles.propertyTitle}>
                      {propertyTitle}
                    </h2>

                    <span
                      style={{
                        ...styles.status,
                        ...getStatusStyle(status),
                      }}
                    >
                      {status}
                    </span>

                  </div>

                  {/* PROPERTY */}
                  <div style={styles.info}>
                    <div style={styles.label}>
                      Property
                    </div>

                    <p style={styles.value}>
                      {property.propertyType ||
                        "Property"}
                    </p>
                  </div>

                  {/* LOCATION */}
                  <div style={styles.info}>
                    <div style={styles.label}>
                      Location
                    </div>

                    <p style={styles.value}>
                      {propertyCity}
                    </p>
                  </div>

                  {/* MESSAGE */}
                  <div style={styles.messageBox}>
                    <div style={styles.label}>
                      Your Message
                    </div>

                    <p style={styles.message}>
                      {enquiry.message ||
                        "No message provided."}
                    </p>
                  </div>

                  {/* DATE */}
                  <div style={styles.date}>
                    Enquiry sent:{" "}
                    {formatDate(
                      enquiry.createdAt ||
                      enquiry.date
                    )}
                  </div>

                  {/* VIEW PROPERTY */}
                  {propertyId && (
                    <button
                      style={styles.viewButton}
                      onClick={() =>
                        navigate(
                          `/properties/${propertyId}`
                        )
                      }
                    >
                      View Property
                    </button>
                  )}

                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
};

export default CustomerEnquiries;