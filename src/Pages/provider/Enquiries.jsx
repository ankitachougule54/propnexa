import React, { useEffect, useState } from "react";
import axios from "axios";

function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
        setLoading(false);
        return;
      }

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
      console.error("Error fetching enquiries:", error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to load enquiries.");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (enquiryId, newStatus) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first.");
      return;
    }

    await axios.put(
      `http://localhost:9000/enquiries/${enquiryId}/status`,
      {
        status: newStatus,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Refresh enquiries after updating
    fetchEnquiries();

  } catch (error) {
    console.error("Error updating enquiry status:", error);

    if (error.response?.data?.message) {
      setError(error.response.data.message);
    } else {
      setError("Failed to update enquiry status.");
    }
  }
};

  return (
    <div style={styles.page}>

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>
          Enquiries
        </h1>

        <p style={styles.subtitle}>
          Manage enquiries received from customers
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div style={styles.message}>
          Loading enquiries...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {/* No enquiries */}
      {!loading && !error && enquiries.length === 0 && (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>
            📩
          </div>

          <h2>
            No Enquiries Yet
          </h2>

          <p>
            Customer enquiries for your properties will appear here.
          </p>
        </div>
      )}

      {/* Enquiries */}
      {!loading && !error && enquiries.length > 0 && (
        <div style={styles.container}>

          <h2 style={styles.sectionTitle}>
            {enquiries.length} Enquiries
          </h2>

          <div style={styles.list}>

            {enquiries.map((enquiry) => (
              <div
                key={enquiry._id}
                style={styles.card}
              >

                {/* Property */}
                <div style={styles.propertySection}>

                  <h3 style={styles.propertyTitle}>
                    {enquiry.property?.title || "Property"}
                  </h3>

                  <p style={styles.location}>
                    📍{" "}
                    {enquiry.property?.city || "Location not available"}
                  </p>

                </div>

                {/* Customer */}
                <div style={styles.customerSection}>

                  <p style={styles.label}>
                    Customer
                  </p>

                  <p style={styles.value}>
                    {enquiry.customer?.name || "Unknown Customer"}
                  </p>

                  <p style={styles.contact}>
                    {enquiry.customer?.email || ""}
                  </p>

                  <p style={styles.contact}>
                    {enquiry.customer?.mobile || ""}
                  </p>

                </div>

                {/* Message */}
                <div style={styles.messageSection}>

                  <p style={styles.label}>
                    Message
                  </p>

                  <p style={styles.messageText}>
                    {enquiry.message}
                  </p>

                </div>

                {/* Status */}
                <div style={styles.statusSection}>

  <span style={styles.label}>
    Status
  </span>

  <select
    value={enquiry.status}
    onChange={(e) =>
      updateStatus(enquiry._id, e.target.value)
    }
    style={styles.statusSelect}
  >
    <option value="New">New</option>
    <option value="Contacted">Contacted</option>
    <option value="Follow up">Follow up</option>
    <option value="Converted">Converted</option>
    <option value="Closed">Closed</option>
  </select>

</div>

              </div>
            ))}

          </div>

        </div>
      )}

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
    backgroundColor: "#0b1f36",
    padding: "60px 20px 35px",
    textAlign: "center",
    borderBottom: "1px solid #1E4E78",
  },

  title: {
    margin: "0 0 10px",
    fontSize: "40px",
  },

  subtitle: {
    margin: "0",
    color: "#9eafc1",
    fontSize: "16px",
  },

  container: {
    maxWidth: "1150px",
    margin: "40px auto",
    padding: "0 20px",
  },

  sectionTitle: {
    fontSize: "24px",
    marginBottom: "20px",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  card: {
    backgroundColor: "#102238",
    border: "1px solid #1E4E78",
    borderRadius: "12px",
    padding: "24px",
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr 1.5fr 0.7fr",
    gap: "25px",
    alignItems: "center",
  },

  propertySection: {
    borderRight: "1px solid #1E4E78",
    paddingRight: "20px",
  },

  propertyTitle: {
    margin: "0 0 8px",
    fontSize: "18px",
  },

  location: {
    margin: "0",
    color: "#9eafc1",
    fontSize: "13px",
  },

  customerSection: {
    borderRight: "1px solid #1E4E78",
    paddingRight: "20px",
  },

  label: {
    display: "block",
    color: "#7f91a5",
    fontSize: "12px",
    marginBottom: "6px",
  },

  value: {
    margin: "0 0 5px",
    fontSize: "15px",
    fontWeight: "600",
  },

  contact: {
    margin: "3px 0",
    color: "#9eafc1",
    fontSize: "12px",
  },

  messageSection: {
    borderRight: "1px solid #1E4E78",
    paddingRight: "20px",
  },

  messageText: {
    margin: "0",
    color: "#d4deea",
    fontSize: "14px",
    lineHeight: "1.5",
  },

  statusSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },

  status: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },

  message: {
    textAlign: "center",
    padding: "80px 20px",
    color: "#b8c5d4",
    fontSize: "18px",
  },

  statusSelect: {
  backgroundColor: "#071525",
  color: "#ffffff",
  border: "1px solid #1E4E78",
  borderRadius: "6px",
  padding: "8px 10px",
  fontSize: "13px",
  cursor: "pointer",
  outline: "none",
},

  error: {
    maxWidth: "600px",
    margin: "60px auto",
    padding: "20px",
    textAlign: "center",
    color: "#ff7b7b",
    backgroundColor: "#2a1520",
    border: "1px solid #6b2635",
    borderRadius: "10px",
  },

  empty: {
    textAlign: "center",
    padding: "100px 20px",
    color: "#b8c5d4",
  },

  emptyIcon: {
    fontSize: "55px",
    marginBottom: "15px",
  },
};

export default Enquiries;