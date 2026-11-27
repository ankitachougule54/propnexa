import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function BuilderEditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    propertyType: "",
    listingType: "",
    description: "",
    state: "",
    district: "",
    city: "",
    area: "",
    landmark: "",
    address: "",
    bhk: "",
    bedrooms: "",
    bathrooms: "",
    balconies: "",
    floor: "",
    totalFloors: "",
    furnishing: "",
    builtUpArea: "",
    carpetArea: "",
    plotArea: "",
    areaUnit: "sq.ft",
    expectedPrice: "",
    negotiable: false,
    monthlyRent: "",
    securityDeposit: "",
    maintenance: "",
    bookingAmount: "",
    amenities: "",
  });

  const [currentBanner, setCurrentBanner] = useState("");
  const [currentImages, setCurrentImages] = useState([]);

  const [newBanner, setNewBanner] = useState(null);
  const [newImages, setNewImages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9000/properties/${id}`
      );

      const property =
        response.data.property || response.data;

      setFormData({
        title: property.title || "",
        propertyType: property.propertyType || "",
        listingType: property.listingType || "",
        description: property.description || "",
        state: property.state || "",
        district: property.district || "",
        city: property.city || "",
        area: property.area || "",
        landmark: property.landmark || "",
        address: property.address || "",
        bhk: property.bhk ?? "",
        bedrooms: property.bedrooms ?? "",
        bathrooms: property.bathrooms ?? "",
        balconies: property.balconies ?? "",
        floor: property.floor ?? "",
        totalFloors: property.totalFloors ?? "",
        furnishing: property.furnishing || "",
        builtUpArea: property.builtUpArea ?? "",
        carpetArea: property.carpetArea ?? "",
        plotArea: property.plotArea ?? "",
        areaUnit: property.areaUnit || "sq.ft",
        expectedPrice: property.expectedPrice ?? "",
        negotiable: property.negotiable || false,
        monthlyRent: property.monthlyRent ?? "",
        securityDeposit: property.securityDeposit ?? "",
        maintenance: property.maintenance ?? "",
        bookingAmount: property.bookingAmount ?? "",
        amenities: Array.isArray(property.amenities)
          ? property.amenities.join(", ")
          : "",
      });

      setCurrentBanner(property.bannerImage || "");
      setCurrentImages(property.images || []);
    } catch (err) {
      console.error("Fetch property error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load property."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 10) {
      setError(
        "You can select maximum 10 gallery images."
      );
      return;
    }

    setNewImages(files);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError("Please login first.");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      /*
       * Your current PUT /properties/:id controller
       * accepts property data.
       *
       * We send JSON here so the existing backend
       * update flow remains unchanged.
       */

      const payload = {
        ...formData,
        amenities: formData.amenities
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item !== ""),
      };

      await axios.put(
        `http://localhost:9000/properties/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage(
        "Property updated successfully."
      );

      setTimeout(() => {
        navigate("/builder/properties");
      }, 1200);
    } catch (err) {
      console.error("Update property error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update property."
      );
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    background: "#0b1f36",
    color: "white",
    border: "1px solid #1E4E78",
    borderRadius: "7px",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "7px",
    color: "#cbd5e1",
    fontSize: "14px",
    fontWeight: "600",
  };

  const sectionStyle = {
    background: "#102238",
    border: "1px solid #1E4E78",
    borderRadius: "12px",
    padding: "25px",
    marginBottom: "25px",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "18px",
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
        Loading property...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#071525",
        color: "white",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}

        <div style={{ marginBottom: "30px" }}>
          <button
            type="button"
            onClick={() =>
              navigate("/builder/properties")
            }
            style={{
              background: "transparent",
              border: "none",
              color: "#33c1ff",
              cursor: "pointer",
              marginBottom: "15px",
              fontSize: "15px",
            }}
          >
            ← Back to My Properties
          </button>

          <h1
            style={{
              margin: 0,
              fontSize: "32px",
            }}
          >
            Edit Property
          </h1>

          <p
            style={{
              color: "#9ca3af",
              marginTop: "8px",
            }}
          >
            Update your property information.
          </p>
        </div>

        {/* MESSAGE */}

        {message && (
          <div
            style={{
              background: "#064e3b",
              border: "1px solid #10b981",
              color: "#a7f3d0",
              padding: "14px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            {message}
          </div>
        )}

        {error && (
          <div
            style={{
              background: "#450a0a",
              border: "1px solid #ef4444",
              color: "#fecaca",
              padding: "14px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* BASIC INFORMATION */}

          <div style={sectionStyle}>
            <h2>Basic Information</h2>

            <div style={gridStyle}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>
                  Property Title *
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Property Type *
                </label>

                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                >
                  <option value="">
                    Select Property Type
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

              <div>
                <label style={labelStyle}>
                  Listing Type *
                </label>

                <select
                  name="listingType"
                  value={formData.listingType}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                >
                  <option value="">
                    Select Listing Type
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
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>
                  Description *
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                  }}
                  required
                />
              </div>
            </div>
          </div>

          {/* LOCATION */}

          <div style={sectionStyle}>
            <h2>Location Details</h2>

            <div style={gridStyle}>
              <div>
                <label style={labelStyle}>
                  State *
                </label>

                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>
                  District
                </label>

                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  City *
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Area *
                </label>

                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Landmark
                </label>

                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>
                  Full Address *
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  style={inputStyle}
                  required
                />
              </div>
            </div>
          </div>

          {/* SPECIFICATIONS */}

          <div style={sectionStyle}>
            <h2>Property Specifications</h2>

            <div style={gridStyle}>
              {[
                ["bhk", "BHK"],
                ["bedrooms", "Bedrooms"],
                ["bathrooms", "Bathrooms"],
                ["balconies", "Balconies"],
                ["floor", "Floor"],
                ["totalFloors", "Total Floors"],
              ].map(([name, label]) => (
                <div key={name}>
                  <label style={labelStyle}>
                    {label}
                  </label>

                  <input
                    type="number"
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    min="0"
                    style={inputStyle}
                  />
                </div>
              ))}

              <div>
                <label style={labelStyle}>
                  Furnishing
                </label>

                <select
                  name="furnishing"
                  value={formData.furnishing}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">
                    Select Furnishing
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
            </div>
          </div>

          {/* AREA */}

          <div style={sectionStyle}>
            <h2>Area Details</h2>

            <div style={gridStyle}>
              <div>
                <label style={labelStyle}>
                  Built-up Area
                </label>

                <input
                  type="number"
                  name="builtUpArea"
                  value={formData.builtUpArea}
                  onChange={handleChange}
                  min="0"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Carpet Area
                </label>

                <input
                  type="number"
                  name="carpetArea"
                  value={formData.carpetArea}
                  onChange={handleChange}
                  min="0"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Plot Area
                </label>

                <input
                  type="number"
                  name="plotArea"
                  value={formData.plotArea}
                  onChange={handleChange}
                  min="0"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Area Unit
                </label>

                <select
                  name="areaUnit"
                  value={formData.areaUnit}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="sq.ft">
                    sq.ft
                  </option>
                  <option value="sq.m">
                    sq.m
                  </option>
                  <option value="acre">
                    acre
                  </option>
                  <option value="gunta">
                    gunta
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* PRICE */}

          <div style={sectionStyle}>
            <h2>Pricing Details</h2>

            <div style={gridStyle}>
              {[
                ["expectedPrice", "Expected Price"],
                ["monthlyRent", "Monthly Rent"],
                ["securityDeposit", "Security Deposit"],
                ["maintenance", "Maintenance"],
                ["bookingAmount", "Booking Amount"],
              ].map(([name, label]) => (
                <div key={name}>
                  <label style={labelStyle}>
                    {label}
                  </label>

                  <input
                    type="number"
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    min="0"
                    style={inputStyle}
                  />
                </div>
              ))}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  paddingTop: "28px",
                }}
              >
                <input
                  type="checkbox"
                  name="negotiable"
                  checked={formData.negotiable}
                  onChange={handleChange}
                  style={{
                    width: "18px",
                    height: "18px",
                  }}
                />

                <label>
                  Price is Negotiable
                </label>
              </div>
            </div>
          </div>

          {/* AMENITIES */}

          <div style={sectionStyle}>
            <h2>Amenities</h2>

            <label style={labelStyle}>
              Amenities
            </label>

            <input
              type="text"
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
              placeholder="Parking, Gym, Garden, Swimming Pool"
              style={inputStyle}
            />
          </div>

          {/* CURRENT IMAGES */}

          <div style={sectionStyle}>
            <h2>Current Images</h2>

            {currentBanner ? (
              <div>
                <p style={{ color: "#cbd5e1" }}>
                  Main Banner
                </p>

                <img
                  src={`http://localhost:9000${currentBanner}`}
                  alt="Property banner"
                  style={{
                    width: "260px",
                    height: "170px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    border:
                      "1px solid #1E4E78",
                  }}
                />
              </div>
            ) : (
              <p style={{ color: "#64748b" }}>
                No banner image available.
              </p>
            )}

            {currentImages.length > 0 && (
              <div style={{ marginTop: "25px" }}>
                <p style={{ color: "#cbd5e1" }}>
                  Gallery Images
                </p>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "12px",
                  }}
                >
                  {currentImages.map(
                    (image, index) => (
                      <img
                        key={index}
                        src={`http://localhost:9000${image}`}
                        alt={`Gallery ${index + 1}`}
                        style={{
                          width: "150px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "7px",
                          border:
                            "1px solid #1E4E78",
                        }}
                      />
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* NEW IMAGES */}

          <div style={sectionStyle}>
            <h2>Replace Images</h2>

            <p
              style={{
                color: "#94a3b8",
                fontSize: "14px",
              }}
            >
              Image replacement is prepared here, but
              your current PUT controller only updates
              property data. Existing images will remain
              unchanged when you save.
            </p>

            <div style={{ marginTop: "20px" }}>
              <label style={labelStyle}>
                New Banner Image
              </label>

              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={(e) =>
                  setNewBanner(
                    e.target.files[0] || null
                  )
                }
                style={{ color: "#cbd5e1" }}
              />
            </div>

            <div style={{ marginTop: "20px" }}>
              <label style={labelStyle}>
                New Gallery Images
              </label>

              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                multiple
                onChange={handleNewImages}
                style={{ color: "#cbd5e1" }}
              />

              {newImages.length > 0 && (
                <p
                  style={{
                    color: "#33c1ff",
                    fontSize: "13px",
                  }}
                >
                  {newImages.length} new gallery image(s)
                  selected.
                </p>
              )}
            </div>
          </div>

          {/* ACTIONS */}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "15px",
              paddingBottom: "40px",
            }}
          >
            <button
              type="button"
              onClick={() =>
                navigate("/builder/properties")
              }
              style={{
                padding: "13px 25px",
                borderRadius: "8px",
                border: "1px solid #1E4E78",
                background: "#102238",
                color: "white",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "13px 30px",
                borderRadius: "8px",
                border: "none",
                background: saving
                  ? "#475569"
                  : "#0878e8",
                color: "white",
                cursor: saving
                  ? "not-allowed"
                  : "pointer",
                fontWeight: "600",
              }}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BuilderEditProperty;