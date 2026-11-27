import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

      setProject(response.data.project || response.data);
    } catch (error) {
      console.error("Failed to fetch project:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load project details."
      );
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (image) => {
    if (!image) return "";

    if (image.startsWith("http")) {
      return image;
    }

    return `http://localhost:9000${image}`;
  };

  const formatPrice = (price) => {
    if (!price) return "Price on request";

    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    }

    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lakh`;
    }

    return `₹${price.toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#071525",
      color: "#ffffff",
      padding: "30px 20px 60px",
      boxSizing: "border-box",
    },

    container: {
      maxWidth: "1200px",
      margin: "0 auto",
    },

    backButton: {
      background: "transparent",
      border: "1px solid #1E4E78",
      color: "#ffffff",
      padding: "10px 18px",
      borderRadius: "8px",
      cursor: "pointer",
      marginBottom: "25px",
      fontSize: "14px",
    },

    hero: {
      background: "#102238",
      border: "1px solid #1E4E78",
      borderRadius: "16px",
      overflow: "hidden",
    },

    mainImageWrapper: {
      width: "100%",
      height: "430px",
      background: "#0b1f36",
    },

    mainImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
    },

    noImage: {
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "70px",
      color: "#668099",
    },

    heroContent: {
      padding: "28px",
    },

    projectType: {
      color: "#33c1ff",
      fontSize: "14px",
      fontWeight: "600",
      marginBottom: "8px",
      textTransform: "uppercase",
    },

    title: {
      fontSize: "34px",
      margin: "0 0 12px",
    },

    location: {
      color: "#a9bdd0",
      fontSize: "15px",
      marginBottom: "20px",
    },

    price: {
      color: "#33c1ff",
      fontSize: "27px",
      fontWeight: "700",
      marginBottom: "15px",
    },

    status: {
      display: "inline-block",
      background: "#0878e8",
      padding: "7px 14px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "600",
    },

    section: {
      background: "#102238",
      border: "1px solid #1E4E78",
      borderRadius: "16px",
      padding: "25px",
      marginTop: "25px",
    },

    sectionTitle: {
      fontSize: "22px",
      margin: "0 0 18px",
    },

    description: {
      color: "#b6c8d9",
      lineHeight: "1.8",
      fontSize: "15px",
      whiteSpace: "pre-line",
    },

    infoGrid: {
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit, minmax(180px, 1fr))",
      gap: "15px",
    },

    infoCard: {
      background: "#0b1f36",
      border: "1px solid #1E4E78",
      borderRadius: "10px",
      padding: "17px",
    },

    infoLabel: {
      color: "#829ab1",
      fontSize: "12px",
      marginBottom: "7px",
    },

    infoValue: {
      color: "#ffffff",
      fontSize: "15px",
      fontWeight: "600",
    },

    amenities: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
    },

    amenity: {
      background: "#0b1f36",
      border: "1px solid #1E4E78",
      color: "#d4e3ef",
      padding: "9px 14px",
      borderRadius: "20px",
      fontSize: "13px",
    },

    galleryGrid: {
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "15px",
    },

    galleryImage: {
      width: "100%",
      height: "180px",
      objectFit: "cover",
      borderRadius: "10px",
      border: "1px solid #1E4E78",
    },

    builderCard: {
      background: "#0b1f36",
      border: "1px solid #1E4E78",
      borderRadius: "12px",
      padding: "20px",
    },

    builderName: {
      fontSize: "20px",
      marginBottom: "10px",
    },

    builderText: {
      color: "#a9bdd0",
      fontSize: "14px",
      margin: "7px 0",
    },

    websiteButton: {
      marginTop: "15px",
      background: "#0878e8",
      color: "#ffffff",
      border: "none",
      padding: "11px 18px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
    },

    error: {
      textAlign: "center",
      padding: "60px 20px",
      color: "#ff8c8c",
    },

    loading: {
      textAlign: "center",
      padding: "60px 20px",
      color: "#9db2c8",
    },
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.loading}>
            Loading project details...
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <button
            style={styles.backButton}
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <div style={styles.error}>
            <h2>Project Not Found</h2>
            <p>{error || "Project details are unavailable."}</p>
          </div>
        </div>
      </div>
    );
  }

  const builder = project.builder || {};

  const galleryImages = Array.isArray(project.images)
    ? project.images
    : [];

  const allImages = [
    ...(project.projectImage
      ? [project.projectImage]
      : []),
    ...galleryImages,
  ];

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* BACK */}
        <button
          style={styles.backButton}
          onClick={() => navigate(-1)}
        >
          ← Back to Projects
        </button>

        {/* HERO */}
        <div style={styles.hero}>

          <div style={styles.mainImageWrapper}>
            {project.projectImage ? (
              <img
                src={getImageUrl(project.projectImage)}
                alt={project.projectName}
                style={styles.mainImage}
              />
            ) : (
              <div style={styles.noImage}>
                🏢
              </div>
            )}
          </div>

          <div style={styles.heroContent}>

            <div style={styles.projectType}>
              {project.projectType}
            </div>

            <h1 style={styles.title}>
              {project.projectName}
            </h1>

            <div style={styles.location}>
              📍 {project.location},{" "}
              {project.city}, {project.state}
            </div>

            <div style={styles.price}>
              {formatPrice(project.startingPrice)}
              <span
                style={{
                  fontSize: "14px",
                  color: "#9db2c8",
                  marginLeft: "8px",
                  fontWeight: "400",
                }}
              >
                onwards
              </span>
            </div>

            <span style={styles.status}>
              {project.status}
            </span>

          </div>
        </div>

        {/* DESCRIPTION */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            About This Project
          </h2>

          <p style={styles.description}>
            {project.description}
          </p>
        </div>

        {/* PROJECT INFORMATION */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            Project Information
          </h2>

          <div style={styles.infoGrid}>

            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>
                Project Type
              </div>

              <div style={styles.infoValue}>
                {project.projectType || "Not specified"}
              </div>
            </div>

            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>
                Total Units
              </div>

              <div style={styles.infoValue}>
                {project.totalUnits ?? "Not specified"}
              </div>
            </div>

            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>
                Available Units
              </div>

              <div style={styles.infoValue}>
                {project.availableUnits ?? "Not specified"}
              </div>
            </div>

            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>
                Total Floors
              </div>

              <div style={styles.infoValue}>
                {project.totalFloors ?? "Not specified"}
              </div>
            </div>

            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>
                Possession Date
              </div>

              <div style={styles.infoValue}>
                {formatDate(project.possessionDate)}
              </div>
            </div>

            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>
                Landmark
              </div>

              <div style={styles.infoValue}>
                {project.landmark || "Not specified"}
              </div>
            </div>

            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>
                District
              </div>

              <div style={styles.infoValue}>
                {project.district || "Not specified"}
              </div>
            </div>

            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>
                Starting Price
              </div>

              <div style={styles.infoValue}>
                {formatPrice(project.startingPrice)}
              </div>
            </div>

          </div>
        </div>

        {/* AMENITIES */}
        {project.amenities?.length > 0 && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              Amenities
            </h2>

            <div style={styles.amenities}>
              {project.amenities.map(
                (amenity, index) => (
                  <span
                    key={index}
                    style={styles.amenity}
                  >
                    ✓ {amenity}
                  </span>
                )
              )}
            </div>
          </div>
        )}

        {/* GALLERY */}
        {allImages.length > 0 && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              Project Gallery
            </h2>

            <div style={styles.galleryGrid}>
              {allImages.map((image, index) => (
                <img
                  key={index}
                  src={getImageUrl(image)}
                  alt={`${project.projectName} ${index + 1}`}
                  style={styles.galleryImage}
                />
              ))}
            </div>
          </div>
        )}

        {/* BUILDER */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            Builder Information
          </h2>

          <div style={styles.builderCard}>

            <h3 style={styles.builderName}>
              {builder.companyName ||
                builder.name ||
                "Builder"}
            </h3>

            {builder.city && (
              <p style={styles.builderText}>
                📍 {builder.city}
              </p>
            )}

            {builder.mobile && (
              <p style={styles.builderText}>
                📞 {builder.mobile}
              </p>
            )}

            {builder.email && (
              <p style={styles.builderText}>
                ✉️ {builder.email}
              </p>
            )}

            {builder.website && (
              <button
                style={styles.websiteButton}
                onClick={() =>
                  window.open(
                    builder.website,
                    "_blank"
                  )
                }
              >
                Visit Builder Website
              </button>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default ProjectDetails;