import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BuilderDashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Invalid user data:", error);
      }
    }

    fetchMyProperties();
  }, []);

  // ==========================================
  // FETCH BUILDER PROPERTIES
  // ==========================================

  const fetchMyProperties = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:9000/properties/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (Array.isArray(response.data)) {
        setProperties(response.data);
      } else if (Array.isArray(response.data.properties)) {
        setProperties(response.data.properties);
      } else {
        setProperties([]);
      }
    } catch (error) {
      console.error("Failed to fetch builder properties:", error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // ==========================================
  // IMAGE
  // ==========================================

  const getImageUrl = (property) => {
    if (property?.bannerImage) {
      return `http://localhost:9000${property.bannerImage}`;
    }

    if (property?.images?.length > 0) {
      return `http://localhost:9000${property.images[0]}`;
    }

    return null;
  };

  // ==========================================
  // PRICE FORMAT
  // ==========================================

  const formatPrice = (price) => {
    if (!price) {
      return "Price on request";
    }

    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    }

    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    }

    return `₹${price.toLocaleString("en-IN")}`;
  };

  // ==========================================
  // PROPERTY STATISTICS
  // ==========================================

  const activeProperties = properties.filter(
    (property) => property.status === "Active"
  ).length;

  const pendingProperties = properties.filter(
    (property) => property.status === "Pending"
  ).length;

  const rejectedProperties = properties.filter(
    (property) => property.status === "Rejected"
  ).length;

  // ==========================================
  // STYLES
  // ==========================================

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
      marginBottom: "32px",
      flexWrap: "wrap",
    },

    welcome: {
      flex: 1,
    },

    smallText: {
      color: "#33c1ff",
      fontSize: "13px",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "1px",
      marginBottom: "8px",
    },

    title: {
      fontSize: "34px",
      fontWeight: "700",
      margin: 0,
    },

    name: {
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
    },

    statsGrid: {
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit, minmax(210px, 1fr))",
      gap: "18px",
      marginBottom: "38px",
    },

    statCard: {
      background: "#102238",
      border: "1px solid #1E4E78",
      borderRadius: "13px",
      padding: "22px",
      display: "flex",
      alignItems: "center",
      gap: "17px",
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

    actionGrid: {
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit, minmax(235px, 1fr))",
      gap: "20px",
      marginBottom: "42px",
    },

    actionCard: {
      background: "#102238",
      border: "1px solid #1E4E78",
      borderRadius: "14px",
      padding: "25px",
      cursor: "pointer",
    },

    actionIcon: {
      fontSize: "34px",
      marginBottom: "14px",
    },

    actionTitle: {
      fontSize: "19px",
      margin: "0 0 9px",
    },

    actionText: {
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

    addButton: {
      background: "#0878e8",
      border: "none",
      color: "#ffffff",
      padding: "10px 17px",
      borderRadius: "7px",
      cursor: "pointer",
      fontWeight: "600",
    },

    propertyGrid: {
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit, minmax(260px, 1fr))",
      gap: "20px",
    },

    propertyCard: {
      background: "#102238",
      border: "1px solid #1E4E78",
      borderRadius: "13px",
      overflow: "hidden",
      cursor: "pointer",
    },

    imageWrapper: {
      height: "180px",
      background: "#0b1f36",
      overflow: "hidden",
      position: "relative",
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
      fontSize: "40px",
      color: "#607991",
    },

    status: {
      position: "absolute",
      top: "12px",
      right: "12px",
      padding: "6px 10px",
      borderRadius: "20px",
      background: "#071525",
      border: "1px solid #1E4E78",
      fontSize: "11px",
      fontWeight: "600",
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

    location: {
      color: "#9db2c8",
      fontSize: "13px",
      marginBottom: "12px",
    },

    price: {
      color: "#33c1ff",
      fontSize: "19px",
      fontWeight: "700",
      marginBottom: "12px",
    },

    details: {
      display: "flex",
      gap: "12px",
      flexWrap: "wrap",
      color: "#b6c8d9",
      fontSize: "12px",
    },

    empty: {
      background: "#102238",
      border: "1px solid #1E4E78",
      borderRadius: "13px",
      padding: "40px",
      textAlign: "center",
      color: "#9db2c8",
    },
  };

  const builderName = user?.name || "Builder";

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* HEADER */}

        <div style={styles.header}>
          <div style={styles.welcome}>

            <div style={styles.smallText}>
              PropNexa Builder Portal
            </div>

            <h1 style={styles.title}>
              Welcome,{" "}
              <span style={styles.name}>
                {builderName}
              </span>{" "}
              👋
            </h1>

            <p style={styles.subtitle}>
              Manage your property listings, monitor approvals,
              manage projects and handle your real estate
              activities from one place.
            </p>

          </div>

          <button
            style={styles.logoutButton}
            onClick={logout}
          >
            Logout
          </button>
        </div>

        {/* STATISTICS */}

        <div style={styles.statsGrid}>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              🏢
            </div>

            <div>
              <h3 style={styles.statNumber}>
                {properties.length}
              </h3>

              <div style={styles.statLabel}>
                My Properties
              </div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              ✅
            </div>

            <div>
              <h3 style={styles.statNumber}>
                {activeProperties}
              </h3>

              <div style={styles.statLabel}>
                Active Properties
              </div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              ⏳
            </div>

            <div>
              <h3 style={styles.statNumber}>
                {pendingProperties}
              </h3>

              <div style={styles.statLabel}>
                Pending Approval
              </div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              ❌
            </div>

            <div>
              <h3 style={styles.statNumber}>
                {rejectedProperties}
              </h3>

              <div style={styles.statLabel}>
                Rejected Properties
              </div>
            </div>
          </div>

        </div>

        {/* QUICK ACTIONS */}

        <h2 style={styles.sectionTitle}>
          Quick Actions
        </h2>

        <div style={styles.actionGrid}>

          {/* ADD PROPERTY */}

          <div
            style={styles.actionCard}
            onClick={() =>
              navigate("/builder/properties/add")
            }
          >

            <div style={styles.actionIcon}>
              ➕
            </div>

            <h3 style={styles.actionTitle}>
              Add Property
            </h3>

            <p style={styles.actionText}>
              Add a new property listing and submit
              it for admin approval.
            </p>

            <button
              style={styles.actionButton}
              onClick={(e) => {
                e.stopPropagation();
                navigate("/builder/properties/add");
              }}
            >
              Add Property
            </button>

          </div>

          {/* MY PROPERTIES */}

          <div
            style={styles.actionCard}
            onClick={() =>
              navigate("/builder/properties")
            }
          >

            <div style={styles.actionIcon}>
              🏘️
            </div>

            <h3 style={styles.actionTitle}>
              My Properties
            </h3>

            <p style={styles.actionText}>
              View, edit and manage all your
              property listings.
            </p>

            <button
              style={styles.actionButton}
              onClick={(e) => {
                e.stopPropagation();
                navigate("/builder/properties");
              }}
            >
              View Properties
            </button>

          </div>

          {/* PROJECTS */}

          <div
            style={styles.actionCard}
            onClick={() =>
              navigate("/builder/projects")
            }
          >

            <div style={styles.actionIcon}>
              🏗️
            </div>

            <h3 style={styles.actionTitle}>
              My Projects
            </h3>

            <p style={styles.actionText}>
              Manage your real estate projects and
              development information.
            </p>

            <button
              style={styles.actionButton}
              onClick={(e) => {
                e.stopPropagation();
                navigate("/builder/projects");
              }}
            >
              View Projects
            </button>

          </div>




          {/* ADD PROJECT */}

<div
  style={styles.actionCard}
  onClick={() =>
    navigate("/builder/projects/add")
  }
>
  <div style={styles.actionIcon}>
    🏗️
  </div>

  <h3 style={styles.actionTitle}>
    Add Project
  </h3>

  <p style={styles.actionText}>
    Create a new real estate project and
    submit it for admin approval.
  </p>

  <button
    style={styles.actionButton}
    onClick={(e) => {
      e.stopPropagation();
      navigate("/builder/projects/add");
    }}
  >
    Add Project
  </button>
</div>






          {/* ENQUIRIES */}

          <div
            style={styles.actionCard}
            onClick={() =>
              navigate("/builder/enquiries")
            }
          >

            <div style={styles.actionIcon}>
              📩
            </div>

            <h3 style={styles.actionTitle}>
              My Enquiries
            </h3>

            <p style={styles.actionText}>
              View customer enquiries related to
              your properties.
            </p>

            <button
              style={styles.actionButton}
              onClick={(e) => {
                e.stopPropagation();
                navigate("/builder/enquiries");
              }}
            >
              View Enquiries
            </button>

          </div>

          {/* PROFILE */}

          <div
            style={styles.actionCard}
            onClick={() =>
              navigate("/builder/profile")
            }
          >

            <div style={styles.actionIcon}>
              👤
            </div>

            <h3 style={styles.actionTitle}>
              Builder Profile
            </h3>

            <p style={styles.actionText}>
              Manage company information, contact
              details and professional information.
            </p>

            <button
              style={styles.actionButton}
              onClick={(e) => {
                e.stopPropagation();
                navigate("/builder/profile");
              }}
            >
              View Profile
            </button>

          </div>

        </div>

        {/* RECENT PROPERTIES */}

        <div style={styles.propertyHeader}>

          <h2 style={styles.sectionTitle}>
            My Recent Properties
          </h2>

          <button
            style={styles.addButton}
            onClick={() =>
              navigate("/builder/properties/add")
            }
          >
            + Add Property
          </button>

        </div>

        {loading ? (
          <div style={styles.empty}>
            Loading your properties...
          </div>
        ) : properties.length === 0 ? (

          <div style={styles.empty}>

            <div
              style={{
                fontSize: "40px",
                marginBottom: "12px",
              }}
            >
              🏢
            </div>

            <h3
              style={{
                color: "#ffffff",
                marginBottom: "8px",
              }}
            >
              No properties yet
            </h3>

            <p>
              Start by adding your first property
              listing.
            </p>

            <button
              style={styles.actionButton}
              onClick={() =>
                navigate("/builder/properties/add")
              }
            >
              Add Your First Property
            </button>

          </div>

        ) : (

          <div style={styles.propertyGrid}>

            {properties.slice(0, 6).map((property) => {

              const imageUrl =
                getImageUrl(property);

              return (

                <div
                  key={property._id}
                  style={styles.propertyCard}
                  onClick={() =>
                    navigate(
                      `/builder/properties/edit/${property._id}`
                    )
                  }
                >

                  <div style={styles.imageWrapper}>

                    {imageUrl ? (

                      <img
                        src={imageUrl}
                        alt={property.title}
                        style={styles.propertyImage}
                      />

                    ) : (

                      <div style={styles.noImage}>
                        🏢
                      </div>

                    )}

                    <span style={styles.status}>
                      {property.status || "Pending"}
                    </span>

                  </div>

                  <div style={styles.propertyContent}>

                    <h3 style={styles.propertyTitle}>
                      {property.title}
                    </h3>

                    <div style={styles.location}>
                      📍 {property.city || "Location unavailable"}

                      {property.state
                        ? `, ${property.state}`
                        : ""}
                    </div>

                    <div style={styles.price}>

                      {property.listingType === "Rent" &&
                      property.monthlyRent
                        ? `₹${property.monthlyRent.toLocaleString(
                            "en-IN"
                          )}/month`
                        : formatPrice(
                            property.expectedPrice
                          )}

                    </div>

                    <div style={styles.details}>

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

export default BuilderDashboard;