import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CustomerDashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Invalid user data:", error);
      }
    }

    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoadingProperties(true);

      const response = await axios.get(
        "http://localhost:9000/properties?sort=latest"
      );

      const data = response.data;

      if (Array.isArray(data)) {
        setProperties(data.slice(0, 4));
      } else if (Array.isArray(data.properties)) {
        setProperties(data.properties.slice(0, 4));
      } else {
        setProperties([]);
      }
    } catch (error) {
      console.error("Failed to fetch properties:", error);
      setProperties([]);
    } finally {
      setLoadingProperties(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getImageUrl = (property) => {
    if (property?.bannerImage) {
      return `http://localhost:9000${property.bannerImage}`;
    }

    if (property?.images?.length > 0) {
      return `http://localhost:9000${property.images[0]}`;
    }

    return null;
  };

  const formatPrice = (price) => {
    if (!price) return "Price on request";

    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    }

    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    }

    return `₹${price.toLocaleString("en-IN")}`;
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#071525",
      color: "#ffffff",
      padding: "35px 25px 60px",
      boxSizing: "border-box",
    },

    container: {
      maxWidth: "1250px",
      margin: "0 auto",
    },

    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "20px",
      marginBottom: "30px",
      flexWrap: "wrap",
    },

    welcomeSection: {
      flex: 1,
    },

    smallText: {
      color: "#33c1ff",
      fontSize: "14px",
      fontWeight: "600",
      marginBottom: "8px",
      textTransform: "uppercase",
      letterSpacing: "1px",
    },

    title: {
      fontSize: "34px",
      fontWeight: "700",
      margin: 0,
    },

    titleName: {
      color: "#33c1ff",
    },

    subtitle: {
      color: "#9db2c8",
      marginTop: "9px",
      fontSize: "15px",
      lineHeight: "1.6",
    },

    logoutButton: {
      background: "#ff5733",
      border: "none",
      color: "#ffffff",
      padding: "12px 24px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "14px",
    },

    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
      gap: "18px",
      marginBottom: "35px",
    },

    statCard: {
      background: "#102238",
      border: "1px solid #1E4E78",
      borderRadius: "12px",
      padding: "22px",
      display: "flex",
      alignItems: "center",
      gap: "18px",
    },

    statIcon: {
      width: "52px",
      height: "52px",
      borderRadius: "12px",
      background: "#0b3157",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "25px",
      flexShrink: 0,
    },

    statNumber: {
      fontSize: "25px",
      fontWeight: "700",
      margin: 0,
    },

    statLabel: {
      color: "#9db2c8",
      fontSize: "13px",
      marginTop: "5px",
    },

    sectionTitle: {
      fontSize: "23px",
      margin: "0 0 18px",
      fontWeight: "700",
    },

    quickGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      gap: "20px",
      marginBottom: "40px",
    },

    quickCard: {
      background: "#102238",
      border: "1px solid #1E4E78",
      borderRadius: "14px",
      padding: "25px",
      cursor: "pointer",
      transition: "0.3s",
    },

    quickIcon: {
      fontSize: "34px",
      marginBottom: "15px",
    },

    quickTitle: {
      fontSize: "19px",
      margin: "0 0 9px",
    },

    quickText: {
      color: "#9db2c8",
      fontSize: "14px",
      lineHeight: "1.6",
      minHeight: "45px",
    },

    actionButton: {
      marginTop: "15px",
      background: "#0878e8",
      border: "none",
      color: "#ffffff",
      padding: "10px 17px",
      borderRadius: "7px",
      cursor: "pointer",
      fontWeight: "600",
    },

    propertyHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "15px",
      marginBottom: "18px",
      flexWrap: "wrap",
    },

    viewAllButton: {
      background: "transparent",
      border: "1px solid #0878e8",
      color: "#33c1ff",
      padding: "9px 16px",
      borderRadius: "7px",
      cursor: "pointer",
      fontWeight: "600",
    },

    propertyGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "20px",
    },

    propertyCard: {
      background: "#102238",
      border: "1px solid #1E4E78",
      borderRadius: "13px",
      overflow: "hidden",
      cursor: "pointer",
    },

    propertyImageWrapper: {
      height: "180px",
      background: "#0b1f36",
      overflow: "hidden",
    },

    propertyImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },

    noImage: {
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#6f879f",
      fontSize: "40px",
    },

    propertyContent: {
      padding: "18px",
    },

    propertyTitle: {
      fontSize: "18px",
      margin: "0 0 8px",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },

    propertyLocation: {
      color: "#9db2c8",
      fontSize: "13px",
      marginBottom: "12px",
    },

    propertyPrice: {
      color: "#33c1ff",
      fontSize: "19px",
      fontWeight: "700",
      marginBottom: "12px",
    },

    propertyDetails: {
      display: "flex",
      gap: "12px",
      flexWrap: "wrap",
      color: "#b6c8d9",
      fontSize: "12px",
    },

    emptyBox: {
      background: "#102238",
      border: "1px solid #1E4E78",
      borderRadius: "12px",
      padding: "35px",
      textAlign: "center",
      color: "#9db2c8",
    },
  };

  const customerName = user?.name || "Customer";

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* HEADER */}
        <div style={styles.header}>
          <div style={styles.welcomeSection}>
            <div style={styles.smallText}>
              PropNexa Customer Portal
            </div>

            <h1 style={styles.title}>
              Welcome,{" "}
              <span style={styles.titleName}>
                {customerName}
              </span>
              👋
            </h1>

            <p style={styles.subtitle}>
              Find your perfect property, manage enquiries and keep track
              of your favourite properties.
            </p>
          </div>

          <button
            style={styles.logoutButton}
            onClick={logout}
          >
            Logout
          </button>
        </div>

        {/* STATS */}
        <div style={styles.statsGrid}>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>🏠</div>

            <div>
              <h3 style={styles.statNumber}>
                {properties.length}
              </h3>

              <div style={styles.statLabel}>
                Latest Properties
              </div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>❤️</div>

            <div>
              <h3 style={styles.statNumber}>
                —
              </h3>

              <div style={styles.statLabel}>
                Saved Properties
              </div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>📩</div>

            <div>
              <h3 style={styles.statNumber}>
                —
              </h3>

              <div style={styles.statLabel}>
                My Enquiries
              </div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>👤</div>

            <div>
              <h3 style={styles.statNumber}>
                ✓
              </h3>

              <div style={styles.statLabel}>
                Account
              </div>
            </div>
          </div>

        </div>

        {/* QUICK ACTIONS */}
        <h2 style={styles.sectionTitle}>
          Quick Actions
        </h2>

        <div style={styles.quickGrid}>

          {/* Browse */}
          <div
            style={styles.quickCard}
            onClick={() => navigate("/properties")}
          >
            <div style={styles.quickIcon}>
              🏠
            </div>

            <h3 style={styles.quickTitle}>
              Browse Properties
            </h3>

            <p style={styles.quickText}>
              Explore properties available for sale, rent and lease.
            </p>

            <button
              style={styles.actionButton}
              onClick={(e) => {
                e.stopPropagation();
                navigate("/properties");
              }}
            >
              Browse Now
            </button>
          </div>

          {/* Wishlist */}
          <div
            style={styles.quickCard}
            onClick={() => navigate("/wishlist")}
          >
            <div style={styles.quickIcon}>
              ❤️
            </div>

            <h3 style={styles.quickTitle}>
              My Wishlist
            </h3>

            <p style={styles.quickText}>
              View properties that you have saved for later.
            </p>

            <button
              style={styles.actionButton}
              onClick={(e) => {
                e.stopPropagation();
                navigate("/wishlist");
              }}
            >
              View Wishlist
            </button>
          </div>

          {/* Enquiries */}
          <div
            style={styles.quickCard}
            onClick={() => navigate("/customer/enquiries")}
          >
            <div style={styles.quickIcon}>
              📩
            </div>

            <h3 style={styles.quickTitle}>
              My Enquiries
            </h3>

            <p style={styles.quickText}>
              Track your property enquiries and communication.
            </p>

            <button
              style={styles.actionButton}
              onClick={(e) => {
                e.stopPropagation();
                navigate("/customer/enquiries");
              }}
            >
              View Enquiries
            </button>
          </div>

          {/* Profile */}
          <div
            style={styles.quickCard}
            onClick={() => navigate("/customer/profile")}
          >
            <div style={styles.quickIcon}>
              👤
            </div>

            <h3 style={styles.quickTitle}>
              My Profile
            </h3>

            <p style={styles.quickText}>
              View and manage your customer account information.
            </p>

            <button
              style={styles.actionButton}
              onClick={(e) => {
                e.stopPropagation();
                navigate("/customer/profile");
              }}
            >
              View Profile
            </button>
          </div>

        </div>

        {/* LATEST PROPERTIES */}
        <div style={styles.propertyHeader}>
          <h2 style={styles.sectionTitle}>
            Latest Properties
          </h2>

          <button
            style={styles.viewAllButton}
            onClick={() => navigate("/properties")}
          >
            View All Properties →
          </button>
        </div>

        {loadingProperties ? (
          <div style={styles.emptyBox}>
            Loading latest properties...
          </div>
        ) : properties.length === 0 ? (
          <div style={styles.emptyBox}>
            <div style={{ fontSize: "35px", marginBottom: "10px" }}>
              🏠
            </div>

            <div>
              No active properties available right now.
            </div>

            <button
              style={styles.actionButton}
              onClick={() => navigate("/properties")}
            >
              Explore Properties
            </button>
          </div>
        ) : (
          <div style={styles.propertyGrid}>

            {properties.map((property) => {
              const imageUrl = getImageUrl(property);

              return (
                <div
                  key={property._id}
                  style={styles.propertyCard}
                  onClick={() =>
                    navigate(`/properties/${property._id}`)
                  }
                >

                  <div style={styles.propertyImageWrapper}>
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={property.title}
                        style={styles.propertyImage}
                      />
                    ) : (
                      <div style={styles.noImage}>
                        🏠
                      </div>
                    )}
                  </div>

                  <div style={styles.propertyContent}>

                    <h3 style={styles.propertyTitle}>
                      {property.title}
                    </h3>

                    <div style={styles.propertyLocation}>
                      📍{" "}
                      {property.city || "Location unavailable"}
                      {property.state
                        ? `, ${property.state}`
                        : ""}
                    </div>

                    <div style={styles.propertyPrice}>
                      {property.listingType === "Rent" &&
                      property.monthlyRent
                        ? `₹${property.monthlyRent.toLocaleString(
                            "en-IN"
                          )}/month`
                        : formatPrice(property.expectedPrice)}
                    </div>

                    <div style={styles.propertyDetails}>
                      {property.bhk && (
                        <span>
                          🛏 {property.bhk} BHK
                        </span>
                      )}

                      {property.builtUpArea && (
                        <span>
                          📐 {property.builtUpArea}{" "}
                          {property.areaUnit || "sq.ft"}
                        </span>
                      )}

                      {property.propertyType && (
                        <span>
                          🏷 {property.propertyType}
                        </span>
                      )}
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

export default CustomerDashboard;