import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

const Properties = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==============================
  // FILTER STATES
  // ==============================

  const [filters, setFilters] = useState({
    city: searchParams.get("city") || "",
    state: searchParams.get("state") || "",
    district: searchParams.get("district") || "",
    area: searchParams.get("area") || "",
    propertyType: searchParams.get("propertyType") || "",
    listingType: searchParams.get("listingType") || "",
    furnishing: searchParams.get("furnishing") || "",
    bhk: searchParams.get("bhk") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    minArea: searchParams.get("minArea") || "",
    maxArea: searchParams.get("maxArea") || "",
    sort: searchParams.get("sort") || "latest",
  });

  // ==============================
  // FETCH PROPERTIES
  // ==============================

  useEffect(() => {
    fetchProperties();
  }, [searchParams]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError("");

      const query = searchParams.toString();

      const response = await axios.get(
        `http://localhost:9000/properties${
          query ? `?${query}` : ""
        }`
      );

      setProperties(
        response.data.properties ||
          response.data.data ||
          []
      );
    } catch (error) {
      console.error("Fetch properties error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load properties."
      );

      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // HANDLE FILTER CHANGE
  // ==============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==============================
  // APPLY FILTERS
  // ==============================

  const applyFilters = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    Object.entries(filters).forEach(
      ([key, value]) => {
        if (value !== "" && value !== null) {
          params.set(key, value);
        }
      }
    );

    setSearchParams(params);
  };

  // ==============================
  // CLEAR FILTERS
  // ==============================

  const clearFilters = () => {
    const defaultFilters = {
      city: "",
      state: "",
      district: "",
      area: "",
      propertyType: "",
      listingType: "",
      furnishing: "",
      bhk: "",
      minPrice: "",
      maxPrice: "",
      minArea: "",
      maxArea: "",
      sort: "latest",
    };

    setFilters(defaultFilters);

    setSearchParams({
      sort: "latest",
    });
  };

  // ==============================
  // PROPERTY CARD
  // ==============================

  const PropertyCard = ({ property }) => {
    return (
      <div style={styles.card}>

        {/* PROPERTY IMAGE */}
        <div style={styles.imageContainer}>
          {property.images &&
          property.images.length > 0 ? (
            <img
              src={property.images[0]}
              alt={property.title}
              style={styles.image}
            />
          ) : (
            <div style={styles.noImage}>
              🏠
            </div>
          )}

          <span style={styles.statusBadge}>
            {property.listingType}
          </span>
        </div>

        {/* PROPERTY CONTENT */}
        <div style={styles.cardContent}>

          <h2 style={styles.cardTitle}>
            {property.title}
          </h2>

          <p style={styles.location}>
            📍{" "}
            {[
              property.area,
              property.city,
              property.state,
            ]
              .filter(Boolean)
              .join(", ") ||
              "Location not available"}
          </p>

          <p style={styles.propertyType}>
            {property.propertyType}
          </p>

          {/* SPECS */}
          <div style={styles.specs}>

            {property.bhk !== undefined &&
              property.bhk !== null &&
              property.bhk !== "" && (
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

            {property.bathrooms && (
              <span>
                🚿 {property.bathrooms} Bath
              </span>
            )}

          </div>

          {/* PRICE */}
          <div style={styles.price}>
            {property.listingType === "Sell"
              ? property.expectedPrice
                ? `₹ ${Number(
                    property.expectedPrice
                  ).toLocaleString("en-IN")}`
                : "Price on request"
              : property.monthlyRent
              ? `₹ ${Number(
                  property.monthlyRent
                ).toLocaleString("en-IN")} / month`
              : "Price on request"}
          </div>

          {/* FURNISHING */}
          {property.furnishing && (
            <p style={styles.furnishing}>
              Furnishing: {property.furnishing}
            </p>
          )}

          {/* BUTTON */}
          <button
            style={styles.viewButton}
            onClick={() =>
              navigate(
                `/properties/${property._id}`
              )
            }
          >
            View Details
          </button>

        </div>
      </div>
    );
  };

  return (
    <div style={styles.page}>

      {/* ==================================
          PAGE HEADER
      ================================== */}

      <div style={styles.container}>

        <div style={styles.header}>

          <div>
            <h1 style={styles.heading}>
              Find Your Property
            </h1>

            <p style={styles.subtitle}>
              Search properties for sale, rent or lease.
            </p>
          </div>

          <button
            style={styles.homeButton}
            onClick={() => navigate("/")}
          >
            ← Home
          </button>

        </div>

        {/* ==================================
            SEARCH / FILTER PANEL
        ================================== */}

        <form
          onSubmit={applyFilters}
          style={styles.filterPanel}
        >

          <h2 style={styles.filterTitle}>
            🔎 Search & Filter Properties
          </h2>

          {/* LOCATION */}

          <div style={styles.sectionTitle}>
            Location
          </div>

          <div style={styles.filterGrid}>

            <input
              type="text"
              name="state"
              placeholder="State"
              value={filters.state}
              onChange={handleChange}
              style={styles.input}
            />

            <input
              type="text"
              name="district"
              placeholder="District"
              value={filters.district}
              onChange={handleChange}
              style={styles.input}
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={filters.city}
              onChange={handleChange}
              style={styles.input}
            />

            <input
              type="text"
              name="area"
              placeholder="Area / Locality"
              value={filters.area}
              onChange={handleChange}
              style={styles.input}
            />

          </div>

          {/* PROPERTY */}

          <div style={styles.sectionTitle}>
            Property Details
          </div>

          <div style={styles.filterGrid}>

            <select
              name="listingType"
              value={filters.listingType}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">
                Sell / Rent / Lease
              </option>

              <option value="Sell">
                Sell
              </option>

              <option value="Rent">
                Rent
              </option>

              <option value="Lease">
                Lease
              </option>
            </select>

            <select
              name="propertyType"
              value={filters.propertyType}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">
                Property Type
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

            <select
              name="bhk"
              value={filters.bhk}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">
                BHK
              </option>

              <option value="1">
                1 BHK
              </option>

              <option value="2">
                2 BHK
              </option>

              <option value="3">
                3 BHK
              </option>

              <option value="4">
                4 BHK
              </option>

              <option value="5">
                5+ BHK
              </option>
            </select>

            <select
              name="furnishing"
              value={filters.furnishing}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">
                Furnishing
              </option>

              <option value="Unfurnished">
                Unfurnished
              </option>

              <option value="Semi-Furnished">
                Semi-Furnished
              </option>

              <option value="Fully Furnished">
                Fully Furnished
              </option>
            </select>

          </div>

          {/* PRICE */}

          <div style={styles.sectionTitle}>
            Price Range
          </div>

          <div style={styles.filterGrid}>

            <input
              type="number"
              name="minPrice"
              placeholder="Minimum Price"
              value={filters.minPrice}
              onChange={handleChange}
              style={styles.input}
              min="0"
            />

            <input
              type="number"
              name="maxPrice"
              placeholder="Maximum Price"
              value={filters.maxPrice}
              onChange={handleChange}
              style={styles.input}
              min="0"
            />

          </div>

          {/* AREA */}

          <div style={styles.sectionTitle}>
            Area Range
          </div>

          <div style={styles.filterGrid}>

            <input
              type="number"
              name="minArea"
              placeholder="Minimum Area"
              value={filters.minArea}
              onChange={handleChange}
              style={styles.input}
              min="0"
            />

            <input
              type="number"
              name="maxArea"
              placeholder="Maximum Area"
              value={filters.maxArea}
              onChange={handleChange}
              style={styles.input}
              min="0"
            />

          </div>

          {/* SORT */}

          <div style={styles.sectionTitle}>
            Sort By
          </div>

          <div style={styles.filterGrid}>

            <select
              name="sort"
              value={filters.sort}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="latest">
                Latest
              </option>

              <option value="oldest">
                Oldest
              </option>

              <option value="priceLow">
                Price: Low to High
              </option>

              <option value="priceHigh">
                Price: High to Low
              </option>
            </select>

          </div>

          {/* FILTER BUTTONS */}

          <div style={styles.filterButtons}>

            <button
              type="submit"
              style={styles.applyButton}
            >
              🔎 Apply Filters
            </button>

            <button
              type="button"
              style={styles.clearButton}
              onClick={clearFilters}
            >
              Clear Filters
            </button>

          </div>

        </form>

        {/* ==================================
            RESULT HEADER
        ================================== */}

        <div style={styles.resultHeader}>

          <h2 style={styles.resultTitle}>
            Properties
          </h2>

          <span style={styles.resultCount}>
            {properties.length} properties found
          </span>

        </div>

        {/* ==================================
            ERROR
        ================================== */}

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {/* ==================================
            LOADING
        ================================== */}

        {loading ? (
          <div style={styles.loading}>
            Loading properties...
          </div>
        ) : properties.length === 0 ? (

          /* ==================================
              NO RESULTS
          ================================== */

          <div style={styles.empty}>
            <div style={styles.emptyIcon}>
              🏠
            </div>

            <h2>
              No Properties Found
            </h2>

            <p style={styles.emptyText}>
              Try changing your search filters.
            </p>

            <button
              style={styles.applyButton}
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>

        ) : (

          /* ==================================
              PROPERTY GRID
          ================================== */

          <div style={styles.propertyGrid}>

            {properties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
              />
            ))}

          </div>

        )}

      </div>
    </div>
  );
};

// ==========================================
// STYLES
// ==========================================

const styles = {

  page: {
    minHeight: "100vh",
    background: "#071525",
    color: "#ffffff",
    padding: "40px 20px",
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

  heading: {
    margin: 0,
    fontSize: "34px",
    fontWeight: "700",
  },

  subtitle: {
    color: "#9db2c8",
    marginTop: "8px",
  },

  homeButton: {
    background: "#102238",
    color: "#ffffff",
    border: "1px solid #1E4E78",
    padding: "11px 20px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  filterPanel: {
    background: "#102238",
    border: "1px solid #1E4E78",
    borderRadius: "14px",
    padding: "28px",
    marginBottom: "35px",
  },

  filterTitle: {
    marginTop: 0,
    marginBottom: "25px",
    fontSize: "22px",
  },

  sectionTitle: {
    color: "#33c1ff",
    fontSize: "15px",
    fontWeight: "600",
    marginTop: "20px",
    marginBottom: "12px",
  },

  filterGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "12px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    background: "#071525",
    color: "#ffffff",
    border: "1px solid #1E4E78",
    borderRadius: "7px",
    padding: "12px",
    outline: "none",
  },

  filterButtons: {
    display: "flex",
    gap: "12px",
    marginTop: "25px",
    flexWrap: "wrap",
  },

  applyButton: {
    background: "#0878e8",
    color: "#ffffff",
    border: "none",
    padding: "12px 22px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  clearButton: {
    background: "#102238",
    color: "#ffffff",
    border: "1px solid #1E4E78",
    padding: "12px 22px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  resultHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    gap: "15px",
    flexWrap: "wrap",
  },

  resultTitle: {
    margin: 0,
    fontSize: "24px",
  },

  resultCount: {
    color: "#9db2c8",
  },

  propertyGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "25px",
  },

  card: {
    background: "#102238",
    border: "1px solid #1E4E78",
    borderRadius: "14px",
    overflow: "hidden",
    transition: "0.3s",
  },

  imageContainer: {
    height: "210px",
    background: "#0b1f36",
    position: "relative",
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  noImage: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "60px",
  },

  statusBadge: {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "#0878e8",
    color: "#ffffff",
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },

  cardContent: {
    padding: "22px",
  },

  cardTitle: {
    fontSize: "20px",
    margin: "0 0 10px",
  },

  location: {
    color: "#9db2c8",
    margin: "0 0 10px",
    fontSize: "14px",
  },

  propertyType: {
    color: "#33c1ff",
    margin: "0 0 15px",
    fontSize: "14px",
    fontWeight: "600",
  },

  specs: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    color: "#c7d5e3",
    fontSize: "13px",
    marginBottom: "18px",
  },

  price: {
    fontSize: "21px",
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: "8px",
  },

  furnishing: {
    color: "#9db2c8",
    fontSize: "13px",
    marginBottom: "15px",
  },

  viewButton: {
    width: "100%",
    background: "#0878e8",
    color: "#ffffff",
    border: "none",
    padding: "12px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600",
  },

  loading: {
    textAlign: "center",
    padding: "70px",
    color: "#9db2c8",
  },

  empty: {
    background: "#102238",
    border: "1px solid #1E4E78",
    borderRadius: "14px",
    textAlign: "center",
    padding: "70px 20px",
  },

  emptyIcon: {
    fontSize: "60px",
    marginBottom: "15px",
  },

  emptyText: {
    color: "#9db2c8",
    marginBottom: "25px",
  },

  error: {
    background: "#3a1717",
    border: "1px solid #8b3030",
    color: "#ffb3b3",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
  },
};

export default Properties;