import React, { useEffect, useState } from "react";
import axios from "axios";

function PendingProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch Pending Properties
  useEffect(() => {
    fetchPendingProperties();
  }, []);

  const fetchPendingProperties = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:9000/properties/admin/pending",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProperties(response.data.properties);
      setLoading(false);

    } catch (error) {
      console.error(
        "Error fetching pending properties:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to load pending properties"
      );

      setLoading(false);
    }
  };


  // Approve Property
  const handleApprove = async (propertyId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `http://localhost:9000/properties/admin/approve/${propertyId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);

      // Remove approved property from pending list
      setProperties((currentProperties) =>
        currentProperties.filter(
          (property) => property._id !== propertyId
        )
      );

    } catch (error) {
      console.error(
        "Approve property error:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to approve property"
      );
    }
  };


  // Reject Property
  const handleReject = async (propertyId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `http://localhost:9000/properties/admin/reject/${propertyId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);

      // Remove rejected property from pending list
      setProperties((currentProperties) =>
        currentProperties.filter(
          (property) => property._id !== propertyId
        )
      );

    } catch (error) {
      console.error(
        "Reject property error:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to reject property"
      );
    }
  };


  return (
    <div style={styles.page}>

      {/* Header */}
      <div style={styles.header}>

        <div>
          <p style={styles.smallTitle}>
            PROPNEXA ADMIN
          </p>

          <h1 style={styles.heading}>
            Pending Properties
          </h1>

          <p style={styles.description}>
            Review properties submitted by owners,
            agents and builders.
          </p>
        </div>

        <div style={styles.countBox}>
          <span style={styles.countNumber}>
            {properties.length}
          </span>

          <span style={styles.countText}>
            Pending
          </span>
        </div>

      </div>


      {/* Success Message */}
      {message && (
        <div style={styles.successMessage}>
          {message}
        </div>
      )}


      {/* Error Message */}
      {error && (
        <div style={styles.errorMessage}>
          {error}
        </div>
      )}


      {/* Loading */}
      {loading && (
        <div style={styles.centerMessage}>
          Loading pending properties...
        </div>
      )}


      {/* No Properties */}
      {!loading && properties.length === 0 && (
        <div style={styles.emptyBox}>

          <div style={styles.emptyIcon}>
            ✓
          </div>

          <h2 style={styles.emptyTitle}>
            No Pending Properties
          </h2>

          <p style={styles.emptyText}>
            All submitted properties have been reviewed.
          </p>

        </div>
      )}


      {/* Property List */}
      {!loading && properties.length > 0 && (

        <div style={styles.grid}>

          {properties.map((property) => (

            <div
              key={property._id}
              style={styles.card}
            >

              {/* Image */}
              <img
                src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80"
                alt={property.title}
                style={styles.image}
              />


              {/* Content */}
              <div style={styles.cardContent}>

                {/* Status */}
                <span style={styles.status}>
                  PENDING
                </span>


                {/* Title */}
                <h2 style={styles.propertyTitle}>
                  {property.title}
                </h2>


                {/* Location */}
                <p style={styles.location}>
                  📍 {property.city}, {property.state}
                </p>


                {/* Property Information */}
                <div style={styles.infoGrid}>

                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>
                      Type
                    </span>

                    <strong>
                      {property.propertyType}
                    </strong>
                  </div>


                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>
                      Listing
                    </span>

                    <strong>
                      {property.listingType}
                    </strong>
                  </div>


                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>
                      BHK
                    </span>

                    <strong>
                      {property.bhk || "-"}
                    </strong>
                  </div>


                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>
                      Area
                    </span>

                    <strong>
                      {property.builtUpArea ||
                        property.carpetArea ||
                        property.plotArea ||
                        "-"}{" "}
                      {property.areaUnit || ""}
                    </strong>
                  </div>

                </div>


                {/* Price */}
                <div style={styles.price}>
                  ₹
                  {Number(
                    property.expectedPrice || 0
                  ).toLocaleString("en-IN")}
                </div>


                {/* Owner */}
                {property.owner && (
                  <div style={styles.ownerBox}>

                    <p style={styles.ownerHeading}>
                      Submitted By
                    </p>

                    <p style={styles.ownerName}>
                      {property.owner.name}
                    </p>

                    <p style={styles.ownerDetails}>
                      {property.owner.email}
                    </p>

                    <p style={styles.ownerDetails}>
                      {property.owner.mobile}
                    </p>

                    <span style={styles.roleBadge}>
                      {property.owner.role}
                    </span>

                  </div>
                )}


                {/* Buttons */}
                <div style={styles.actions}>

                  <button
                    style={styles.approveButton}
                    onClick={() =>
                      handleApprove(property._id)
                    }
                  >
                    ✓ Approve
                  </button>


                  <button
                    style={styles.rejectButton}
                    onClick={() =>
                      handleReject(property._id)
                    }
                  >
                    ✕ Reject
                  </button>

                </div>

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
    minHeight: "100vh",
    backgroundColor: "#071525",
    color: "#ffffff",
    padding: "40px",
  },


  header: {
    maxWidth: "1200px",
    margin: "0 auto 35px",
    padding: "25px",
    backgroundColor: "#0b1f36",
    border: "1px solid #1E4E78",
    borderRadius: "14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },


  smallTitle: {
    color: "#33c1ff",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "2px",
    margin: "0 0 8px",
  },


  heading: {
    margin: "0",
    fontSize: "32px",
  },


  description: {
    color: "#9eafc1",
    margin: "10px 0 0",
  },


  countBox: {
    minWidth: "110px",
    padding: "18px",
    textAlign: "center",
    backgroundColor: "#102238",
    border: "1px solid #1E4E78",
    borderRadius: "10px",
  },


  countNumber: {
    display: "block",
    color: "#33c1ff",
    fontSize: "30px",
    fontWeight: "700",
  },


  countText: {
    color: "#9eafc1",
    fontSize: "13px",
  },


  grid: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: "25px",
  },


  card: {
    backgroundColor: "#102238",
    border: "1px solid #1E4E78",
    borderRadius: "14px",
    overflow: "hidden",
  },


  image: {
    width: "100%",
    height: "210px",
    objectFit: "cover",
  },


  cardContent: {
    padding: "20px",
  },


  status: {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "20px",
    backgroundColor: "#3d3214",
    color: "#ffc107",
    fontSize: "11px",
    fontWeight: "700",
  },


  propertyTitle: {
    fontSize: "20px",
    margin: "12px 0 8px",
  },


  location: {
    color: "#9eafc1",
    fontSize: "14px",
  },


  infoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, 1fr)",
    gap: "10px",
    marginTop: "18px",
  },


  infoItem: {
    padding: "10px",
    backgroundColor: "#0b1f36",
    borderRadius: "7px",
  },


  infoLabel: {
    display: "block",
    color: "#71869b",
    fontSize: "11px",
    marginBottom: "4px",
  },


  price: {
    marginTop: "18px",
    color: "#33c1ff",
    fontSize: "22px",
    fontWeight: "700",
  },


  ownerBox: {
    marginTop: "18px",
    padding: "13px",
    backgroundColor: "#0b1f36",
    border: "1px solid #1E4E78",
    borderRadius: "8px",
  },


  ownerHeading: {
    color: "#71869b",
    fontSize: "11px",
    margin: "0 0 5px",
  },


  ownerName: {
    fontWeight: "700",
    margin: "0 0 3px",
  },


  ownerDetails: {
    color: "#9eafc1",
    fontSize: "12px",
    margin: "3px 0",
  },


  roleBadge: {
    display: "inline-block",
    marginTop: "7px",
    padding: "4px 8px",
    backgroundColor: "#1251c7",
    borderRadius: "5px",
    fontSize: "10px",
    textTransform: "uppercase",
  },


  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  },


  approveButton: {
    flex: "1",
    padding: "11px",
    border: "none",
    borderRadius: "7px",
    backgroundColor: "#16834b",
    color: "#ffffff",
    fontWeight: "700",
    cursor: "pointer",
  },


  rejectButton: {
    flex: "1",
    padding: "11px",
    border: "none",
    borderRadius: "7px",
    backgroundColor: "#9b2c3b",
    color: "#ffffff",
    fontWeight: "700",
    cursor: "pointer",
  },


  successMessage: {
    maxWidth: "1200px",
    margin: "0 auto 20px",
    padding: "13px 18px",
    backgroundColor: "#123b2b",
    border: "1px solid #16834b",
    borderRadius: "8px",
    color: "#6ee7a8",
  },


  errorMessage: {
    maxWidth: "1200px",
    margin: "0 auto 20px",
    padding: "13px 18px",
    backgroundColor: "#3a1820",
    border: "1px solid #9b2c3b",
    borderRadius: "8px",
    color: "#ff8b98",
  },


  centerMessage: {
    textAlign: "center",
    padding: "80px",
    color: "#9eafc1",
  },


  emptyBox: {
    maxWidth: "600px",
    margin: "80px auto",
    padding: "50px",
    textAlign: "center",
    backgroundColor: "#102238",
    border: "1px solid #1E4E78",
    borderRadius: "14px",
  },


  emptyIcon: {
    fontSize: "45px",
    color: "#33c1ff",
  },


  emptyTitle: {
    margin: "15px 0 8px",
  },


  emptyText: {
    color: "#9eafc1",
  },

};


export default PendingProperties;