import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminPackages = () => {
  const navigate = useNavigate();

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    packageName: "",
    description: "",
    price: "",
    duration: "",
    listingLimit: "",
    featuredListingLimit: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // ==========================================
  // FETCH PACKAGES
  // ==========================================

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:9000/packages/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPackages(response.data.packages || []);
    } catch (err) {
      console.error("Fetch packages error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load packages."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPackages();
    }
  }, []);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // CREATE PACKAGE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:9000/packages",
        {
          packageName: formData.packageName,
          description: formData.description,
          price: Number(formData.price),
          duration: Number(formData.duration),
          listingLimit: Number(formData.listingLimit),
          featuredListingLimit: Number(
            formData.featuredListingLimit || 0
          ),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message ||
          "Package created successfully."
      );

      setFormData({
        packageName: "",
        description: "",
        price: "",
        duration: "",
        listingLimit: "",
        featuredListingLimit: "",
      });

      setShowForm(false);

      fetchPackages();
    } catch (err) {
      console.error("Create package error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to create package."
      );
    }
  };

  // ==========================================
  // DELETE PACKAGE
  // ==========================================

  const handleDelete = async (packageId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this package?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setMessage("");
      setError("");

      const response = await axios.delete(
        `http://localhost:9000/packages/admin/${packageId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message ||
          "Package deleted successfully."
      );

      fetchPackages();
    } catch (err) {
      console.error("Delete package error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete package."
      );
    }
  };

  return (
    <div style={styles.page}>

      {/* =====================================
          SIDEBAR
      ====================================== */}

      <div style={styles.sidebar}>

        <div style={styles.logo}>
          <span style={{ color: "#ff5733" }}>
            Prop
          </span>
          <span style={{ color: "#33c1ff" }}>
            Nexa
          </span>
        </div>

        <button
          style={styles.menuButton}
          onClick={() =>
            navigate("/admin/dashboard")
          }
        >
          🏠 Dashboard
        </button>

        <button
          style={styles.menuButton}
          onClick={() =>
            navigate("/admin/pending")
          }
        >
          🏠 Pending Properties
        </button>

        <button
          style={styles.menuButton}
          onClick={() =>
            navigate("/admin/agents")
          }
        >
          👤 Agents
        </button>

        <button
          style={styles.menuButton}
          onClick={() =>
            navigate("/admin/Builders")
          }
        >
          🏢 Builders
        </button>

        <button
          style={styles.menuButton}
          onClick={() =>
            navigate("/admin/reviews")
          }
        >
          ⭐ Reviews & Ratings
        </button>

      </div>

      {/* =====================================
          MAIN CONTENT
      ====================================== */}

      <div style={styles.content}>

        <div style={styles.header}>

          <div>
            <h1 style={styles.heading}>
              Package Management
            </h1>

            <p style={styles.subtitle}>
              Create and manage property provider packages.
            </p>
          </div>

          <button
            style={styles.createButton}
            onClick={() =>
              setShowForm(!showForm)
            }
          >
            {showForm
              ? "✕ Close"
              : "+ Create Package"}
          </button>

        </div>

        {/* =====================================
            MESSAGES
        ====================================== */}

        {message && (
          <div style={styles.success}>
            {message}
          </div>
        )}

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {/* =====================================
            CREATE PACKAGE FORM
        ====================================== */}

        {showForm && (
          <div style={styles.formSection}>

            <h2 style={styles.formTitle}>
              Create New Package
            </h2>

            <form onSubmit={handleSubmit}>

              <div style={styles.formGrid}>

                <div style={styles.field}>
                  <label style={styles.label}>
                    Package Name
                  </label>

                  <input
                    type="text"
                    name="packageName"
                    value={formData.packageName}
                    onChange={handleChange}
                    placeholder="Example: Basic"
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>
                    Price
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="999"
                    min="0"
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>
                    Duration (Days)
                  </label>

                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="30"
                    min="1"
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>
                    Listing Limit
                  </label>

                  <input
                    type="number"
                    name="listingLimit"
                    value={formData.listingLimit}
                    onChange={handleChange}
                    placeholder="10"
                    min="0"
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>
                    Featured Listing Limit
                  </label>

                  <input
                    type="number"
                    name="featuredListingLimit"
                    value={
                      formData.featuredListingLimit
                    }
                    onChange={handleChange}
                    placeholder="2"
                    min="0"
                    style={styles.input}
                  />
                </div>

                <div
                  style={{
                    ...styles.field,
                    gridColumn: "1 / -1",
                  }}
                >
                  <label style={styles.label}>
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe what this package includes..."
                    rows="4"
                    style={styles.textarea}
                  />
                </div>

              </div>

              <button
                type="submit"
                style={styles.saveButton}
              >
                Create Package
              </button>

            </form>

          </div>
        )}

        {/* =====================================
            PACKAGE LIST
        ====================================== */}

        <div style={styles.sectionHeader}>

          <h2 style={styles.sectionTitle}>
            Available Packages
          </h2>

          <span style={styles.count}>
            {packages.length} Packages
          </span>

        </div>

        {loading ? (
          <p style={styles.messageText}>
            Loading packages...
          </p>
        ) : packages.length === 0 ? (
          <div style={styles.emptyBox}>
            <div style={styles.emptyIcon}>
              📦
            </div>

            <h3>
              No Packages Yet
            </h3>

            <p>
              Create your first package using the
              Create Package button.
            </p>
          </div>
        ) : (
          <div style={styles.packageGrid}>

            {packages.map((packageData) => (
              <div
                key={packageData._id}
                style={styles.packageCard}
              >

                <div style={styles.packageHeader}>

                  <h3 style={styles.packageName}>
                    {packageData.packageName}
                  </h3>

                  <span
                    style={{
                      ...styles.status,
                      backgroundColor:
                        packageData.isActive
                          ? "#164d35"
                          : "#4d1c1c",
                      color:
                        packageData.isActive
                          ? "#7dffb2"
                          : "#ff8d8d",
                    }}
                  >
                    {packageData.isActive
                      ? "Active"
                      : "Inactive"}
                  </span>

                </div>

                <p style={styles.description}>
                  {packageData.description ||
                    "No description available."}
                </p>

                <div style={styles.price}>
                  ₹
                  {Number(
                    packageData.price
                  ).toLocaleString("en-IN")}
                </div>

                <p style={styles.duration}>
                  Valid for{" "}
                  <strong>
                    {packageData.duration}
                  </strong>{" "}
                  days
                </p>

                <div style={styles.features}>

                  <div style={styles.feature}>
                    🏠
                    <span>
                      {packageData.listingLimit}{" "}
                      Property Listings
                    </span>
                  </div>

                  <div style={styles.feature}>
                    ⭐
                    <span>
                      {packageData.featuredListingLimit}{" "}
                      Featured Listings
                    </span>
                  </div>

                </div>

                <button
                  style={styles.deleteButton}
                  onClick={() =>
                    handleDelete(
                      packageData._id
                    )
                  }
                >
                  Delete Package
                </button>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

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

  content: {
    flex: 1,
    padding: "40px",
    boxSizing: "border-box",
    overflowY: "auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "30px",
  },

  heading: {
    fontSize: "32px",
    margin: "0 0 8px",
  },

  subtitle: {
    color: "#8fa4b8",
    margin: 0,
  },

  createButton: {
    padding: "12px 20px",
    border: "none",
    borderRadius: "7px",
    background:
      "linear-gradient(135deg, #0878e8, #1251c7)",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "600",
  },

  success: {
    backgroundColor: "#164d35",
    color: "#7dffb2",
    padding: "12px 15px",
    borderRadius: "7px",
    marginBottom: "20px",
  },

  error: {
    backgroundColor: "#4d1c1c",
    color: "#ff8d8d",
    padding: "12px 15px",
    borderRadius: "7px",
    marginBottom: "20px",
  },

  formSection: {
    backgroundColor: "#102238",
    border: "1px solid #1E4E78",
    borderRadius: "10px",
    padding: "30px",
    marginBottom: "35px",
  },

  formTitle: {
    marginTop: 0,
    marginBottom: "25px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "20px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
  },

  label: {
    color: "#d8e3ed",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "8px",
  },

  input: {
    padding: "12px",
    backgroundColor: "#071525",
    color: "#ffffff",
    border: "1px solid #35516d",
    borderRadius: "7px",
    outline: "none",
    boxSizing: "border-box",
  },

  textarea: {
    padding: "12px",
    backgroundColor: "#071525",
    color: "#ffffff",
    border: "1px solid #35516d",
    borderRadius: "7px",
    outline: "none",
    resize: "vertical",
    boxSizing: "border-box",
  },

  saveButton: {
    marginTop: "25px",
    padding: "12px 22px",
    border: "none",
    borderRadius: "7px",
    backgroundColor: "#168a45",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "600",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "23px",
  },

  count: {
    color: "#33c1ff",
    fontSize: "13px",
  },

  packageGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
  },

  packageCard: {
    backgroundColor: "#102238",
    border: "1px solid #1E4E78",
    borderRadius: "10px",
    padding: "25px",
  },

  packageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
  },

  packageName: {
    margin: 0,
    fontSize: "21px",
  },

  status: {
    padding: "5px 9px",
    borderRadius: "5px",
    fontSize: "11px",
    fontWeight: "600",
  },

  description: {
    color: "#8fa4b8",
    fontSize: "13px",
    lineHeight: "1.6",
    minHeight: "42px",
  },

  price: {
    fontSize: "30px",
    fontWeight: "700",
    color: "#33c1ff",
    marginTop: "20px",
  },

  duration: {
    color: "#b8c7d6",
    fontSize: "13px",
  },

  features: {
    borderTop: "1px solid #1E4E78",
    marginTop: "20px",
    paddingTop: "15px",
  },

  feature: {
    display: "flex",
    gap: "10px",
    color: "#d8e3ed",
    fontSize: "13px",
    marginBottom: "10px",
  },

  deleteButton: {
    width: "100%",
    marginTop: "15px",
    padding: "10px",
    border: "1px solid #b52b36",
    borderRadius: "6px",
    backgroundColor: "transparent",
    color: "#ff8d8d",
    cursor: "pointer",
    fontWeight: "600",
  },

  emptyBox: {
    textAlign: "center",
    padding: "60px 20px",
    backgroundColor: "#102238",
    border: "1px dashed #1E4E78",
    borderRadius: "10px",
    color: "#8fa4b8",
  },

  emptyIcon: {
    fontSize: "40px",
    marginBottom: "10px",
  },

  messageText: {
    color: "#8fa4b8",
  },
};

export default AdminPackages;