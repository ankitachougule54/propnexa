import React, { useEffect, useState } from "react";
import axios from "axios";
import PropertyCard from "./PropertyCard";

function FeaturedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9000/properties"
      );

      setProperties(response.data.properties);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching properties:", error);
      setError("Failed to load properties");
      setLoading(false);
    }
  };

  return (
    <section style={styles.section}>

      {/* Heading */}
      <div style={styles.headingBox}>

        <div>
          <p style={styles.smallTitle}>
            EXPLORE PROPERTIES
          </p>

          <h2 style={styles.heading}>
            Featured Properties
          </h2>
        </div>

        <button style={styles.viewAll}>
          View All Properties →
        </button>

      </div>

      {/* Loading */}
      {loading && (
        <p style={styles.message}>
          Loading properties...
        </p>
      )}

      {/* Error */}
      {error && (
        <p style={styles.error}>
          {error}
        </p>
      )}

      {/* Properties */}
      {!loading && !error && (
        <div style={styles.grid}>

          {properties.map((property) => (
            <PropertyCard
              key={property._id}
              property={{
                // IMPORTANT: Keep MongoDB ID
                _id: property._id,

                title: property.title,

                location: `${property.city}, ${property.state}`,

                bhk: property.bhk || "-",

                bathrooms: property.bathrooms || "-",

                area:
                  property.builtUpArea ||
                  property.carpetArea ||
                  "-",

                price:
                  property.listingType === "Rent"
                    ? `₹${property.monthlyRent || 0}/month`
                    : `₹${property.expectedPrice || 0}`,

                listingType:
                  property.listingType === "Sell"
                    ? "For Sale"
                    : property.listingType === "Rent"
                    ? "For Rent"
                    : "For Lease",

                image:
                  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
              }}
            />
          ))}

        </div>
      )}

    </section>
  );
}

const styles = {
  section: {
    backgroundColor: "#071525",
    padding: "80px 60px",
  },

  headingBox: {
    maxWidth: "1200px",
    margin: "0 auto 35px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "end",
  },

  smallTitle: {
    color: "#33c1ff",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "2px",
    margin: "0 0 8px",
  },

  heading: {
    color: "#ffffff",
    fontSize: "34px",
    margin: "0",
  },

  viewAll: {
    background: "transparent",
    border: "1px solid #0878e8",
    color: "#ffffff",
    padding: "10px 18px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  grid: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "25px",
  },

  message: {
    textAlign: "center",
    color: "#ffffff",
    fontSize: "16px",
  },

  error: {
    textAlign: "center",
    color: "#ff6b6b",
    fontSize: "16px",
  },
};

export default FeaturedProperties;