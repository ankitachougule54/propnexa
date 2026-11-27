import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function BuilderProjects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // ==========================================
  // FETCH BUILDER PROJECTS
  // ==========================================

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:9000/projects/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProjects(
        Array.isArray(response.data)
          ? response.data
          : response.data.projects || []
      );
    } catch (err) {
      console.error("Fetch builder projects error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load projects."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // ==========================================
  // DELETE PROJECT
  // ==========================================

  const deleteProject = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:9000/projects/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchProjects();
    } catch (err) {
      console.error("Delete project error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete project."
      );
    }
  };

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Approved":
        return {
          background: "#dcfce7",
          color: "#166534",
        };

      case "Pending":
        return {
          background: "#fef3c7",
          color: "#92400e",
        };

      case "Rejected":
        return {
          background: "#fee2e2",
          color: "#991b1b",
        };

      default:
        return {
          background: "#e5e7eb",
          color: "#374151",
        };
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

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
        Loading projects...
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

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
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
            marginBottom: "30px",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "32px",
              }}
            >
              My Projects
            </h1>

            <p
              style={{
                color: "#9ca3af",
                marginTop: "8px",
              }}
            >
              Manage your real estate projects.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() =>
                navigate("/builder/dashboard")
              }
              style={{
                background: "#102238",
                border: "1px solid #1E4E78",
                color: "#33c1ff",
                padding: "10px 18px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              ← Dashboard
            </button>

            <button
              onClick={() =>
                navigate("/builder/projects/add")
              }
              style={{
                background:
                  "linear-gradient(135deg, #0878e8, #1251c7)",
                border: "none",
                color: "white",
                padding: "10px 18px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              + Add Project
            </button>
          </div>
        </div>

        {/* ERROR */}

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

        {/* PROJECT COUNT */}

        <div
          style={{
            background: "#102238",
            border: "1px solid #1E4E78",
            borderRadius: "10px",
            padding: "18px 20px",
            marginBottom: "25px",
          }}
        >
          Total Projects:{" "}
          <strong style={{ color: "#33c1ff" }}>
            {projects.length}
          </strong>
        </div>

        {/* EMPTY STATE */}

        {projects.length === 0 ? (
          <div
            style={{
              background: "#102238",
              border: "1px solid #1E4E78",
              borderRadius: "12px",
              padding: "70px 20px",
              textAlign: "center",
            }}
          >
            <h2>No Projects Yet</h2>

            <p
              style={{
                color: "#9ca3af",
                marginBottom: "25px",
              }}
            >
              You haven't created any projects yet.
            </p>

            <button
              onClick={() =>
                navigate("/builder/projects/add")
              }
              style={{
                background:
                  "linear-gradient(135deg, #0878e8, #1251c7)",
                border: "none",
                color: "white",
                padding: "11px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Create Your First Project
            </button>
          </div>
        ) : (
          /* PROJECT LIST */

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {projects.map((project) => (
              <div
                key={project._id}
                style={{
                  background: "#102238",
                  border: "1px solid #1E4E78",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                {/* PROJECT IMAGE */}

                <div
                  style={{
                    height: "190px",
                    background: "#0b1f36",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {project.projectImage ? (
                    <img
                      src={`http://localhost:9000${project.projectImage}`}
                      alt={project.projectName}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        color: "#64748b",
                      }}
                    >
                      No Project Image
                    </span>
                  )}
                </div>

                {/* PROJECT CONTENT */}

                <div
                  style={{
                    padding: "20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
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
                        ...getStatusStyle(
                          project.status
                        ),
                        padding: "5px 9px",
                        borderRadius: "15px",
                        fontSize: "12px",
                        fontWeight: "600",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {project.status}
                    </span>
                  </div>

                  <p
                    style={{
                      color: "#33c1ff",
                      margin: "12px 0 6px",
                    }}
                  >
                    {project.projectType}
                  </p>

                  <p
                    style={{
                      color: "#cbd5e1",
                      margin: "6px 0",
                    }}
                  >
                    📍 {project.city},{" "}
                    {project.state}
                  </p>

                  {project.startingPrice && (
                    <p
                      style={{
                        color: "#cbd5e1",
                        margin: "6px 0",
                      }}
                    >
                      💰 Starting Price: ₹
                      {Number(
                        project.startingPrice
                      ).toLocaleString("en-IN")}
                    </p>
                  )}

                  {project.totalUnits !==
                    undefined && (
                    <p
                      style={{
                        color: "#cbd5e1",
                        margin: "6px 0",
                      }}
                    >
                      🏢 Total Units:{" "}
                      {project.totalUnits}
                    </p>
                  )}

                  {project.availableUnits !==
                    undefined && (
                    <p
                      style={{
                        color: "#cbd5e1",
                        margin: "6px 0",
                      }}
                    >
                      Available Units:{" "}
                      {project.availableUnits}
                    </p>
                  )}

                  {/* ACTIONS */}

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "20px",
                    }}
                  >
                    <button
                      onClick={() =>
                        navigate(
                          `/builder/projects/edit/${project._id}`
                        )
                      }
                      style={{
                        flex: 1,
                        background: "#0b1f36",
                        border:
                          "1px solid #1E4E78",
                        color: "#33c1ff",
                        padding: "9px",
                        borderRadius: "7px",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteProject(project._id)
                      }
                      style={{
                        flex: 1,
                        background: "#450a0a",
                        border:
                          "1px solid #7f1d1d",
                        color: "#fecaca",
                        padding: "9px",
                        borderRadius: "7px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BuilderProjects;
