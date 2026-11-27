import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Wishlist() {
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===============================
  // GET MY WISHLIST
  // ===============================

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login as a customer to view your wishlist.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "http://localhost:9000/wishlist",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Wishlist response:", response.data);

      setWishlist(response.data.wishlist || []);
      setLoading(false);

    } catch (error) {
      console.error("Error fetching wishlist:", error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to load wishlist.");
      }

      setLoading(false);
    }
  };

  // ===============================
  // REMOVE FROM WISHLIST
  // ===============================

  const handleRemove = async (wishlistId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:9000/wishlist/${wishlistId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove from UI immediately
      setWishlist((previousWishlist) =>
        previousWishlist.filter(
          (item) => item._id !== wishlistId
        )
      );

    } catch (error) {
      console.error(
        "Error removing wishlist item:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to remove property from wishlist."
      );
    }
  };

  // ===============================
  // LOADING
  // ===============================

  if (loading) {
    return (
      <div style={styles.message}>
        Loading your wishlist...
      </div>
    );
  }

  // ===============================
  // ERROR
  // ===============================

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.errorBox}>
          {error}
        </div>
      </div>
    );
  }

  // ===============================
  // EMPTY WISHLIST
  // ===============================

  if (wishlist.length === 0) {
    return (
      <div style={styles.page}>
        <div style={styles.emptyBox}>

          <div style={styles.emptyIcon}>
            ♡
          </div>

          <h1 style={styles.emptyTitle}>
            Your Wishlist is Empty
          </h1>

          <p style={styles.emptyText}>
            Save properties you like and find them here later.
          </p>

          <button
            style={styles.browseButton}
            onClick={() => navigate("/properties")}
          >
            Browse Properties
          </button>

        </div>
      </div>
    );
  }

  // ===============================
  // WISHLIST UI
  // ===============================

  return (
    <div style={styles.page}>

      <div style={styles.header}>

        <h1 style={styles.heading}>
          My Wishlist
        </h1>

        <p style={styles.subHeading}>
          Properties you have saved
        </p>

      </div>

      <div style={styles.container}>

        <div style={styles.resultHeader}>
          <h2 style={styles.resultTitle}>
            {wishlist.length} Saved{" "}
            {wishlist.length === 1
              ? "Property"
              : "Properties"}
          </h2>
        </div>

        <div style={styles.grid}>

          {wishlist.map((item) => {

            const property = item.property;

            if (!property) {
              return null;
            }

            return (
              <div
                key={item._id}
                style={styles.card}
              >

                {/* Property Image */}
                <div style={styles.imageBox}>

                  <img
                    src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80"
                    alt={property.title}
                    style={styles.image}
                  />

                  <span style={styles.badge}>
                    {property.listingType}
                  </span>

                </div>

                {/* Property Content */}
                <div style={styles.content}>

                  <h3 style={styles.title}>
                    {property.title}
                  </h3>

                  <p style={styles.location}>
                    📍 {property.city},{" "}
                    {property.state}
                  </p>

                  <div style={styles.info}>

                    <span>
                      🏠 {property.propertyType}
                    </span>

                    <span>
                      💰{" "}
                      {property.listingType === "Rent"
                        ? `₹${property.monthlyRent || 0}/month`
                        : `₹${property.expectedPrice || 0}`}
                    </span>

                  </div>

                  <div style={styles.actions}>

                    <button
                      style={styles.viewButton}
                      onClick={() =>
                        navigate(
                          `/properties/${property._id}`
                        )
                      }
                    >
                      View Details
                    </button>

                    <button
                      style={styles.removeButton}
                      onClick={() =>
                        handleRemove(item._id)
                      }
                    >
                      ♥ Remove
                    </button>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

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
    padding: "60px 20px 35px",
    textAlign: "center",
    backgroundColor: "#0b1f36",
    borderBottom: "1px solid #1E4E78",
  },

  heading: {
    fontSize: "40px",
    margin: "0 0 10px",
    fontWeight: "700",
  },

  subHeading: {
    color: "#9eafc1",
    fontSize: "16px",
    margin: 0,
  },

  container: {
    maxWidth: "1150px",
    margin: "35px auto",
    padding: "0 20px",
  },

  resultHeader: {
    marginBottom: "20px",
  },

  resultTitle: {
    fontSize: "23px",
    margin: 0,
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: "25px",
  },

  card: {
    backgroundColor: "#102238",
    border: "1px solid #1E4E78",
    borderRadius: "10px",
    overflow: "hidden",
  },

  imageBox: {
    height: "220px",
    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  badge: {
    position: "absolute",
    top: "15px",
    left: "15px",
    background:
      "linear-gradient(135deg, #0878e8, #1251c7)",
    padding: "7px 12px",
    borderRadius: "5px",
    fontSize: "12px",
    fontWeight: "600",
  },

  content: {
    padding: "20px",
  },

  title: {
    fontSize: "19px",
    margin: "0 0 8px",
  },

  location: {
    color: "#9db0c2",
    fontSize: "13px",
    marginBottom: "15px",
  },

  info: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    color: "#c4cfda",
    fontSize: "13px",
    marginBottom: "20px",
  },

  actions: {
    display: "flex",
    gap: "10px",
  },

  viewButton: {
    flex: 1,
    padding: "11px",
    border: "none",
    borderRadius: "6px",
    background:
      "linear-gradient(135deg, #0878e8, #1251c7)",
    color: "#ffffff",
    fontWeight: "600",
    cursor: "pointer",
  },

  removeButton: {
    flex: 1,
    padding: "11px",
    border: "1px solid #1E4E78",
    borderRadius: "6px",
    backgroundColor: "transparent",
    color: "#ffffff",
    cursor: "pointer",
  },

  emptyBox: {
    maxWidth: "600px",
    margin: "120px auto",
    padding: "50px 25px",
    textAlign: "center",
    backgroundColor: "#102238",
    border: "1px solid #1E4E78",
    borderRadius: "12px",
  },

  emptyIcon: {
    fontSize: "70px",
    color: "#33c1ff",
    marginBottom: "15px",
  },

  emptyTitle: {
    fontSize: "28px",
    margin: "0 0 10px",
  },

  emptyText: {
    color: "#9eafc1",
    marginBottom: "25px",
  },

  browseButton: {
    padding: "13px 25px",
    border: "none",
    borderRadius: "6px",
    background:
      "linear-gradient(135deg, #0878e8, #1251c7)",
    color: "#ffffff",
    fontWeight: "600",
    cursor: "pointer",
  },

  message: {
    minHeight: "100vh",
    backgroundColor: "#071525",
    color: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "18px",
  },

  errorBox: {
    maxWidth: "600px",
    margin: "100px auto",
    padding: "25px",
    textAlign: "center",
    color: "#ff7b7b",
    backgroundColor: "#2a1520",
    border: "1px solid #6b2635",
    borderRadius: "10px",
  },
};

export default Wishlist;