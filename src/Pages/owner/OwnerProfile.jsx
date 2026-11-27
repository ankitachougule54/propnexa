import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OwnerProfile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    whatsapp: "",
    address: "",
    city: "",
    profilePhoto: "",
    idDocument: "",
  });

  // =========================
  // FETCH OWNER PROFILE
  // =========================
  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9000/owner-profiles/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const ownerProfile = response.data.ownerProfile;

      setProfile(ownerProfile);

      setFormData({
        whatsapp: ownerProfile.whatsapp || "",
        address: ownerProfile.address || "",
        city: ownerProfile.city || "",
        profilePhoto: ownerProfile.profilePhoto || "",
        idDocument: ownerProfile.idDocument || "",
      });
    } catch (error) {
      console.error("Fetch owner profile error:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to load owner profile"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchProfile();
  }, []);

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // UPDATE PROFILE
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");

      const response = await axios.put(
        "http://localhost:9000/owner-profiles/my",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setProfile((prev) => ({
        ...prev,
        ...response.data.ownerProfile,
      }));

      setEditing(false);

      setMessage("Profile updated successfully.");
    } catch (error) {
      console.error("Update owner profile error:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // STATUS STYLE
  // =========================
  const getStatusStyle = (status) => {
    if (status === "Verified") {
      return {
        background: "#123d2b",
        color: "#35e89a",
      };
    }

    if (status === "Rejected") {
      return {
        background: "#421d24",
        color: "#ff7180",
      };
    }

    return {
      background: "#443815",
      color: "#ffd84d",
    };
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    background: "#071525",
    border: "1px solid #1E4E78",
    borderRadius: "7px",
    color: "#ffffff",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "7px",
    color: "#b5c4d4",
    fontSize: "14px",
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#071525",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading profile...
      </div>
    );
  }

  // =========================
  // MAIN UI
  // =========================
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#071525",
        color: "#ffffff",
        padding: "35px",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {/* BACK */}
        <button
          onClick={() => navigate("/owner/dashboard")}
          style={{
            background: "transparent",
            border: "none",
            color: "#55b8ff",
            cursor: "pointer",
            marginBottom: "18px",
            fontSize: "15px",
          }}
        >
          ← Back to Dashboard
        </button>

        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
            marginBottom: "25px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "30px",
              }}
            >
              My Profile
            </h1>

            <p
              style={{
                color: "#8ea3ba",
                marginTop: "8px",
              }}
            >
              Manage your owner profile information
            </p>
          </div>

          {!editing && (
            <button
              onClick={() => {
                setEditing(true);
                setMessage("");
              }}
              style={{
                background:
                  "linear-gradient(135deg, #0878e8, #1251c7)",
                border: "none",
                color: "#ffffff",
                padding: "12px 22px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* MESSAGE */}
        {message && (
          <div
            style={{
              background: message.includes("success")
                ? "#123d2b"
                : "#421d24",
              color: message.includes("success")
                ? "#35e89a"
                : "#ff8b98",
              padding: "14px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            {message}
          </div>
        )}

        {/* PROFILE CARD */}
        {profile && (
          <>
            {/* BASIC USER INFORMATION */}
            <div
              style={{
                background: "#102238",
                border: "1px solid #1E4E78",
                borderRadius: "14px",
                padding: "25px",
                marginBottom: "22px",
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  color: "#55b8ff",
                  fontSize: "20px",
                }}
              >
                Account Information
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "20px",
                  marginTop: "20px",
                }}
              >
                <div>
                  <label style={labelStyle}>
                    Name
                  </label>

                  <div style={{ color: "#ffffff" }}>
                    {profile.user?.name || "-"}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>
                    Email
                  </label>

                  <div style={{ color: "#ffffff" }}>
                    {profile.user?.email || "-"}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>
                    Mobile
                  </label>

                  <div style={{ color: "#ffffff" }}>
                    {profile.user?.mobile || "-"}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>
                    Role
                  </label>

                  <div
                    style={{
                      color: "#55b8ff",
                      textTransform: "capitalize",
                    }}
                  >
                    {profile.user?.role || "owner"}
                  </div>
                </div>
              </div>
            </div>

            {/* OWNER DETAILS */}
            <form onSubmit={handleSubmit}>
              <div
                style={{
                  background: "#102238",
                  border: "1px solid #1E4E78",
                  borderRadius: "14px",
                  padding: "25px",
                  marginBottom: "22px",
                }}
              >
                <h2
                  style={{
                    marginTop: 0,
                    color: "#55b8ff",
                    fontSize: "20px",
                  }}
                >
                  Owner Details
                </h2>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "20px",
                    marginTop: "20px",
                  }}
                >
                  <div>
                    <label style={labelStyle}>
                      WhatsApp Number
                    </label>

                    {editing ? (
                      <input
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        style={inputStyle}
                      />
                    ) : (
                      <div style={{ color: "#ffffff" }}>
                        {profile.whatsapp || "-"}
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={labelStyle}>
                      City
                    </label>

                    {editing ? (
                      <input
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        style={inputStyle}
                      />
                    ) : (
                      <div style={{ color: "#ffffff" }}>
                        {profile.city || "-"}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: "20px" }}>
                  <label style={labelStyle}>
                    Address
                  </label>

                  {editing ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="4"
                      style={{
                        ...inputStyle,
                        resize: "vertical",
                      }}
                    />
                  ) : (
                    <div style={{ color: "#ffffff" }}>
                      {profile.address || "-"}
                    </div>
                  )}
                </div>

                <div style={{ marginTop: "20px" }}>
                  <label style={labelStyle}>
                    Profile Photo
                  </label>

                  {editing ? (
                    <input
                      name="profilePhoto"
                      value={formData.profilePhoto}
                      onChange={handleChange}
                      placeholder="Profile photo URL"
                      style={inputStyle}
                    />
                  ) : (
                    <div
                      style={{
                        color: "#ffffff",
                        wordBreak: "break-word",
                      }}
                    >
                      {profile.profilePhoto || "Not added"}
                    </div>
                  )}
                </div>

                <div style={{ marginTop: "20px" }}>
                  <label style={labelStyle}>
                    ID Document
                  </label>

                  {editing ? (
                    <input
                      name="idDocument"
                      value={formData.idDocument}
                      onChange={handleChange}
                      placeholder="ID document URL"
                      style={inputStyle}
                    />
                  ) : (
                    <div
                      style={{
                        color: "#ffffff",
                        wordBreak: "break-word",
                      }}
                    >
                      {profile.idDocument || "Not added"}
                    </div>
                  )}
                </div>
              </div>

              {/* VERIFICATION */}
              <div
                style={{
                  background: "#102238",
                  border: "1px solid #1E4E78",
                  borderRadius: "14px",
                  padding: "25px",
                  marginBottom: "22px",
                }}
              >
                <h2
                  style={{
                    marginTop: 0,
                    color: "#55b8ff",
                    fontSize: "20px",
                  }}
                >
                  Verification
                </h2>

                <div
                  style={{
                    marginTop: "18px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <span
                    style={{
                      ...getStatusStyle(
                        profile.verificationStatus
                      ),
                      padding: "8px 15px",
                      borderRadius: "20px",
                      fontWeight: "600",
                    }}
                  >
                    {profile.verificationStatus}
                  </span>
                </div>

                <p
                  style={{
                    color: "#8ea3ba",
                    marginTop: "15px",
                    marginBottom: 0,
                  }}
                >
                  Your verification status is controlled
                  by the administrator.
                </p>
              </div>

              {/* EDIT BUTTONS */}
              {editing && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "12px",
                    paddingBottom: "30px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setMessage("");
                    }}
                    style={{
                      background: "#17283b",
                      border: "1px solid #1E4E78",
                      color: "#ffffff",
                      padding: "12px 22px",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    style={{
                      background:
                        "linear-gradient(135deg, #0878e8, #1251c7)",
                      border: "none",
                      color: "#ffffff",
                      padding: "12px 25px",
                      borderRadius: "8px",
                      cursor: saving
                        ? "not-allowed"
                        : "pointer",
                      fontWeight: "600",
                      opacity: saving ? 0.7 : 1,
                    }}
                  >
                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default OwnerProfile;