import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyProperties = () => {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // =========================
  // FETCH MY PROPERTIES
  // =========================
  const fetchMyProperties = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:9000/properties/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProperties(response.data.properties || []);
    } catch (error) {
      console.error("Fetch my properties error:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to load your properties"
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

    fetchMyProperties();
  }, []);

  // =========================
  // DELETE PROPERTY
  // =========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:9000/properties/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProperties((prev) =>
        prev.filter((property) => property._id !== id)
      );

      alert("Property deleted successfully");
    } catch (error) {
      console.error("Delete property error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete property"
      );
    }
  };

  // =========================
  // STATUS COLOR
  // =========================
  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":
        return {
          background: "#123d2b",
          color: "#35e89a",
        };

      case "Pending":
        return {
          background: "#443815",
          color: "#ffd84d",
        };

      case "Rejected":
        return {
          background: "#421d24",
          color: "#ff6b7a",
        };

      case "Sold":
        return {
          background: "#172f4d",
          color: "#55b8ff",
        };

      case "Rented":
        return {
          background: "#352047",
          color: "#d78cff",
        };

      default:
        return {
          background: "#263244",
          color: "#cbd5e1",
        };
    }
  };

  // =========================
  // PRICE DISPLAY
  // =========================
  const getPrice = (property) => {
    if (property.listingType === "Rent") {
      return property.monthlyRent
        ? `₹${Number(property.monthlyRent).toLocaleString()} / month`
        : "Price not specified";
    }

    if (property.expectedPrice) {
      return `₹${Number(
        property.expectedPrice
      ).toLocaleString()}`;
    }

    return "Price not specified";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#071525",
        color: "#ffffff",
        padding: "35px",
      }}
    >
      {/* ================= HEADER ================= */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "30px",
              fontWeight: "700",
            }}
          >
            My Properties
          </h1>

          <p
            style={{
              color: "#8ea3ba",
              marginTop: "8px",
            }}
          >
            Manage all properties listed by you
          </p>
        </div>

        <button
          onClick={() => navigate("/owner/properties/add")}
          style={{
            background:
              "linear-gradient(135deg, #0878e8, #1251c7)",
            border: "none",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          + Add Property
        </button>
      </div>

      {/* ================= MESSAGE ================= */}
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

      {/* ================= LOADING ================= */}
      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px",
            color: "#8ea3ba",
          }}
        >
          Loading your properties...
        </div>
      ) : properties.length === 0 ? (
        /* ================= EMPTY STATE ================= */
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
              fontSize: "50px",
              marginBottom: "15px",
            }}
          >
            🏠
          </div>

          <h2 style={{ marginBottom: "10px" }}>
            No Properties Yet
          </h2>

          <p
            style={{
              color: "#8ea3ba",
              marginBottom: "25px",
            }}
          >
            You haven't added any properties yet.
          </p>

          <button
            onClick={() =>
              navigate("/owner/properties/add")
            }
            style={{
              background:
                "linear-gradient(135deg, #0878e8, #1251c7)",
              border: "none",
              color: "#ffffff",
              padding: "12px 22px",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Add Your First Property
          </button>
        </div>
      ) : (
        /* ================= PROPERTY GRID ================= */
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "22px",
          }}
        >
          {properties.map((property) => (
            <div
              key={property._id}
              style={{
                background: "#102238",
                border: "1px solid #1E4E78",
                borderRadius: "14px",
                overflow: "hidden",
              }}
            >
              {/* PROPERTY HEADER */}
              <div
                style={{
                  padding: "20px",
                  borderBottom:
                    "1px solid #1E4E78",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px",
                    alignItems: "flex-start",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "19px",
                      lineHeight: "1.4",
                    }}
                  >
                    {property.title}
                  </h3>

                  <span
                    style={{
                      ...getStatusStyle(
                        property.status
                      ),
                      padding: "6px 10px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {property.status}
                  </span>
                </div>

                <p
                  style={{
                    color: "#8ea3ba",
                    marginTop: "10px",
                    marginBottom: 0,
                  }}
                >
                  {property.propertyType} •{" "}
                  {property.listingType}
                </p>
              </div>

              {/* PROPERTY DETAILS */}
              <div style={{ padding: "20px" }}>
                <div
                  style={{
                    color: "#55b8ff",
                    fontSize: "21px",
                    fontWeight: "700",
                    marginBottom: "15px",
                  }}
                >
                  {getPrice(property)}
                </div>

                <div
                  style={{
                    color: "#b5c4d4",
                    lineHeight: "1.8",
                    fontSize: "14px",
                  }}
                >
                  <div>
                    📍{" "}
                    {property.city || "Location not specified"}
                    {property.area
                      ? `, ${property.area}`
                      : ""}
                  </div>

                  {property.bhk && (
                    <div>
                      🛏️ {property.bhk} BHK
                    </div>
                  )}

                  {property.builtUpArea && (
                    <div>
                      📐 {property.builtUpArea}{" "}
                      {property.areaUnit || ""}
                    </div>
                  )}

                  {property.furnishing && (
                    <div>
                      🛋️ {property.furnishing}
                    </div>
                  )}
                </div>

                {/* ACTIONS */}
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "22px",
                  }}
                >
                  <button
                    onClick={() =>
                      navigate(
                        `/properties/${property._id}`
                      )
                    }
                    style={{
                      flex: 1,
                      background: "#173554",
                      border:
                        "1px solid #28618f",
                      color: "#ffffff",
                      padding: "10px",
                      borderRadius: "7px",
                      cursor: "pointer",
                    }}
                  >
                    View
                  </button>

                  <button
  onClick={() =>
    navigate(`/owner/properties/edit/${property._id}`)
  }
  style={{
    background: "#173554",
    border: "1px solid #28618f",
    color: "#ffffff",
    padding: "10px 15px",
    borderRadius: "7px",
    cursor: "pointer",
  }}
>
  Edit
</button>

                  <button
                    onClick={() =>
                      handleDelete(property._id)
                    }
                    style={{
                      background: "#421d24",
                      border:
                        "1px solid #71313b",
                      color: "#ff7180",
                      padding: "10px 15px",
                      borderRadius: "7px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProperties;