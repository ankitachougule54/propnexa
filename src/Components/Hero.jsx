import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  // Listing Type
  const [listingType, setListingType] = useState("Sell");

  // Search Fields
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");

  // Search Function
  const handleSearch = () => {
    const params = new URLSearchParams();

    // Listing Type
    if (listingType) {
      params.append("listingType", listingType);
    }

    // Location
    if (location) {
      params.append("city", location);
    }

    // Property Type
    if (propertyType) {
      params.append("propertyType", propertyType);
    }

    // Price Range
    if (priceRange) {
      const [min, max] = priceRange.split("-");

      if (min) {
        params.append("minPrice", min);
      }

      if (max) {
        params.append("maxPrice", max);
      }
    }

    // Navigate to Properties page
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <section style={styles.hero}>

      <div style={styles.overlay}>

        <div style={styles.content}>

          {/* Welcome Text */}
          <p style={styles.smallText}>
            WELCOME TO PROPNEXA
          </p>

          {/* Main Heading */}
          <h1 style={styles.heading}>
            Find a Place You'll Love
            <br />
            to Call <span>Home</span>
          </h1>

          {/* Description */}
          <p style={styles.description}>
            Discover properties for sale, rent and lease
            in your preferred location.
          </p>

          {/* Search Box */}
          <div style={styles.searchBox}>

            {/* Listing Type */}
            <div style={styles.tabs}>

              {/* Buy */}
              <button
                style={
                  listingType === "Sell"
                    ? styles.activeTab
                    : styles.tab
                }
                onClick={() => setListingType("Sell")}
              >
                Buy
              </button>

              {/* Rent */}
              <button
                style={
                  listingType === "Rent"
                    ? styles.activeTab
                    : styles.tab
                }
                onClick={() => setListingType("Rent")}
              >
                Rent
              </button>

              {/* Lease */}
              <button
                style={
                  listingType === "Lease"
                    ? styles.activeTab
                    : styles.tab
                }
                onClick={() => setListingType("Lease")}
              >
                Lease
              </button>

            </div>

            {/* Search Fields */}
            <div style={styles.fields}>

              {/* Location */}
              <div style={styles.field}>

                <span style={styles.fieldIcon}>
                  📍
                </span>

                <div style={styles.fieldContent}>

                  <small style={styles.fieldSmall}>
                    Location
                  </small>

                  <input
                    type="text"
                    placeholder="Enter city or area"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={styles.input}
                  />

                </div>

              </div>

              {/* Property Type */}
              <div style={styles.field}>

                <span style={styles.fieldIcon}>
                  🏠
                </span>

                <div style={styles.fieldContent}>

                  <small style={styles.fieldSmall}>
                    Property Type
                  </small>

                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    style={styles.select}
                  >
                    <option value="">
                      Select property type
                    </option>

                    <option value="Apartment">
                      Apartment
                    </option>

                    <option value="Flat">
                      Flat
                    </option>

                    <option value="Villa">
                      Villa
                    </option>

                    <option value="House">
                      House
                    </option>

                    <option value="Plot">
                      Plot
                    </option>

                    <option value="Farmhouse">
                      Farmhouse
                    </option>

                    <option value="Shop">
                      Shop
                    </option>

                    <option value="Office">
                      Office
                    </option>

                    <option value="Warehouse">
                      Warehouse
                    </option>

                    <option value="Industrial Land">
                      Industrial Land
                    </option>

                  </select>

                </div>

              </div>

              {/* Price Range */}
              <div style={styles.field}>

                <span style={styles.fieldIcon}>
                  ₹
                </span>

                <div style={styles.fieldContent}>

                  <small style={styles.fieldSmall}>
                    Price Range
                  </small>

                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    style={styles.select}
                  >

                    <option value="">
                      Select price
                    </option>

                    <option value="0-2500000">
                      Under ₹25 Lakh
                    </option>

                    <option value="2500000-5000000">
                      ₹25 Lakh - ₹50 Lakh
                    </option>

                    <option value="5000000-10000000">
                      ₹50 Lakh - ₹1 Crore
                    </option>

                    <option value="10000000">
                      Above ₹1 Crore
                    </option>

                  </select>

                </div>

              </div>

              {/* Search Button */}
              <button
                style={styles.searchButton}
                onClick={handleSearch}
              >
                🔍 Search
              </button>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

const styles = {

  hero: {
    minHeight: "620px",
    backgroundColor: "#071525",
    backgroundImage:
      "linear-gradient(rgba(7,21,37,0.72), rgba(7,21,37,0.88)), url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=80')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  overlay: {
    minHeight: "620px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
  },

  content: {
    width: "100%",
    maxWidth: "1100px",
    textAlign: "center",
  },

  smallText: {
    color: "#33c1ff",
    fontSize: "14px",
    fontWeight: "700",
    letterSpacing: "3px",
    marginBottom: "15px",
  },

  heading: {
    color: "#ffffff",
    fontSize: "52px",
    lineHeight: "1.15",
    margin: "0",
    fontWeight: "700",
  },

  description: {
    color: "#d4dce5",
    fontSize: "17px",
    marginTop: "20px",
    marginBottom: "35px",
  },

  searchBox: {
    backgroundColor: "#102238",
    border: "1px solid #1E4E78",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "left",
    boxShadow: "0 15px 40px rgba(0,0,0,0.35)",
  },

  tabs: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },

  activeTab: {
    background: "linear-gradient(135deg, #0878e8, #1251c7)",
    color: "#ffffff",
    border: "none",
    padding: "10px 25px",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
  },

  tab: {
    backgroundColor: "transparent",
    color: "#b8c5d4",
    border: "1px solid #34516c",
    padding: "10px 25px",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
  },

  fields: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  field: {
    flex: "1",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#0b1f36",
    border: "1px solid #1E4E78",
    borderRadius: "7px",
    padding: "12px 15px",
  },

  fieldIcon: {
    fontSize: "20px",
  },

  fieldContent: {
    flex: "1",
  },

  fieldSmall: {
    color: "#7f91a5",
    display: "block",
    fontSize: "12px",
  },

  input: {
    width: "100%",
    marginTop: "5px",
    backgroundColor: "transparent",
    border: "none",
    outline: "none",
    color: "#ffffff",
    fontSize: "13px",
  },

  select: {
    width: "100%",
    marginTop: "5px",
    backgroundColor: "#0b1f36",
    border: "none",
    outline: "none",
    color: "#ffffff",
    fontSize: "13px",
    cursor: "pointer",
  },

  searchButton: {
    background: "linear-gradient(135deg, #0878e8, #1251c7)",
    color: "#ffffff",
    border: "none",
    borderRadius: "7px",
    padding: "17px 28px",
    fontWeight: "700",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

};

export default Hero;