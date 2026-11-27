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

  const [projectImage, setProjectImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ============================
  // TEXT INPUT
  // ============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================
  // MAIN IMAGE
  // ============================

  const handleProjectImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setProjectImage(null);
      return;
    }

    setProjectImage(file);
    setError("");
  };

  // ============================
  // GALLERY IMAGES
  // ============================

  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length > 10) {
      setError("Maximum 10 gallery images are allowed.");
      setGalleryImages(files.slice(0, 10));
      return;
    }

    setGalleryImages(files);
    setError("");
  };

  // ============================
  // SUBMIT
  // ============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      if (!token) {
        setError("You are not logged in. Please login again.");
        setLoading(false);
        return;
      }

      if (!projectImage) {
        setError("Please select a main project image.");
        setLoading(false);
        return;
      }

      // ==================================
      // CREATE FORM DATA
      // ==================================

      const data = new FormData();

      data.append("projectName", formData.projectName.trim());
      data.append("projectType", formData.projectType);
      data.append("description", formData.description.trim());

      data.append("state", formData.state.trim());
      data.append("district", formData.district.trim());
      data.append("city", formData.city.trim());
      data.append("location", formData.location.trim());
      data.append("landmark", formData.landmark.trim());

      // Only append numbers when they have values
      if (formData.totalUnits !== "") {
        data.append("totalUnits", formData.totalUnits);
      }

      if (formData.availableUnits !== "") {
        data.append("availableUnits", formData.availableUnits);
      }

      if (formData.totalFloors !== "") {
        data.append("totalFloors", formData.totalFloors);
      }

      if (formData.possessionDate !== "") {
        data.append("possessionDate", formData.possessionDate);
      }

      if (formData.startingPrice !== "") {
        data.append("startingPrice", formData.startingPrice);
      }

      if (formData.amenities.trim() !== "") {
        data.append("amenities", formData.amenities.trim());
      }

      if (formData.website.trim() !== "") {
        data.append("website", formData.website.trim());
      }

      // ==================================
      // MAIN PROJECT IMAGE
      // ==================================

      data.append("projectImage", projectImage);

      // ==================================
      // GALLERY IMAGES
      // ==================================

      galleryImages.forEach((file) => {
        data.append("images", file);
      });

      // ==================================
      // DEBUG
      // ==================================

      console.log("Sending project:");

      for (const [key, value] of data.entries()) {
        if (value instanceof File) {
          console.log(key, value.name);
        } else {
          console.log(key, value);
        }
      }

      // ==================================
      // API REQUEST
      // ==================================

      const response = await axios.post(
        "http://localhost:9000/projects",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Project response:", response.data);

      setMessage(
        "Project created successfully and sent for admin approval."
      );

      // ==================================
      // REDIRECT
      // ==================================

      setTimeout(() => {
        navigate("/builder/projects");
      }, 1500);
    } catch (error) {
      console.error("Create project error:", error);

      console.error(
        "Backend response:",
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to create project."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // STYLES
  // ============================

  const inputStyle = {
    width: "100%",
    padding: "12px",
    boxSizing: "border-box",
    background: "#0b1f36",
    color: "#ffffff",
    border: "1px solid #1E4E78",
    borderRadius: "7px",
    outline: "none",
    fontSize: "14px",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "7px",
    color: "#b8c7d9",
    fontSize: "14px",
    fontWeight: "600",
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
          <h1 style={{ margin: 0, fontSize: "32px" }}>
            <span style={{ color: "#ff5733" }}>Add</span>{" "}
            <span style={{ color: "#33c1ff" }}>Project</span>
          </h1>

          <p style={{ color: "#9fb2c8" }}>
            Add a new real estate project.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/builder/projects")}
          style={{
            padding: "10px 18px",
            background: "#102238",
            color: "#ffffff",
            border: "1px solid #1E4E78",
            borderRadius: "7px",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>
      </div>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "30px",
          background: "#102238",
          border: "1px solid #1E4E78",
          borderRadius: "14px",
        }}
      >
        {/* PROJECT INFORMATION */}

        <h2
          style={{
            color: "#33c1ff",
            marginTop: 0,
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
          <div style={fieldStyle}>
            <label style={labelStyle}>
              Project Name *
            </label>

            <input
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              placeholder="Aurelia GreenSphere"
              required
              style={inputStyle}
            />
          </div>

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
              <option value="">
                Select project type
              </option>

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

        {/* DESCRIPTION */}

        <div style={fieldStyle}>
          <label style={labelStyle}>
            Description *
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

        {/* LOCATION */}

        <h2
          style={{
            color: "#33c1ff",
            marginTop: "35px",
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
          <div style={fieldStyle}>
            <label style={labelStyle}>State *</label>

            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Karnataka"
              required
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>
              District
            </label>

            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleChange}
              placeholder="Belagavi"
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>City *</label>

            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Belagavi"
              required
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>
              Location *
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Udyambag"
              required
              style={inputStyle}
            />
          </div>

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

        {/* PROJECT DETAILS */}

        <h2
          style={{
            color: "#33c1ff",
            marginTop: "35px",
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
          <div style={fieldStyle}>
            <label style={labelStyle}>
              Total Units
            </label>

            <input
              type="number"
              name="totalUnits"
              value={formData.totalUnits}
              onChange={handleChange}
              placeholder="240"
              min="0"
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>
              Available Units
            </label>

            <input
              type="number"
              name="availableUnits"
              value={formData.availableUnits}
              onChange={handleChange}
              placeholder="156"
              min="0"
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>
              Total Floors
            </label>

            <input
              type="number"
              name="totalFloors"
              value={formData.totalFloors}
              onChange={handleChange}
              placeholder="12"
              min="0"
              style={inputStyle}
            />
          </div>

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

          <div style={fieldStyle}>
            <label style={labelStyle}>
              Starting Price
            </label>

            <input
              type="number"
              name="startingPrice"
              value={formData.startingPrice}
              onChange={handleChange}
              placeholder="4500000"
              min="0"
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>
              Website
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

        {/* IMAGES */}

        <h2
          style={{
            color: "#33c1ff",
            marginTop: "35px",
          }}
        >
          Project Images
        </h2>

        <div style={fieldStyle}>
          <label style={labelStyle}>
            Main Project Image *
          </label>

          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleProjectImageChange}
            required
            style={{
              ...inputStyle,
              padding: "10px",
            }}
          />

          {projectImage && (
            <p
              style={{
                color: "#7ee2a8",
                fontSize: "13px",
              }}
            >
              Selected: {projectImage.name}
            </p>
          )}
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>
            Gallery Images
          </label>

          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            onChange={handleGalleryImagesChange}
            style={{
              ...inputStyle,
              padding: "10px",
            }}
          />

          {galleryImages.length > 0 && (
            <p
              style={{
                color: "#33c1ff",
                fontSize: "13px",
              }}
            >
              {galleryImages.length} gallery image(s) selected.
            </p>
          )}
        </div>

        {/* AMENITIES */}

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
        </div>

        {/* MESSAGE */}

        {message && (
          <div
            style={{
              padding: "12px",
              marginTop: "20px",
              background: "#123c2a",
              border: "1px solid #28a745",
              borderRadius: "7px",
              color: "#7ee2a8",
            }}
          >
            {message}
          </div>
        )}

        {error && (
          <div
            style={{
              padding: "12px",
              marginTop: "20px",
              background: "#3b1c1c",
              border: "1px solid #ff5733",
              borderRadius: "7px",
              color: "#ff8a70",
            }}
          >
            {error}
          </div>
        )}

        {/* SUBMIT */}

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
            cursor: loading
              ? "not-allowed"
              : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading
            ? "Creating Project..."
            : "Create Project"}
        </button>

        <p
          style={{
            textAlign: "center",
            color: "#71859b",
            fontSize: "13px",
            marginTop: "15px",
          }}
        >
          Your project will remain Pending until admin approval.
        </p>
      </form>
    </div>
  );
};

export default BuilderAddProject;