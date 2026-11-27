import React, { useEffect, useState } from "react";
import axios from "axios";

function AgentProfile() {
  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    agencyName: "",
    phone: "",
    whatsapp: "",
    officeAddress: "",
    experience: "",
    reraNumber: "",
    serviceLocations: "",
    about: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login as an agent.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "http://localhost:9000/agent-profile/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data.profile;

      setProfile(data);

      setFormData({
        agencyName: data.agencyName || "",
        phone: data.phone || "",
        whatsapp: data.whatsapp || "",
        officeAddress: data.officeAddress || "",
        experience: data.experience || "",
        reraNumber: data.reraNumber || "",
        serviceLocations:
          data.serviceLocations?.join(", ") || "",
        about: data.about || "",
      });

    } catch (error) {
      console.error("Fetch agent profile error:", error);

      if (error.response?.status === 404) {
        setError("Agent profile not found.");
      } else {
        setError(
          error.response?.data?.message ||
            "Failed to load agent profile."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");

      const updatedData = {
        ...formData,
        experience: Number(formData.experience),
        serviceLocations:
          formData.serviceLocations
            .split(",")
            .map((location) => location.trim())
            .filter(Boolean),
      };

      const response = await axios.put(
        "http://localhost:9000/agent-profile/my",
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfile(response.data.profile);

      setMessage(
        "Agent profile updated successfully!"
      );

    } catch (error) {
      console.error(
        "Update agent profile error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.messagePage}>
        Loading agent profile...
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div style={styles.page}>
        <div style={styles.errorBox}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>

      <div style={styles.header}>
        <h1 style={styles.heading}>
          Agent Profile
        </h1>

        <p style={styles.subHeading}>
          Manage your professional real estate profile
        </p>
      </div>

      <div style={styles.container}>

        {message && (
          <div style={styles.successBox}>
            {message}
          </div>
        )}

        {error && (
          <div style={styles.errorBox}>
            {error}
          </div>
        )}

        {profile && (
          <div style={styles.statusBox}>
            <span>Profile Status</span>

            <strong
              style={{
                ...styles.status,
                ...(profile.status === "Approved"
                  ? styles.approved
                  : profile.status === "Blocked"
                  ? styles.blocked
                  : styles.pending),
              }}
            >
              {profile.status}
            </strong>
          </div>
        )}

        <form
          onSubmit={handleUpdate}
          style={styles.form}
        >

          <h2 style={styles.sectionTitle}>
            Professional Information
          </h2>

          <div style={styles.grid}>

            <div style={styles.field}>
              <label style={styles.label}>
                Agency Name
              </label>

              <input
                type="text"
                name="agencyName"
                value={formData.agencyName}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                WhatsApp
              </label>

              <input
                type="text"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                Experience (Years)
              </label>

              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                style={styles.input}
                min="0"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                RERA Number
              </label>

              <input
                type="text"
                name="reraNumber"
                value={formData.reraNumber}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                Service Locations
              </label>

              <input
                type="text"
                name="serviceLocations"
                value={formData.serviceLocations}
                onChange={handleChange}
                placeholder="Belagavi, Nipani, Kolhapur"
                style={styles.input}
              />
            </div>

          </div>

          <div style={styles.field}>
            <label style={styles.label}>
              Office Address
            </label>

            <textarea
              name="officeAddress"
              value={formData.officeAddress}
              onChange={handleChange}
              style={styles.textarea}
              rows="3"
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>
              About
            </label>

            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              style={styles.textarea}
              rows="5"
              placeholder="Tell customers about your experience and services..."
            />
          </div>

          <button
            type="submit"
            style={styles.button}
            disabled={saving}
          >
            {saving
              ? "Updating..."
              : "Update Profile"}
          </button>

        </form>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#071525",
    color: "#ffffff",
    paddingBottom: "80px",
  },

  header: {
    padding: "55px 20px 35px",
    textAlign: "center",
    backgroundColor: "#0b1f36",
    borderBottom: "1px solid #1E4E78",
  },

  heading: {
    margin: "0 0 10px",
    fontSize: "40px",
    fontWeight: "700",
  },

  subHeading: {
    margin: 0,
    color: "#9eafc1",
  },

  container: {
    maxWidth: "900px",
    margin: "40px auto",
    padding: "0 20px",
  },

  statusBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#102238",
    border: "1px solid #1E4E78",
    borderRadius: "10px",
    padding: "18px 20px",
    marginBottom: "25px",
  },

  status: {
    padding: "7px 14px",
    borderRadius: "20px",
    fontSize: "13px",
  },

  pending: {
    backgroundColor: "#4a3b16",
    color: "#ffd66b",
  },

  approved: {
    backgroundColor: "#153d2b",
    color: "#6ee7a1",
  },

  blocked: {
    backgroundColor: "#421c24",
    color: "#ff8585",
  },

  form: {
    backgroundColor: "#102238",
    border: "1px solid #1E4E78",
    borderRadius: "12px",
    padding: "30px",
  },

  sectionTitle: {
    marginTop: 0,
    marginBottom: "25px",
    fontSize: "23px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "20px",
  },

  label: {
    marginBottom: "8px",
    color: "#c8d4df",
    fontSize: "14px",
    fontWeight: "600",
  },

  input: {
    padding: "13px",
    borderRadius: "6px",
    border: "1px solid #1E4E78",
    backgroundColor: "#071525",
    color: "#ffffff",
    outline: "none",
  },

  textarea: {
    padding: "13px",
    borderRadius: "6px",
    border: "1px solid #1E4E78",
    backgroundColor: "#071525",
    color: "#ffffff",
    outline: "none",
    resize: "vertical",
  },

  button: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "7px",
    background:
      "linear-gradient(135deg, #0878e8, #1251c7)",
    color: "#ffffff",
    fontWeight: "600",
    fontSize: "15px",
    cursor: "pointer",
  },

  successBox: {
    backgroundColor: "#153d2b",
    border: "1px solid #2d7650",
    color: "#6ee7a1",
    padding: "14px",
    borderRadius: "7px",
    marginBottom: "20px",
  },

  errorBox: {
    backgroundColor: "#2a1520",
    border: "1px solid #6b2635",
    color: "#ff8585",
    padding: "14px",
    borderRadius: "7px",
    marginBottom: "20px",
  },

  messagePage: {
    minHeight: "100vh",
    backgroundColor: "#071525",
    color: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "18px",
  },
};

export default AgentProfile;