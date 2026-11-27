import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Projects = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:9000/projects/approved"
      );

      const data = response.data;

      if (Array.isArray(data)) {
        setProjects(data);
      } else if (Array.isArray(data.projects)) {
        setProjects(data.projects);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load projects."
      );
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (image) => {
    if (!image) return null;

    if (image.startsWith("http")) {
      return image;
    }

    return `http://localhost:9000${image}`;
  };

  const formatPrice = (price) => {
    if (!price) return "Price on request";

    return `₹${Number(price).toLocaleString("en-IN")}`;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#071525",
        color: "#ffffff",
        padding: "40px 6%",
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "40px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "36px",
            fontWeight: "700",
          }}
        >
          <span style={{ color: "#ff5733" }}>Prop</span>
          <span style={{ color: "#33c1ff" }}>Nexa</span>{" "}
          Projects
        </h1>

        <p
          style={{
            color: "#b8c7d9",
            marginTop: "10px",
            fontSize: "16px",
          }}
        >
          Explore approved real estate projects from verified builders.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "#33c1ff",
            fontSize: "18px",
          }}
        >
          Loading projects...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div
          style={{
            maxWidth: "600px",
            margin: "40px auto",
            padding: "20px",
            background: "#102238",
            border: "1px solid #ff5733",
            borderRadius: "10px",
            textAlign: "center",
            color: "#ff8a70",
          }}
        >
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && projects.length === 0 && (
        <div
          style={{
            maxWidth: "600px",
            margin: "40px auto",
            padding: "50px 20px",
            background: "#102238",
            border: "1px solid #1E4E78",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <h2 style={{ marginBottom: "10px" }}>
            No Projects Available
          </h2>

          <p
            style={{
              color: "#9fb2c8",
              margin: 0,
            }}
          >
            Approved builder projects will appear here.
          </p>
        </div>
      )}

      {/* Projects Grid */}
      {!loading && !error && projects.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "25px",
          }}
        >
          {projects.map((project) => {
            const image =
              project.projectImage ||
              project.images?.[0] ||
              "";

            return (
              <div
                key={project._id}
                style={{
                  background: "#102238",
                  border: "1px solid #1E4E78",
                  borderRadius: "14px",
                  overflow: "hidden",
                  boxShadow:
                    "0 8px 25px rgba(0,0,0,0.25)",
                }}
              >
                {/* Image */}
                <div
                  style={{
                    height: "200px",
                    background: "#0b1f36",
                    overflow: "hidden",
                  }}
                >
                  {image ? (
                    <img
                      src={getImageUrl(image)}
                      alt={project.projectName}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#71859b",
                      }}
                    >
                      No Image
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: "20px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <h2
                      style={{
                        margin: 0,
                        fontSize: "21px",
                      }}
                    >
                      {project.projectName}
                    </h2>

                    <span
                      style={{
                        background: "#0878e8",
                        padding: "5px 10px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Approved
                    </span>
                  </div>

                  {/* Project Type */}
                  <p
                    style={{
                      color: "#33c1ff",
                      marginTop: "12px",
                      marginBottom: "8px",
                    }}
                  >
                    {project.projectType}
                  </p>

                  {/* Location */}
                  <p
                    style={{
                      color: "#b8c7d9",
                      margin: "8px 0",
                    }}
                  >
                    📍 {project.location},{" "}
                    {project.city}, {project.state}
                  </p>

                  {/* Price */}
                  <p
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "#ff5733",
                      margin: "14px 0",
                    }}
                  >
                    Starting from{" "}
                    {formatPrice(project.startingPrice)}
                  </p>

                  {/* Units */}
                  <div
                    style={{
                      display: "flex",
                      gap: "15px",
                      flexWrap: "wrap",
                      color: "#b8c7d9",
                      fontSize: "14px",
                    }}
                  >
                    <span>
                      🏢 Total: {project.totalUnits || "N/A"}
                    </span>

                    <span>
                      🏠 Available:{" "}
                      {project.availableUnits || "N/A"}
                    </span>
                  </div>

                  {/* Button */}
                  <button
                    onClick={() =>
                      navigate(`/projects/${project._id}`)
                    }
                    style={{
                      width: "100%",
                      marginTop: "20px",
                      padding: "11px",
                      border: "none",
                      borderRadius: "7px",
                      background:
                        "linear-gradient(90deg, #0878e8, #1251c7)",
                      color: "#ffffff",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    View Project
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Projects;