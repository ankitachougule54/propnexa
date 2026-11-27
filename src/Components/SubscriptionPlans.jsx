import React, { useEffect, useState } from "react";
import axios from "axios";

const SubscriptionPlans = () => {
  const [packages, setPackages] = useState([]);
  const [subscription, setSubscription] = useState(null);

  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // ==========================================
  // FETCH ACTIVE PACKAGES
  // ==========================================

  const fetchPackages = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9000/packages/active"
      );

      setPackages(response.data.packages || []);
    } catch (err) {
      console.error("Fetch packages error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load packages."
      );
    }
  };

  // ==========================================
  // FETCH MY SUBSCRIPTION
  // ==========================================

  const fetchSubscription = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9000/subscriptions/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSubscription(response.data.subscription);
    } catch (err) {
      // 404 simply means no subscription yet
      if (err.response?.status !== 404) {
        console.error(
          "Fetch subscription error:",
          err
        );
      }
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await fetchPackages();

      if (token) {
        await fetchSubscription();
      }

      setLoading(false);
    };

    loadData();
  }, []);

  // ==========================================
  // SUBSCRIBE
  // ==========================================

  const handleSubscribe = async (packageId) => {
    if (!token) {
      setError(
        "Please login before subscribing."
      );
      return;
    }

    const confirmSubscribe = window.confirm(
      "Do you want to subscribe to this package?"
    );

    if (!confirmSubscribe) {
      return;
    }

    try {
      setSubscribing(true);
      setMessage("");
      setError("");

      const response = await axios.post(
        "http://localhost:9000/subscriptions",
        {
          packageId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message ||
          "Subscription created successfully."
      );

      setSubscription(
        response.data.subscription
      );
    } catch (err) {
      console.error(
        "Subscribe error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to subscribe."
      );
    } finally {
      setSubscribing(false);
    }
  };

  // ==========================================
  // CANCEL SUBSCRIPTION
  // ==========================================

  const handleCancel = async () => {
    if (!subscription?._id) {
      return;
    }

    const confirmCancel = window.confirm(
      "Are you sure you want to cancel your subscription?"
    );

    if (!confirmCancel) {
      return;
    }

    try {
      setMessage("");
      setError("");

      const response = await axios.put(
        `http://localhost:9000/subscriptions/cancel/${subscription._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message ||
          "Subscription cancelled."
      );

      setSubscription(
        response.data.subscription
      );
    } catch (err) {
      console.error(
        "Cancel subscription error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to cancel subscription."
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div style={styles.loading}>
        Loading subscription plans...
      </div>
    );
  }

  return (
    <div style={styles.page}>

      <div style={styles.container}>

        {/* =====================================
            HEADER
        ====================================== */}

        <div style={styles.header}>

          <h1 style={styles.heading}>
            Subscription Plans
          </h1>

          <p style={styles.subtitle}>
            Choose a package to manage and promote
            your property listings.
          </p>

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
            CURRENT SUBSCRIPTION
        ====================================== */}

        {subscription && (
          <div style={styles.currentBox}>

            <div>
              <h2 style={styles.currentTitle}>
                Current Subscription
              </h2>

              <p style={styles.currentPackage}>
                {subscription.package?.packageName ||
                  "Package"}
              </p>

              <p style={styles.currentText}>
                Status:{" "}
                <strong>
                  {subscription.status}
                </strong>
              </p>

              <p style={styles.currentText}>
                Expires:{" "}
                {new Date(
                  subscription.expiryDate
                ).toLocaleDateString()}
              </p>
            </div>

            <div style={styles.usageBox}>

              <div>
                Listings
              </div>

              <strong>
                {subscription.listingsUsed} /{" "}
                {subscription.listingLimit}
              </strong>

              <div style={styles.progressBackground}>
                <div
                  style={{
                    ...styles.progress,
                    width: `${
                      subscription.listingLimit
                        ? Math.min(
                            100,
                            (subscription.listingsUsed /
                              subscription.listingLimit) *
                              100
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>

            </div>

            {subscription.status ===
              "Active" && (
              <button
                style={styles.cancelButton}
                onClick={handleCancel}
              >
                Cancel Subscription
              </button>
            )}

          </div>
        )}

        {/* =====================================
            PACKAGES
        ====================================== */}

        {packages.length === 0 ? (
          <div style={styles.empty}>
            No active packages available.
          </div>
        ) : (
          <div style={styles.packageGrid}>

            {packages.map((packageData) => (
              <div
                key={packageData._id}
                style={styles.card}
              >

                <h2 style={styles.packageName}>
                  {packageData.packageName}
                </h2>

                <p style={styles.description}>
                  {packageData.description ||
                    "Property provider package"}
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
                    ✓{" "}
                    {packageData.listingLimit}{" "}
                    Property Listings
                  </div>

                  <div style={styles.feature}>
                    ✓{" "}
                    {packageData.featuredListingLimit}{" "}
                    Featured Listings
                  </div>

                </div>

                <button
                  style={styles.subscribeButton}
                  disabled={
                    subscribing ||
                    subscription?.status ===
                      "Active"
                  }
                  onClick={() =>
                    handleSubscribe(
                      packageData._id
                    )
                  }
                >
                  {subscription?.status ===
                  "Active"
                    ? "Already Subscribed"
                    : subscribing
                    ? "Processing..."
                    : "Subscribe"}
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
    backgroundColor: "#071525",
    color: "#ffffff",
    padding: "40px 20px",
    boxSizing: "border-box",
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },

  header: {
    textAlign: "center",
    marginBottom: "40px",
  },

  heading: {
    margin: "0 0 10px",
    fontSize: "32px",
  },

  subtitle: {
    margin: 0,
    color: "#8fa4b8",
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

  currentBox: {
    backgroundColor: "#102238",
    border: "1px solid #1E4E78",
    borderRadius: "10px",
    padding: "25px",
    marginBottom: "35px",
    display: "grid",
    gridTemplateColumns:
      "2fr 1fr auto",
    alignItems: "center",
    gap: "25px",
  },

  currentTitle: {
    margin: "0 0 8px",
    fontSize: "20px",
  },

  currentPackage: {
    color: "#33c1ff",
    fontSize: "18px",
    fontWeight: "600",
    margin: "5px 0",
  },

  currentText: {
    color: "#b8c7d6",
    fontSize: "13px",
    margin: "5px 0",
  },

  usageBox: {
    color: "#d8e3ed",
    fontSize: "13px",
  },

  progressBackground: {
    height: "7px",
    backgroundColor: "#071525",
    borderRadius: "10px",
    marginTop: "8px",
    overflow: "hidden",
  },

  progress: {
    height: "100%",
    backgroundColor: "#33c1ff",
    borderRadius: "10px",
  },

  cancelButton: {
    padding: "10px 15px",
    border: "1px solid #b52b36",
    borderRadius: "6px",
    backgroundColor: "transparent",
    color: "#ff8d8d",
    cursor: "pointer",
  },

  packageGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "25px",
  },

  card: {
    backgroundColor: "#102238",
    border: "1px solid #1E4E78",
    borderRadius: "10px",
    padding: "30px",
    textAlign: "center",
  },

  packageName: {
    margin: "0 0 10px",
    fontSize: "23px",
  },

  description: {
    color: "#8fa4b8",
    fontSize: "13px",
    minHeight: "40px",
  },

  price: {
    color: "#33c1ff",
    fontSize: "32px",
    fontWeight: "700",
    margin: "20px 0 5px",
  },

  duration: {
    color: "#b8c7d6",
    fontSize: "13px",
  },

  features: {
    borderTop: "1px solid #1E4E78",
    borderBottom: "1px solid #1E4E78",
    padding: "18px 0",
    margin: "20px 0",
  },

  feature: {
    color: "#d8e3ed",
    fontSize: "14px",
    marginBottom: "10px",
  },

  subscribeButton: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "7px",
    background:
      "linear-gradient(135deg, #0878e8, #1251c7)",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "600",
  },

  empty: {
    textAlign: "center",
    padding: "50px",
    backgroundColor: "#102238",
    borderRadius: "10px",
    color: "#8fa4b8",
  },

  loading: {
    minHeight: "100vh",
    backgroundColor: "#071525",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default SubscriptionPlans;