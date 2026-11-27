import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BuilderAddProject = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    projectName: "",
    projectType: "",
    description: "",
    state: "",
    district: "",
    city: "",
    location: "",
    landmark: "",
    totalUnits: "",
    availableUnits: "",
    totalFloors: "",
    possessionDate: "",
    startingPrice: "",
    amenities: "",
    website: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      await axios.post(
        "http://localhost:9000/projects/add",
        {
          projectName: formData.projectName,
          projectType: formData.projectType,
          description: formData.description,
          state: formData.state,
          district: formData.district,
          city: formData.city,
          location: formData.location,
          landmark: formData.landmark,
          totalUnits: formData.totalUnits
            ? Number(formData.totalUnits)
            : undefined,
          availableUnits: formData.availableUnits
            ? Number(formData.availableUnits)
            : undefined,
          totalFloors: formData.totalFloors
            ? Number(formData.totalFloors)
            : undefined,
          possessionDate: formData.possessionDate || undefined,
          startingPrice: formData.startingPrice
            ? Number(formData.startingPrice)
            : undefined,
          amenities: formData.amenities,
          website: formData.website,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        "Project created successfully. It is now waiting for admin approval."
      );

      setTimeout(() => {
        navigate("/builder/projects");
      }, 1500);
    } catch (error) {
      console.error("Create project error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to create project."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "7px",
    border: "1px solid #1E4E78",
    background: "#0b1f36",
    color: "#ffffff",
    outline: "none",
    boxSizing: "border-box",
    fontSize: "14px",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "7px",
    color: "#b8c7d9",
    fontSize: "14px",
    fontWeight: "500",
  };

  const fieldStyle = {
    marginBottom: "20px",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#071525",
        color: "#ffffff",
        padding: "35px 6%",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "32px",
            }}
          >
            <span style={{ color: "#ff5733" }}>Add</span>{" "}
            <span style={{ color: "#33c1ff" }}>Project</span>
          </h1>

          <p
            style={{
              color: "#9fb2c8",
              marginTop: "8px",
            }}
          >
            Add your real estate project for admin approval.
          </p>
        </div>

        <button
          onClick={() => navigate("/builder/projects")}
          style={{
            padding: "10px 18px",
            border: "1px solid #1E4E78",
            borderRadius: "7px",
            background: "#102238",
            color: "#ffffff",
            cursor: "pointer",
          }}
        >
          ← Back to Projects
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          background: "#102238",
          border: "1px solid #1E4E78",
          borderRadius: "14px",
          padding: "30px",
        }}
      >
        {/* Project Basic Information */}
        <h2
          style={{
            color: "#33c1ff",
            marginTop: 0,
            marginBottom: "25px",
          }}
        >
          Project Information
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {/* Project Name */}
          <div style={fieldStyle}>
            <label style={labelStyle}>
              Project Name *
            </label>

            <input
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              placeholder="Enter project name"
              required
              style={inputStyle}
            />
          </div>

          {/* Project Type */}
          <div style={fieldStyle}>
            <label style={labelStyle}>
              Project Type *
            </label>

            <select
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">Select project type</option>
              <option value="Residential">
                Residential
              </option>
              <option value="Commercial">
                Commercial
              </option>
              <option value="Mixed Use">
                Mixed Use
              </option>
              <option value="Township">
                Township
              </option>
              <option value="Villa Project">
                Villa Project
              </option>
              <option value="Apartment Project">
                Apartment Project
              </option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div style={fieldStyle}>
          <label style={labelStyle}>
            Project Description *
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the project..."
            rows="5"
            required
            style={{
              ...inputStyle,
              resize: "vertical",
            }}
          />
        </div>

        {/* Location */}
        <h2
          style={{
            color: "#33c1ff",
            marginTop: "35px",
            marginBottom: "25px",
          }}
        >
          Project Location
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {/* State */}
          <div style={fieldStyle}>
            <label style={labelStyle}>
              State *
            </label>

            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="e.g. Karnataka"
              required
              style={inputStyle}
            />
          </div>

          {/* District */}
          <div style={fieldStyle}>
            <label style={labelStyle}>
              District
            </label>

            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleChange}
              placeholder="e.g. Belagavi"
              style={inputStyle}
            />
          </div>

          {/* City */}
          <div style={fieldStyle}>
            <label style={labelStyle}>
              City *
            </label>

            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. Belagavi"
              required
              style={inputStyle}
            />
          </div>

          {/* Location */}
          <div style={fieldStyle}>
            <label style={labelStyle}>
              Location *
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Area / locality"
              required
              style={inputStyle}
            />
          </div>

          {/* Landmark */}
          <div style={fieldStyle}>
            <label style={labelStyle}>
              Landmark
            </label>

            <input
              type="text"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
              placeholder="Nearby landmark"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Project Details */}
        <h2
          style={{
            color: "#33c1ff",
            marginTop: "35px",
            marginBottom: "25px",
          }}
        >
          Project Details
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {/* Total Units */}
          <div style={fieldStyle}>
            <label style={labelStyle}>
              Total Units
            </label>

            <input
              type="number"
              name="totalUnits"
              value={formData.totalUnits}
              onChange={handleChange}
              placeholder="e.g. 120"
              min="0"
              style={inputStyle}
            />
          </div>

          {/* Available Units */}
          <div style={fieldStyle}>
            <label style={labelStyle}>
              Available Units
            </label>

            <input
              type="number"
              name="availableUnits"
              value={formData.availableUnits}
              onChange={handleChange}
              placeholder="e.g. 85"
              min="0"
              style={inputStyle}
            />
          </div>

          {/* Total Floors */}
          <div style={fieldStyle}>
            <label style={labelStyle}>
              Total Floors
            </label>

            <input
              type="number"
              name="totalFloors"
              value={formData.totalFloors}
              onChange={handleChange}
              placeholder="e.g. 12"
              min="0"
              style={inputStyle}
            />
          </div>

          {/* Possession Date */}
          <div style={fieldStyle}>
            <label style={labelStyle}>
              Possession Date
            </label>

            <input
              type="date"
              name="possessionDate"
              value={formData.possessionDate}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {/* Starting Price */}
          <div style={fieldStyle}>
            <label style={labelStyle}>
              Starting Price
            </label>

            <input
              type="number"
              name="startingPrice"
              value={formData.startingPrice}
              onChange={handleChange}
              placeholder="e.g. 5000000"
              min="0"
              style={inputStyle}
            />
          </div>

          {/* Website */}
          <div style={fieldStyle}>
            <label style={labelStyle}>
              Project Website
            </label>

            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Amenities */}
        <div style={fieldStyle}>
          <label style={labelStyle}>
            Amenities
          </label>

          <input
            type="text"
            name="amenities"
            value={formData.amenities}
            onChange={handleChange}
            placeholder="Swimming Pool, Gym, Parking, Garden"
            style={inputStyle}
          />

          <small
            style={{
              display: "block",
              marginTop: "7px",
              color: "#71859b",
            }}
          >
            Separate multiple amenities with commas.
          </small>
        </div>

        {/* Messages */}
        {message && (
          <div
            style={{
              marginTop: "20px",
              padding: "13px",
              borderRadius: "7px",
              background: "#123c2a",
              border: "1px solid #28a745",
              color: "#7ee2a8",
            }}
          >
            {message}
          </div>
        )}

        {error && (
          <div
            style={{
              marginTop: "20px",
              padding: "13px",
              borderRadius: "7px",
              background: "#3b1c1c",
              border: "1px solid #ff5733",
              color: "#ff8a70",
            }}
          >
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            marginTop: "30px",
            padding: "14px",
            border: "none",
            borderRadius: "8px",
            background:
              "linear-gradient(90deg, #0878e8, #1251c7)",
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: "700",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Creating Project..." : "Create Project"}
        </button>

        <p
          style={{
            textAlign: "center",
            color: "#71859b",
            fontSize: "13px",
            marginTop: "15px",
            marginBottom: 0,
          }}
        >
          Your project will remain Pending until an admin approves it.
        </p>
      </form>
    </div>
  );
};

export default BuilderAddProject;