import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function BuilderProperties() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9000/properties/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProperties(
        Array.isArray(response.data)
          ? response.data
          : response.data.properties || []
      );
    } catch (error) {
      console.error("Failed to fetch builder properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    if (status === "Active") {
      return {
        background: "#dcfce7",
        color: "#166534",
      };
    }

    if (status === "Pending") {
      return {
        background: "#fef3c7",
        color: "#92400e",
      };
    }

    if (status === "Rejected") {
      return {
        background: "#fee2e2",
        color: "#991b1b",
      };
    }

    return {
      background: "#e5e7eb",
      color: "#374151",
    };
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
        Loading properties...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#071525",
        color: "white",
        padding: "40px",
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
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "32px",
              }}
            >
              My Properties
            </h1>

            <p
              style={{
                color: "#9ca3af",
                marginTop: "8px",
              }}
            >
              Manage properties listed by your builder account.
            </p>
          </div>

          <button
            onClick={() => navigate("/builder/properties/add")}
            style={{
              background: "#0878e8",
              color: "white",
              border: "none",
              padding: "12px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            + Add Property
          </button>
        </div>

        {/* EMPTY STATE */}
        {properties.length === 0 ? (
          <div
            style={{
              background: "#102238",
              border: "1px solid #1E4E78",
              borderRadius: "12px",
              padding: "60px 20px",
              textAlign: "center",
            }}
          >
            <h2>No Properties Yet</h2>

            <p
              style={{
                color: "#9ca3af",
              }}
            >
              You have not added any properties yet.
            </p>

            <button
              onClick={() => navigate("/builder/properties/add")}
              style={{
                marginTop: "15px",
                background: "#0878e8",
                color: "white",
                border: "none",
                padding: "12px 20px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Add Your First Property
            </button>
          </div>
        ) : (
          <>
            {/* PROPERTY COUNT */}
            <div
              style={{
                marginBottom: "20px",
                color: "#cbd5e1",
              }}
            >
              Total Properties:{" "}
              <strong style={{ color: "#33c1ff" }}>
                {properties.length}
              </strong>
            </div>

            {/* PROPERTY GRID */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "22px",
              }}
            >
              {properties.map((property) => {
                const image =
                  property.bannerImage ||
                  property.images?.[0] ||
                  "";

                return (
                  <div
                    key={property._id}
                    style={{
                      background: "#102238",
                      border: "1px solid #1E4E78",
                      borderRadius: "12px",
                      overflow: "hidden",
                    }}
                  >
                    {/* IMAGE */}
                    <div
                      style={{
                        height: "190px",
                        background: "#0b1f36",
                        overflow: "hidden",
                      }}
                    >
                      {image ? (
                        <img
                          src={`http://localhost:9000${image}`}
                          alt={property.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#64748b",
                          }}
                        >
                          No Image
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div style={{ padding: "18px" }}>
                      <h3
                        style={{
                          marginTop: 0,
                          marginBottom: "10px",
                        }}
                      >
                        {property.title}
                      </h3>

                      <p
                        style={{
                          color: "#9ca3af",
                          margin: "6px 0",
                        }}
                      >
                        {property.propertyType} •{" "}
                        {property.listingType}
                      </p>

                      <p
                        style={{
                          color: "#cbd5e1",
                          margin: "6px 0",
                        }}
                      >
                        📍 {property.city}, {property.state}
                      </p>

                      {property.expectedPrice && (
                        <p
                          style={{
                            color: "#33c1ff",
                            fontWeight: "600",
                            margin: "10px 0",
                          }}
                        >
                          ₹{" "}
                          {Number(
                            property.expectedPrice
                          ).toLocaleString("en-IN")}
                        </p>
                      )}

                      {/* STATUS */}
                      <span
                        style={{
                          display: "inline-block",
                          padding: "6px 10px",
                          borderRadius: "20px",
                          fontSize: "13px",
                          fontWeight: "600",
                          ...getStatusStyle(property.status),
                        }}
                      >
                        {property.status}
                      </span>

                      {/* ACTION */}
                      <button
                        onClick={() =>
                          navigate(
                            `/builder/properties/edit/${property._id}`
                          )
                        }
                        style={{
                          width: "100%",
                          marginTop: "16px",
                          padding: "10px",
                          borderRadius: "7px",
                          border: "1px solid #0878e8",
                          background: "transparent",
                          color: "#33c1ff",
                          cursor: "pointer",
                        }}
                      >
                        Edit Property
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default BuilderProperties;