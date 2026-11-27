import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectError, setProjectError] = useState("");

  // ===============================
  // GET TOKEN
  // ===============================

  const token = localStorage.getItem("token");

  // ===============================
  // FETCH BUILDER PROJECTS
  // ===============================

  const fetchProjects = async () => {
    try {
      setLoadingProjects(true);
      setProjectError("");

      const response = await axios.get(
        "http://localhost:9000/projects/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Admin Projects:", response.data);

      const projectData = Array.isArray(response.data)
        ? response.data
        : response.data.projects || [];

      setProjects(projectData);
    } catch (error) {
      console.error("Failed to fetch projects:", error);

      setProjectError(
        error.response?.data?.message ||
          "Failed to load builder projects."
      );
    } finally {
      setLoadingProjects(false);
    }
  };

  // ===============================
  // LOAD PROJECTS
  // ===============================

  useEffect(() => {
    if (token) {
      fetchProjects();
    }
  }, []);

  // ===============================
  // APPROVE PROJECT
  // ===============================

  const approveProject = async (projectId) => {
    try {
      await axios.put(
        `http://localhost:9000/projects/admin/approve/${projectId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Project approved successfully.");

      fetchProjects();
    } catch (error) {
      console.error("Approve project error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to approve project."
      );
    }
  };

  // ===============================
  // REJECT PROJECT
  // ===============================

  const rejectProject = async (projectId) => {
    try {
      await axios.put(
        `http://localhost:9000/projects/admin/reject/${projectId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Project rejected successfully.");

      fetchProjects();
    } catch (error) {
      console.error("Reject project error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to reject project."
      );
    }
  };

  // ===============================
  // LOGOUT
  // ===============================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // ===============================
  // FILTER PENDING PROJECTS
  // ===============================

  const pendingProjects = projects.filter(
    (project) => project.status === "Pending"
  );

  return (
    <div style={styles.page}>

      {/* ===============================
          SIDEBAR
      =============================== */}

      <div style={styles.sidebar}>

        <div style={styles.logo}>
          <span style={{ color: "#ff5733" }}>Prop</span>
          <span style={{ color: "#33c1ff" }}>Nexa</span>
        </div>

        <button
          style={styles.menuButton}
          onClick={() => navigate("/admin/dashboard")}
        >
          🏠 Dashboard
        </button>

        <button
          style={styles.menuButton}
          onClick={() => navigate("/admin/pending")}
        >
          🏠 Pending Properties
        </button>

        <button
          style={styles.menuButton}
          onClick={() => navigate("/admin/agents")}
        >
          👤 Agents
        </button>

        <button
          style={styles.menuButton}
          onClick={() => navigate("/admin/Builders")}
        >
          🏢 Builders
        </button>

        <button
         style={styles.menuButton}
         onClick={() => navigate("/admin/reviews")}>
          ⭐ Reviews & Ratings
        </button>
        <button
            style={styles.menuButton}
            onClick={() => navigate("/admin/packages")}>
              📦 Packages
        </button>

        <button
          style={styles.logoutButton}
          onClick={logout}
        >
          Logout
        </button>

      </div>

      {/* ===============================
          MAIN CONTENT
      =============================== */}

      <div style={styles.content}>

        <h1 style={styles.heading}>
          Admin Dashboard
        </h1>

        <p style={styles.subtitle}>
          Welcome to the PropNexa administration panel.
        </p>

        {/* ===============================
            DASHBOARD CARDS
        =============================== */}

        <div style={styles.cards}>

          <div style={styles.card}>
            <h3>Total Users</h3>
            <p style={styles.number}>0</p>
          </div>

          <div style={styles.card}>
            <h3>Total Properties</h3>
            <p style={styles.number}>0</p>
          </div>

          <div style={styles.card}>
            <h3>Pending Properties</h3>
            <p style={styles.number}>1</p>
          </div>

          <div style={styles.card}>
            <h3>Active Properties</h3>
            <p style={styles.number}>0</p>
          </div>


        </div>
        {/* ===============================
    REVIEWS & RATINGS
================================ */}

<div style={styles.reviewSection}>

  <div>
    <h2 style={styles.reviewTitle}>
      ⭐ Reviews & Ratings
    </h2>

    <p style={styles.reviewText}>
      Review customer feedback and approve or reject submitted reviews.
    </p>
  </div>

  <button
    style={styles.reviewButton}
    onClick={() => navigate("/admin/reviews")}
  >
    View Reviews
  </button>

</div>

        {/* ===============================
            PROPERTY APPROVAL
        =============================== */}

        <div style={styles.section}>

          <h2>Property Approval</h2>

          <p>
            Review properties submitted by owners, agents and builders.
          </p>

          <button
            style={styles.primaryButton}
            onClick={() => navigate("/admin/pending")}
          >
            View Pending Properties
          </button>

        </div>

        {/* ===============================
            BUILDER PROJECT APPROVAL
        =============================== */}

        <div style={styles.projectSection}>

          <div style={styles.projectHeader}>

            <div>
              <h2 style={{ margin: 0 }}>
                Builder Project Approval
              </h2>

              <p style={styles.projectSubtitle}>
                Review projects submitted by builders.
              </p>
            </div>

            <div style={styles.pendingCount}>
              {pendingProjects.length} Pending
            </div>

          </div>

          {/* ERROR */}

          {projectError && (
            <div style={styles.errorBox}>
              {projectError}
            </div>
          )}

          {/* LOADING */}

          {loadingProjects && (
            <p style={styles.message}>
              Loading builder projects...
            </p>
          )}

          {/* NO PENDING PROJECTS */}

          {!loadingProjects &&
            !projectError &&
            pendingProjects.length === 0 && (
              <div style={styles.emptyBox}>
                <div style={styles.emptyIcon}>✓</div>

                <h3>No Pending Projects</h3>

                <p>
                  There are currently no builder projects waiting
                  for approval.
                </p>
              </div>
            )}

          {/* PENDING PROJECTS */}

          {!loadingProjects &&
            pendingProjects.length > 0 && (

              <div style={styles.projectGrid}>

                {pendingProjects.map((project) => {

                  const imageUrl = project.projectImage
                    ? `http://localhost:9000${project.projectImage}`
                    : null;

                  return (
                    <div
                      key={project._id}
                      style={styles.projectCard}
                    >

                      {/* PROJECT IMAGE */}

                      <div style={styles.imageContainer}>

                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={project.projectName}
                            style={styles.projectImage}
                          />
                        ) : (
                          <div style={styles.noImage}>
                            No Image
                          </div>
                        )}

                        <span style={styles.pendingBadge}>
                          Pending
                        </span>

                      </div>

                      {/* PROJECT DETAILS */}

                      <div style={styles.projectDetails}>

                        <h3 style={styles.projectName}>
                          {project.projectName}
                        </h3>

                        <p style={styles.projectType}>
                          {project.projectType}
                        </p>

                        <div style={styles.detailRow}>
                          📍
                          <span>
                            {project.location},{" "}
                            {project.city},{" "}
                            {project.state}
                          </span>
                        </div>

                        {project.startingPrice && (
                          <div style={styles.detailRow}>
                            💰
                            <span>
                              Starting Price: ₹
                              {Number(
                                project.startingPrice
                              ).toLocaleString("en-IN")}
                            </span>
                          </div>
                        )}

                        <div style={styles.unitRow}>

                          <div>
                            <small>Total Units</small>
                            <strong>
                              {project.totalUnits || 0}
                            </strong>
                          </div>

                          <div>
                            <small>Available</small>
                            <strong>
                              {project.availableUnits || 0}
                            </strong>
                          </div>

                        </div>

                        {/* ACTION BUTTONS */}

                        <div style={styles.actionButtons}>

                          <button
                            style={styles.approveButton}
                            onClick={() =>
                              approveProject(project._id)
                            }
                          >
                            ✓ Approve
                          </button>

                          <button
                            style={styles.rejectButton}
                            onClick={() =>
                              rejectProject(project._id)
                            }
                          >
                            ✕ Reject
                          </button>

                        </div>

                      </div>

                    </div>
                  );
                })}

              </div>
            )}

        </div>

      </div>

    </div>
  );
}


// =====================================================
// STYLES
// =====================================================

const styles = {

  page: {
    minHeight: "100vh",
    display: "flex",
    backgroundColor: "#071525",
    color: "#ffffff",
  },

  sidebar: {
    width: "240px",
    minHeight: "100vh",
    backgroundColor: "#0b1f36",
    borderRight: "1px solid #1E4E78",
    padding: "25px 15px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
  },

  logo: {
    fontSize: "28px",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "35px",
  },

  menuButton: {
    width: "100%",
    padding: "13px 15px",
    marginBottom: "10px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#102238",
    color: "#ffffff",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "14px",
  },

  logoutButton: {
    width: "100%",
    padding: "13px 15px",
    marginTop: "auto",
    border: "none",
    borderRadius: "6px",
    background:
      "linear-gradient(135deg, #0878e8, #1251c7)",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },

  content: {
    flex: 1,
    padding: "40px",
    boxSizing: "border-box",
    overflowY: "auto",
  },

  heading: {
    fontSize: "32px",
    margin: "0 0 8px",
  },

  subtitle: {
    color: "#8fa4b8",
    marginBottom: "35px",
  },

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    marginBottom: "35px",
  },

  card: {
    backgroundColor: "#102238",
    border: "1px solid #1E4E78",
    borderRadius: "10px",
    padding: "25px",
    minHeight: "120px",
    boxSizing: "border-box",
  },

  number: {
    fontSize: "30px",
    fontWeight: "700",
    color: "#33c1ff",
    margin: "15px 0 0",
  },

  section: {
    backgroundColor: "#102238",
    border: "1px solid #1E4E78",
    borderRadius: "10px",
    padding: "30px",
    maxWidth: "700px",
    marginBottom: "35px",
  },

  primaryButton: {
    marginTop: "15px",
    padding: "12px 20px",
    border: "none",
    borderRadius: "6px",
    background:
      "linear-gradient(135deg, #0878e8, #1251c7)",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "600",
  },

    reviewSection: {
    backgroundColor: "#102238",
    border: "1px solid #1E4E78",
    borderRadius: "10px",
    padding: "25px 30px",
    marginBottom: "35px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },

  reviewTitle: {
    margin: "0 0 8px",
    fontSize: "21px",
  },

  reviewText: {
    margin: 0,
    color: "#8fa4b8",
    fontSize: "14px",
  },

  reviewButton: {
    padding: "12px 20px",
    border: "none",
    borderRadius: "6px",
    background:
      "linear-gradient(135deg, #0878e8, #1251c7)",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },

  // ===============================
  // PROJECT SECTION
  // ===============================

  projectSection: {
    backgroundColor: "#0b1f36",
    border: "1px solid #1E4E78",
    borderRadius: "12px",
    padding: "30px",
  },

  projectHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },

  projectSubtitle: {
    color: "#8fa4b8",
    margin: "8px 0 0",
  },

  pendingCount: {
    backgroundColor: "#3a2d0a",
    color: "#ffc107",
    border: "1px solid #806500",
    padding: "8px 15px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
  },

  projectGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(330px, 1fr))",
    gap: "25px",
  },

  projectCard: {
    backgroundColor: "#102238",
    border: "1px solid #1E4E78",
    borderRadius: "12px",
    overflow: "hidden",
  },

  imageContainer: {
    width: "100%",
    height: "210px",
    position: "relative",
    backgroundColor: "#071525",
  },

  projectImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  noImage: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#8fa4b8",
  },

  pendingBadge: {
    position: "absolute",
    top: "12px",
    right: "12px",
    backgroundColor: "#ffc107",
    color: "#171717",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
  },

  projectDetails: {
    padding: "20px",
  },

  projectName: {
    margin: "0 0 7px",
    fontSize: "20px",
  },

  projectType: {
    color: "#33c1ff",
    fontSize: "13px",
    marginBottom: "15px",
  },

  detailRow: {
    display: "flex",
    gap: "8px",
    color: "#b8c7d6",
    fontSize: "13px",
    marginBottom: "10px",
    lineHeight: "1.5",
  },

  unitRow: {
    display: "flex",
    gap: "40px",
    borderTop: "1px solid #1E4E78",
    borderBottom: "1px solid #1E4E78",
    padding: "15px 0",
    marginTop: "15px",
    marginBottom: "18px",
  },

  actionButtons: {
    display: "flex",
    gap: "10px",
  },

  approveButton: {
    flex: 1,
    padding: "11px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#168a45",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "600",
  },

  rejectButton: {
    flex: 1,
    padding: "11px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#b52b36",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "600",
  },

  emptyBox: {
    textAlign: "center",
    padding: "50px 20px",
    backgroundColor: "#102238",
    borderRadius: "10px",
    border: "1px dashed #1E4E78",
    color: "#8fa4b8",
  },

  emptyIcon: {
    fontSize: "35px",
    color: "#33c1ff",
  },

  message: {
    color: "#8fa4b8",
    padding: "20px 0",
  },

  errorBox: {
    backgroundColor: "#3a1518",
    border: "1px solid #8b3038",
    color: "#ff8b91",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
  },

};

export default AdminDashboard;