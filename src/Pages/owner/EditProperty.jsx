import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    propertyType: "Apartment",
    listingType: "Sell",
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
    furnishing: "Unfurnished",

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

    amenities: [],
  });

  const [customAmenity, setCustomAmenity] = useState("");

  const amenitiesList = [
    "Parking",
    "Lift",
    "Security",
    "Power Backup",
    "Gym",
    "Swimming Pool",
    "Garden",
    "Club House",
    "Water Supply",
    "CCTV",
  ];

  // =========================
  // FETCH PROPERTY
  // =========================
  const fetchProperty = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9000/properties/${id}`
      );

      const property = response.data.property || response.data;

      setFormData({
        title: property.title || "",
        propertyType: property.propertyType || "Apartment",
        listingType: property.listingType || "Sell",
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
        furnishing: property.furnishing || "Unfurnished",

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

        amenities: property.amenities || [],
      });
    } catch (error) {
      console.error("Fetch property error:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to load property"
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

    fetchProperty();
  }, [id]);

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================
  // AMENITY
  // =========================
  const toggleAmenity = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((item) => item !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const addCustomAmenity = () => {
    const value = customAmenity.trim();

    if (!value) return;

    if (!formData.amenities.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, value],
      }));
    }

    setCustomAmenity("");
  };

  // =========================
  // UPDATE PROPERTY
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");

      const dataToSend = {
        ...formData,

        bhk: formData.bhk === "" ? undefined : Number(formData.bhk),
        bedrooms:
          formData.bedrooms === ""
            ? undefined
            : Number(formData.bedrooms),
        bathrooms:
          formData.bathrooms === ""
            ? undefined
            : Number(formData.bathrooms),
        balconies:
          formData.balconies === ""
            ? undefined
            : Number(formData.balconies),
        floor:
          formData.floor === ""
            ? undefined
            : Number(formData.floor),
        totalFloors:
          formData.totalFloors === ""
            ? undefined
            : Number(formData.totalFloors),

        builtUpArea:
          formData.builtUpArea === ""
            ? undefined
            : Number(formData.builtUpArea),
        carpetArea:
          formData.carpetArea === ""
            ? undefined
            : Number(formData.carpetArea),
        plotArea:
          formData.plotArea === ""
            ? undefined
            : Number(formData.plotArea),

        expectedPrice:
          formData.expectedPrice === ""
            ? undefined
            : Number(formData.expectedPrice),
        monthlyRent:
          formData.monthlyRent === ""
            ? undefined
            : Number(formData.monthlyRent),
        securityDeposit:
          formData.securityDeposit === ""
            ? undefined
            : Number(formData.securityDeposit),
        maintenance:
          formData.maintenance === ""
            ? undefined
            : Number(formData.maintenance),
        bookingAmount:
          formData.bookingAmount === ""
            ? undefined
            : Number(formData.bookingAmount),
      };

      // Owner and status are NOT sent.
      // Backend controls them.

      await axios.put(
        `http://localhost:9000/properties/${id}`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Property updated successfully!");

      navigate("/owner/properties");
    } catch (error) {
      console.error("Update property error:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to update property"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // COMMON INPUT STYLE
  // =========================
  const inputStyle = {
    width: "100%",
    padding: "12px",
    background: "#071525",
    border: "1px solid #1E4E78",
    borderRadius: "7px",
    color: "#ffffff",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "7px",
    color: "#b5c4d4",
    fontSize: "14px",
  };

  const sectionStyle = {
    background: "#102238",
    border: "1px solid #1E4E78",
    borderRadius: "12px",
    padding: "25px",
    marginBottom: "22px",
  };

  const sectionTitleStyle = {
    marginTop: 0,
    marginBottom: "22px",
    color: "#55b8ff",
    fontSize: "20px",
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#071525",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
        color: "#ffffff",
        padding: "35px",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto 30px",
        }}
      >
        <button
          onClick={() => navigate("/owner/properties")}
          style={{
            background: "transparent",
            border: "none",
            color: "#55b8ff",
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
            fontSize: "30px",
          }}
        >
          Edit Property
        </h1>

        <p
          style={{
            color: "#8ea3ba",
            marginTop: "8px",
          }}
        >
          Update your property information
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* ERROR MESSAGE */}
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

        {/* ================= BASIC INFORMATION ================= */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>
            1. Basic Information
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "18px",
            }}
          >
            <div>
              <label style={labelStyle}>
                Property Title *
              </label>

              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                style={inputStyle}
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
              >
                <option>Apartment</option>
                <option>Flat</option>
                <option>Villa</option>
                <option>House</option>
                <option>Plot</option>
                <option>Farmhouse</option>
                <option>Shop</option>
                <option>Office</option>
                <option>Warehouse</option>
                <option>Industrial Land</option>
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
              >
                <option>Sell</option>
                <option>Rent</option>
                <option>Lease</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: "18px" }}>
            <label style={labelStyle}>
              Description
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
            />
          </div>
        </div>

        {/* ================= LOCATION ================= */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>
            2. Location
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "18px",
            }}
          >
            {[
              ["state", "State"],
              ["district", "District"],
              ["city", "City"],
              ["area", "Area"],
              ["landmark", "Landmark"],
            ].map(([name, label]) => (
              <div key={name}>
                <label style={labelStyle}>
                  {label}
                </label>

                <input
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            ))}
          </div>

          <div style={{ marginTop: "18px" }}>
            <label style={labelStyle}>
              Full Address
            </label>

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              style={{
                ...inputStyle,
                resize: "vertical",
              }}
            />
          </div>
        </div>

        {/* ================= PROPERTY DETAILS ================= */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>
            3. Property Details
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "18px",
            }}
          >
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
                  min="0"
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
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
                <option>Unfurnished</option>
                <option>Semi-Furnished</option>
                <option>Fully Furnished</option>
              </select>
            </div>
          </div>
        </div>

        {/* ================= AREA ================= */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>
            4. Area
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "18px",
            }}
          >
            {[
              ["builtUpArea", "Built-up Area"],
              ["carpetArea", "Carpet Area"],
              ["plotArea", "Plot Area"],
            ].map(([name, label]) => (
              <div key={name}>
                <label style={labelStyle}>
                  {label}
                </label>

                <input
                  type="number"
                  min="0"
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            ))}

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
                <option>sq.ft</option>
                <option>sq.m</option>
                <option>acre</option>
                <option>cent</option>
              </select>
            </div>
          </div>
        </div>

        {/* ================= PRICING ================= */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>
            5. Pricing
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "18px",
            }}
          >
            <div>
              <label style={labelStyle}>
                Expected Price
              </label>

              <input
                type="number"
                min="0"
                name="expectedPrice"
                value={formData.expectedPrice}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>
                Monthly Rent
              </label>

              <input
                type="number"
                min="0"
                name="monthlyRent"
                value={formData.monthlyRent}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>
                Security Deposit
              </label>

              <input
                type="number"
                min="0"
                name="securityDeposit"
                value={formData.securityDeposit}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>
                Maintenance
              </label>

              <input
                type="number"
                min="0"
                name="maintenance"
                value={formData.maintenance}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>
                Booking Amount
              </label>

              <input
                type="number"
                min="0"
                name="bookingAmount"
                value={formData.bookingAmount}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          </div>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "20px",
              color: "#cbd5e1",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="negotiable"
              checked={formData.negotiable}
              onChange={handleChange}
            />

            Price is negotiable
          </label>
        </div>

        {/* ================= AMENITIES ================= */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>
            6. Amenities
          </h2>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            {amenitiesList.map((amenity) => {
              const selected =
                formData.amenities.includes(amenity);

              return (
                <button
                  type="button"
                  key={amenity}
                  onClick={() =>
                    toggleAmenity(amenity)
                  }
                  style={{
                    padding: "9px 14px",
                    borderRadius: "20px",
                    border: selected
                      ? "1px solid #55b8ff"
                      : "1px solid #1E4E78",
                    background: selected
                      ? "#173f62"
                      : "#071525",
                    color: selected
                      ? "#55b8ff"
                      : "#b5c4d4",
                    cursor: "pointer",
                  }}
                >
                  {selected ? "✓ " : ""}
                  {amenity}
                </button>
              );
            })}
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <input
              value={customAmenity}
              onChange={(e) =>
                setCustomAmenity(e.target.value)
              }
              placeholder="Add custom amenity"
              style={inputStyle}
            />

            <button
              type="button"
              onClick={addCustomAmenity}
              style={{
                background: "#173554",
                border: "1px solid #28618f",
                color: "#ffffff",
                padding: "0 18px",
                borderRadius: "7px",
                cursor: "pointer",
              }}
            >
              Add
            </button>
          </div>
        </div>

        {/* ================= BUTTONS ================= */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            paddingBottom: "40px",
          }}
        >
          <button
            type="button"
            onClick={() =>
              navigate("/owner/properties")
            }
            style={{
              background: "#17283b",
              border: "1px solid #1E4E78",
              color: "#ffffff",
              padding: "13px 24px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            style={{
              background:
                "linear-gradient(135deg, #0878e8, #1251c7)",
              border: "none",
              color: "#ffffff",
              padding: "13px 28px",
              borderRadius: "8px",
              cursor: saving
                ? "not-allowed"
                : "pointer",
              fontWeight: "600",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving
              ? "Updating..."
              : "Update Property"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProperty;