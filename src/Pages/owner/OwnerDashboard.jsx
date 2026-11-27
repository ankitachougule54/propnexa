import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function OwnerDashboard() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOwnerProfile();
  }, []);

  const fetchOwnerProfile = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9000/owner-profiles/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfile(response.data.ownerProfile);
    } catch (error) {
      console.error("Owner profile error:", error);

      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        Loading Owner Dashboard...
      </div>
    );
  }

  return (
    <div style={styles.page}>

      {/* SIDEBAR */}
      <aside style={styles.sidebar}>

        <div style={styles.logo}>
          Prop<span style={styles.logoNexa}>Nexa</span>
        </div>

        <div style={styles.role}>
          OWNER PANEL
        </div>

        <button
          style={styles.activeMenu}
          onClick={() => navigate("/owner/dashboard")}
        >
          Dashboard
        </button>

        <button
          style={styles.menu}
          onClick={() => navigate("/owner/properties")}
        >
          My Properties
        </button>

        <button
          style={styles.menu}
          onClick={() => navigate("/owner/properties/add")}
        >
          Add Property
        </button>

        <button
          style={styles.menu}
          onClick={() => navigate("/owner/profile")}
        >
          My Profile
        </button>

        <button
          style={styles.menu}
          onClick={() => navigate("/provider/enquiries")}
        >
          Enquiries
        </button>

        <button
          style={styles.logout}
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
          }}
        >
          Logout
        </button>

      </aside>


      {/* MAIN CONTENT */}
      <main style={styles.main}>

        <div style={styles.header}>
          <div>
            <h1 style={styles.heading}>
              Owner Dashboard
            </h1>

            <p style={styles.subtitle}>
              Manage your properties and enquiries
            </p>
          </div>

          <div style={styles.userBox}>
            <div style={styles.avatar}>
              {profile?.user?.name?.charAt(0)?.toUpperCase() || "O"}
            </div>

            <div>
              <div style={styles.userName}>
                {profile?.user?.name || "Owner"}
              </div>

              <div style={styles.userRole}>
                Property Owner
              </div>
            </div>
          </div>
        </div>


        {/* PROFILE CARD */}
        <div style={styles.profileCard}>

          <div>
            <h2 style={styles.profileTitle}>
              Welcome, {profile?.user?.name || "Owner"} 👋
            </h2>

            <p style={styles.profileText}>
              {profile?.city || "Your City"}
            </p>

            <p style={styles.profileText}>
              {profile?.user?.email || "Email"}
            </p>
          </div>

          <div
            style={{
              ...styles.status,
              backgroundColor:
                profile?.verificationStatus === "Verified"
                  ? "#123f2b"
                  : profile?.verificationStatus === "Rejected"
                  ? "#4a2020"
                  : "#4a3b16",
            }}
          >
            {profile?.verificationStatus || "Pending"}
          </div>

        </div>


        {/* DASHBOARD CARDS */}
        <div style={styles.cards}>

          <div
            style={styles.card}
            onClick={() => navigate("/owner/properties")}
          >
            <div style={styles.cardIcon}>🏠</div>

            <h3 style={styles.cardTitle}>
              My Properties
            </h3>

            <p style={styles.cardText}>
              View and manage your property listings.
            </p>

            <button style={styles.cardButton}>
              View Properties
            </button>
          </div>


          <div
            style={styles.card}
            onClick={() => navigate("/owner/properties/add")}
          >
            <div style={styles.cardIcon}>＋</div>

            <h3 style={styles.cardTitle}>
              Add Property
            </h3>

            <p style={styles.cardText}>
              Create a new property listing.
            </p>

            <button style={styles.cardButton}>
              Add Property
            </button>
          </div>


          <div
  style={styles.card}
  onClick={() => navigate("/owner/enquiries")}
>
  <div style={styles.cardIcon}>💬</div>

  <h3 style={styles.cardTitle}>
    Enquiries
  </h3>

  <p style={styles.cardText}>
    Manage customer enquiries for your properties.
  </p>

  <button
    style={styles.cardButton}
    onClick={(e) => {
      e.stopPropagation();
      navigate("/owner/enquiries");
    }}
  >
    View Enquiries
  </button>
</div>

          <div
            style={styles.card}
            onClick={() => navigate("/owner/profile")}
          >
            <div style={styles.cardIcon}>👤</div>

            <h3 style={styles.cardTitle}>
              My Profile
            </h3>

            <p style={styles.cardText}>
              View and update your owner profile.
            </p>

            <button style={styles.cardButton}>
              View Profile
            </button>
          </div>

        </div>

      </main>

    </div>
  );
}


const styles = {

  page: {
    minHeight: "100vh",
    backgroundColor: "#071525",
    color: "#ffffff",
    display: "flex",
  },

  sidebar: {
    width: "240px",
    minHeight: "100vh",
    backgroundColor: "#0b1f36",
    borderRight: "1px solid #1E4E78",
    padding: "30px 20px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
  },

  logo: {
    color: "#ff5733",
    fontSize: "27px",
    fontWeight: "700",
    marginBottom: "8px",
  },

  logoNexa: {
    color: "#33c1ff",
  },

  role: {
    color: "#7f9bb5",
    fontSize: "11px",
    letterSpacing: "1.5px",
    marginBottom: "30px",
  },

  menu: {
    width: "100%",
    background: "transparent",
    border: "none",
    color: "#c5d4e3",
    textAlign: "left",
    padding: "13px 15px",
    borderRadius: "7px",
    marginBottom: "7px",
    cursor: "pointer",
    fontSize: "14px",
  },

  activeMenu: {
    width: "100%",
    background: "linear-gradient(135deg, #0878e8, #1251c7)",
    border: "none",
    color: "#ffffff",
    textAlign: "left",
    padding: "13px 15px",
    borderRadius: "7px",
    marginBottom: "7px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },

  logout: {
    width: "100%",
    background: "#162c43",
    border: "1px solid #1E4E78",
    color: "#ff8b75",
    textAlign: "left",
    padding: "13px 15px",
    borderRadius: "7px",
    marginTop: "auto",
    cursor: "pointer",
    fontSize: "14px",
  },

  main: {
    flex: 1,
    padding: "40px 45px",
    boxSizing: "border-box",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  heading: {
    margin: 0,
    fontSize: "30px",
    fontWeight: "700",
  },

  subtitle: {
    color: "#8da5bc",
    marginTop: "8px",
    fontSize: "14px",
  },

  userBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    backgroundColor: "#102238",
    padding: "10px 16px",
    borderRadius: "10px",
    border: "1px solid #1E4E78",
  },

  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0878e8, #1251c7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
  },

  userName: {
    fontSize: "14px",
    fontWeight: "600",
  },

  userRole: {
    color: "#8da5bc",
    fontSize: "11px",
    marginTop: "3px",
  },

  profileCard: {
    backgroundColor: "#102238",
    border: "1px solid #1E4E78",
    borderRadius: "12px",
    padding: "25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  profileTitle: {
    margin: "0 0 8px",
    fontSize: "20px",
  },

  profileText: {
    margin: "5px 0",
    color: "#9bb0c5",
    fontSize: "13px",
  },

  status: {
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
  },

  card: {
    backgroundColor: "#102238",
    border: "1px solid #1E4E78",
    borderRadius: "12px",
    padding: "25px",
    cursor: "pointer",
    transition: "0.2s",
  },

  cardIcon: {
    fontSize: "28px",
    marginBottom: "15px",
  },

  cardTitle: {
    margin: "0 0 8px",
    fontSize: "18px",
  },

  cardText: {
    color: "#8da5bc",
    fontSize: "13px",
    lineHeight: "1.6",
    minHeight: "42px",
  },

  cardButton: {
    marginTop: "15px",
    background: "linear-gradient(135deg, #0878e8, #1251c7)",
    border: "none",
    color: "#ffffff",
    padding: "9px 15px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
  },

  loading: {
    minHeight: "100vh",
    backgroundColor: "#071525",
    color: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "18px",
  },
};

export default OwnerDashboard;