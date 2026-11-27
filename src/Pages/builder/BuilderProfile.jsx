import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BuilderProfile = () => {
  const navigate = useNavigate();

  const [builder, setBuilder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    logo: "",
    establishedYear: "",
    about: "",
    contactPerson: "",
    mobile: "",
    email: "",
    officeAddress: "",
    city: "",
    website: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // FETCH BUILDER PROFILE
  // ==========================================

  useEffect(() => {
    fetchBuilderProfile();
  }, []);

  const fetchBuilderProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:9000/builders/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data.builder;

      setBuilder(data);

      setFormData({
        companyName: data.companyName || "",
        logo: data.logo || "",
        establishedYear: data.establishedYear || "",
        about: data.about || "",
        contactPerson: data.contactPerson || "",
        mobile: data.mobile || "",
        email: data.email || "",
        officeAddress: data.officeAddress || "",
        city: data.city || "",
        website: data.website || "",
      });

      setError("");
    } catch (err) {
      console.error("Fetch builder profile error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load builder profile."
      );
    } finally {
      setLoading(false);
    }
  };

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
  // UPDATE PROFILE
  // ==========================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.put(
        "http://localhost:9000/builders/my",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBuilder(response.data.builder);

      setMessage("Builder profile updated successfully.");
      setEditing(false);
    } catch (err) {
      console.error("Update builder profile error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to update builder profile."
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div style={styles.centerPage}>
        Loading builder profile...
      </div>
    );
  }

  // ==========================================
  // NO PROFILE
  // ==========================================

  if (!builder) {
    return (
      <div style={styles.centerPage}>
        <div style={styles.errorBox}>
          <p style={styles.error}>
            {error || "Builder profile not found."}
          </p>

          <button
            style={styles.backButton}
            onClick={() => navigate("/builder/dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* HEADER */}

        <div style={styles.topBar}>

          <button
            style={styles.backButton}
            onClick={() => navigate("/builder/dashboard")}
          >
            ← Dashboard
          </button>

          {!editing && (
            <button
              style={styles.editButton}
              onClick={() => {
                setMessage("");
                setError("");
                setEditing(true);
              }}
            >
              Edit Profile
            </button>
          )}

        </div>

        {/* MESSAGES */}

        {message && (
          <div style={styles.successMessage}>
            {message}
          </div>
        )}

        {error && (
          <div style={styles.errorMessage}>
            {error}
          </div>
        )}

        {/* PROFILE CARD */}

        <div style={styles.profileCard}>

          {/* LOGO */}

          <div style={styles.logoWrapper}>

            {builder.logo ? (
              <img
                src={builder.logo}
                alt={builder.companyName}
                style={styles.logo}
              />
            ) : (
              <div style={styles.logoPlaceholder}>
                🏢
              </div>
            )}

          </div>

          <h1 style={styles.companyName}>
            {builder.companyName}
          </h1>

          <p style={styles.contactPerson}>
            {builder.contactPerson ||
              "Builder / Company"}
          </p>

          {/* VERIFICATION */}

          <div
            style={{
              ...styles.statusBadge,
              ...(builder.verificationStatus ===
              "Verified"
                ? styles.verified
                : builder.verificationStatus ===
                  "Rejected"
                ? styles.rejected
                : styles.pending),
            }}
          >
            {builder.verificationStatus ||
              "Pending"}
          </div>

          {/* VIEW MODE */}

          {!editing ? (
            <div style={styles.content}>

              {/* ABOUT */}

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  About Builder
                </h2>

                <p style={styles.about}>
                  {builder.about ||
                    "No information about this builder is available."}
                </p>
              </section>

              {/* COMPANY INFORMATION */}

              <section style={styles.section}>

                <h2 style={styles.sectionTitle}>
                  Company Information
                </h2>

                <div style={styles.infoGrid}>

                  <div style={styles.infoBox}>
                    <span style={styles.label}>
                      Company Name
                    </span>

                    <span style={styles.value}>
                      {builder.companyName ||
                        "Not provided"}
                    </span>
                  </div>

                  <div style={styles.infoBox}>
                    <span style={styles.label}>
                      Established Year
                    </span>

                    <span style={styles.value}>
                      {builder.establishedYear ||
                        "Not provided"}
                    </span>
                  </div>

                  <div style={styles.infoBox}>
                    <span style={styles.label}>
                      Contact Person
                    </span>

                    <span style={styles.value}>
                      {builder.contactPerson ||
                        "Not provided"}
                    </span>
                  </div>

                  <div style={styles.infoBox}>
                    <span style={styles.label}>
                      Mobile
                    </span>

                    <span style={styles.value}>
                      {builder.mobile ||
                        "Not provided"}
                    </span>
                  </div>

                  <div style={styles.infoBox}>
                    <span style={styles.label}>
                      Email
                    </span>

                    <span style={styles.value}>
                      {builder.email ||
                        builder.user?.email ||
                        "Not provided"}
                    </span>
                  </div>

                  <div style={styles.infoBox}>
                    <span style={styles.label}>
                      City
                    </span>

                    <span style={styles.value}>
                      {builder.city ||
                        "Not provided"}
                    </span>
                  </div>

                  <div style={styles.infoBox}>
                    <span style={styles.label}>
                      Office Address
                    </span>

                    <span style={styles.value}>
                      {builder.officeAddress ||
                        "Not provided"}
                    </span>
                  </div>

                  <div style={styles.infoBox}>
                    <span style={styles.label}>
                      Website
                    </span>

                    <span style={styles.value}>
                      {builder.website ||
                        "Not provided"}
                    </span>
                  </div>

                </div>
              </section>

            </div>
          ) : (

            /* EDIT MODE */

            <form
              onSubmit={handleUpdate}
              style={styles.form}
            >

              <h2 style={styles.sectionTitle}>
                Edit Builder Profile
              </h2>

              <div style={styles.formGrid}>

                <div style={styles.field}>
                  <label style={styles.fieldLabel}>
                    Company Name
                  </label>

                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.fieldLabel}>
                    Contact Person
                  </label>

                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.fieldLabel}>
                    Mobile
                  </label>

                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.fieldLabel}>
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.fieldLabel}>
                    Established Year
                  </label>

                  <input
                    type="number"
                    name="establishedYear"
                    value={formData.establishedYear}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.fieldLabel}>
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.fieldLabel}>
                    Website
                  </label>

                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="https://example.com"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.fieldLabel}>
                    Logo URL
                  </label>

                  <input
                    type="text"
                    name="logo"
                    value={formData.logo}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>

              </div>

              <div style={styles.field}>
                <label style={styles.fieldLabel}>
                  Office Address
                </label>

                <textarea
                  name="officeAddress"
                  value={formData.officeAddress}
                  onChange={handleChange}
                  style={styles.textarea}
                  rows="3"
                />
              </div>

              <div style={styles.field}>
                <label style={styles.fieldLabel}>
                  About Builder
                </label>

                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  style={styles.textarea}
                  rows="5"
                />
              </div>

              <div style={styles.formButtons}>

                <button
                  type="submit"
                  style={styles.saveButton}
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={() => {
                    setEditing(false);
                    setError("");
                    setMessage("");
                  }}
                >
                  Cancel
                </button>

              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "calc(100vh - 70px)",
    backgroundColor: "#071525",
    color: "#ffffff",
    padding: "35px 25px 70px",
    boxSizing: "border-box",
  },

  centerPage: {
    minHeight: "calc(100vh - 70px)",
    backgroundColor: "#071525",
    color: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },

  backButton: {
    backgroundColor: "transparent",
    border: "1px solid #1E4E78",
    color: "#33c1ff",
    padding: "10px 18px",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "14px",
  },

  editButton: {
    backgroundColor: "#0878e8",
    border: "none",
    color: "#ffffff",
    padding: "11px 20px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600",
  },

  profileCard: {
    backgroundColor: "#102238",
    border: "1px solid #1E4E78",
    borderRadius: "15px",
    padding: "45px",
    boxSizing: "border-box",
  },

  logoWrapper: {
    width: "125px",
    height: "125px",
    margin: "0 auto 20px",
    borderRadius: "50%",
    backgroundColor: "#0b1f36",
    border: "2px solid #1E4E78",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  logo: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  logoPlaceholder: {
    fontSize: "50px",
  },

  companyName: {
    textAlign: "center",
    fontSize: "32px",
    margin: "10px 0 7px",
  },

  contactPerson: {
    textAlign: "center",
    color: "#9db2c8",
    fontSize: "15px",
    margin: "0 0 15px",
  },

  statusBadge: {
    width: "fit-content",
    margin: "0 auto",
    padding: "8px 18px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
    border: "1px solid #1E4E78",
  },

  verified: {
    backgroundColor: "#0d3b2e",
    color: "#55e6a5",
  },

  pending: {
    backgroundColor: "#3b3210",
    color: "#ffd45c",
  },

  rejected: {
    backgroundColor: "#3b1515",
    color: "#ff6b6b",
  },

  content: {
    marginTop: "40px",
  },

  section: {
    marginTop: "40px",
  },

  sectionTitle: {
    color: "#ff5733",
    fontSize: "21px",
    marginBottom: "18px",
  },

  about: {
    color: "#b8c7d9",
    fontSize: "15px",
    lineHeight: "1.8",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "15px",
  },

  infoBox: {
    backgroundColor: "#0b1f36",
    border: "1px solid #1E4E78",
    borderRadius: "9px",
    padding: "17px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  label: {
    color: "#7f9ab3",
    fontSize: "13px",
  },

  value: {
    color: "#ffffff",
    fontSize: "15px",
    wordBreak: "break-word",
  },

  form: {
    marginTop: "40px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "18px",
  },

  field: {
    marginBottom: "20px",
  },

  fieldLabel: {
    display: "block",
    color: "#9db2c8",
    fontSize: "13px",
    marginBottom: "8px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "#0b1f36",
    border: "1px solid #1E4E78",
    borderRadius: "7px",
    padding: "12px",
    color: "#ffffff",
    outline: "none",
    fontSize: "14px",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "#0b1f36",
    border: "1px solid #1E4E78",
    borderRadius: "7px",
    padding: "12px",
    color: "#ffffff",
    outline: "none",
    fontSize: "14px",
    resize: "vertical",
  },

  formButtons: {
    display: "flex",
    gap: "12px",
    marginTop: "10px",
  },

  saveButton: {
    backgroundColor: "#0878e8",
    border: "none",
    color: "#ffffff",
    padding: "12px 22px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600",
  },

  cancelButton: {
    backgroundColor: "transparent",
    border: "1px solid #1E4E78",
    color: "#b8c7d9",
    padding: "12px 22px",
    borderRadius: "7px",
    cursor: "pointer",
  },

  successMessage: {
    backgroundColor: "#0d3b2e",
    border: "1px solid #1d6b50",
    color: "#55e6a5",
    padding: "12px 16px",
    borderRadius: "7px",
    marginBottom: "20px",
  },

  errorMessage: {
    backgroundColor: "#3b1515",
    border: "1px solid #7d2929",
    color: "#ff6b6b",
    padding: "12px 16px",
    borderRadius: "7px",
    marginBottom: "20px",
  },

  errorBox: {
    textAlign: "center",
  },

  error: {
    color: "#ff6b6b",
    marginBottom: "20px",
  },
};

export default BuilderProfile;