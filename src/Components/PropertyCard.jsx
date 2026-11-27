import React from "react";
import { useNavigate } from "react-router-dom";

function PropertyCard({ property }) {
  const navigate = useNavigate();

  return (
    <div style={styles.card}>

      {/* Property Image */}
      <div style={styles.imageBox}>
        <img
          src={property.image}
          alt={property.title}
          style={styles.image}
        />

        <span style={styles.badge}>
          {property.listingType}
        </span>
      </div>

      {/* Property Details */}
      <div style={styles.content}>

        <h3 style={styles.title}>
          {property.title}
        </h3>

        <p style={styles.location}>
          📍 {property.location}
        </p>

        <div style={styles.info}>
          <span>🛏 {property.bhk} BHK</span>
          <span>🚿 {property.bathrooms} Bath</span>
          <span>📐 {property.area} sq.ft</span>
        </div>

        <div style={styles.bottom}>

          <div>
            <small style={styles.priceLabel}>
              Price
            </small>

            <p style={styles.price}>
              {property.price}
            </p>
          </div>

          <button
            style={styles.viewButton}
            onClick={() =>
              navigate(`/properties/${property._id}`)
            }
          >
            View Details
          </button>

        </div>

      </div>

    </div>
  );
}

const styles = {
  card: {
    backgroundColor: "#102238",
    border: "1px solid #1E4E78",
    borderRadius: "12px",
    overflow: "hidden",
  },

  imageBox: {
    height: "220px",
    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  badge: {
    position: "absolute",
    top: "15px",
    left: "15px",
    background: "linear-gradient(135deg, #0878e8, #1251c7)",
    color: "#ffffff",
    padding: "6px 12px",
    borderRadius: "5px",
    fontSize: "12px",
    fontWeight: "600",
  },

  content: {
    padding: "20px",
  },

  title: {
    color: "#ffffff",
    fontSize: "19px",
    margin: "0 0 8px",
  },

  location: {
    color: "#8fa4b8",
    fontSize: "14px",
    margin: "0 0 18px",
  },

  info: {
    display: "flex",
    gap: "12px",
    color: "#c5d1dc",
    fontSize: "13px",
    paddingBottom: "18px",
    borderBottom: "1px solid #1E4E78",
  },

  bottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "18px",
  },

  priceLabel: {
    color: "#7f91a5",
    fontSize: "11px",
  },

  price: {
    color: "#33c1ff",
    fontSize: "18px",
    fontWeight: "700",
    margin: "3px 0 0",
  },

  viewButton: {
    background: "transparent",
    color: "#ffffff",
    border: "1px solid #0878e8",
    padding: "9px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
  },
};

export default PropertyCard;