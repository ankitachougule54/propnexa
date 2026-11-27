import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const BuilderEditProject = () => {
  const { id } = useParams();
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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch project
  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `http://localhost:9000/projects/${id}`
      );

      const project = response.data.project || response.data;

      setFormData({
        projectName: project.projectName || "",
        projectType: project.projectType || "",
        description: project.description || "",
        state: project.state || "",
        district: project.district || "",
        city: project.city || "",
        location: project.location || "",
        landmark: project.landmark || "",
        totalUnits: project.totalUnits ?? "",
        availableUnits: project.availableUnits ?? "",
        totalFloors: project.totalFloors ?? "",
        possessionDate: project.possessionDate
          ? project.possessionDate.substring(0, 10)
          : "",
        startingPrice: project.startingPrice ?? "",
        amenities: Array.isArray(project.amenities)
          ? project.amenities.join(", ")
          : project.amenities || "",
        website: project.website || "",
      });
    } catch (error) {
      console.error("Fetch project error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load project."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      await axios.put(
        `http://localhost:9000/projects/${id}`,
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

          possessionDate:
            formData.possessionDate || undefined,

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

      setMessage("Project updated successfully.");

      setTimeout(() => {
        navigate("/builder/projects");
      }, 1200);
    } catch (error) {
      console.error("Update project error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update project."
      );
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#071525",
          color: "#33c1ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
        }}
      >
        Loading project...
      </div>
    );
  }

  if (error && !formData.projectName) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#071525",
          color: "#ffffff",
          padding: "50px 6%",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#ff5733" }}>
          Unable to Load Project
        </h2>

        <p style={{ color: "#b8c7d9" }}>
          {error}
        </p>

        <button
          onClick={() => navigate("/builder/projects")}
          style={{
            marginTop: "20px",
            padding: "11px 20px",
            border: "none",
            borderRadius: "7px",
            background: "#0878e8",
            color: "#ffffff",
            cursor: "pointer",
          }}
        >
          Back to Projects
        </button>
      </div>
    );
  }

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
            <span style={{ color: "#ff5733" }}>
              Edit
            </span>{" "}
            <span style={{ color: "#33c1ff" }}>
              Project
            </span>
          </h1>

          <p
            style={{
              color: "#9fb2c8",
              marginTop: "8px",
            }}
          >
            Update your project information.
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
        {/* Project Information */}

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
          <div style={fieldStyle}>
            <label style={labelStyle}>
              Project Name *
            </label>

            <input
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
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

        {/* Description */}

        <div style={fieldStyle}>
          <label style={labelStyle}>
            Project Description *
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
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
          <div style={fieldStyle}>
            <label style={labelStyle}>
              State *
            </label>

            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
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
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>
              City *
            </label>

            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
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
          <div style={fieldStyle}>
            <label style={labelStyle}>
              Total Units
            </label>

            <input
              type="number"
              name="totalUnits"
              value={formData.totalUnits}
              onChange={handleChange}
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
              min="0"
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>
              Project Website
            </label>

            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
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

        {/* Save Button */}

        <button
          type="submit"
          disabled={saving}
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
            cursor: saving
              ? "not-allowed"
              : "pointer",
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving
            ? "Saving Changes..."
            : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default BuilderEditProject;