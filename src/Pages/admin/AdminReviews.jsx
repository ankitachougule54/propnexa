import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:9000/reviews/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReviews(response.data.reviews || []);
    } catch (err) {
      console.error("Fetch reviews error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load reviews."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApprove = async (reviewId) => {
    try {
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.put(
        `http://localhost:9000/reviews/admin/approve/${reviewId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message ||
          "Review approved successfully."
      );

      fetchReviews();
    } catch (err) {
      console.error("Approve review error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to approve review."
      );
    }
  };

  const handleReject = async (reviewId) => {
    try {
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.put(
        `http://localhost:9000/reviews/admin/reject/${reviewId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message ||
          "Review rejected successfully."
      );

      fetchReviews();
    } catch (err) {
      console.error("Reject review error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to reject review."
      );
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <h2>Loading reviews...</h2>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              Reviews & Ratings
            </h1>

            <p style={styles.subtitle}>
              Review customer feedback and approve or reject submissions.
            </p>
          </div>

          <button
            style={styles.refreshButton}
            onClick={fetchReviews}
          >
            ↻ Refresh
          </button>
        </div>

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

        {reviews.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>
              ⭐
            </div>

            <h2>
              No reviews found
            </h2>

            <p>
              Customer reviews will appear here after they are submitted.
            </p>
          </div>
        ) : (
          <div style={styles.reviewList}>

            {reviews.map((review) => (
              <div
                key={review._id}
                style={styles.reviewCard}
              >

                <div style={styles.reviewTop}>

                  <div>
                    <h3 style={styles.customerName}>
                      {review.customer?.name ||
                        "Unknown Customer"}
                    </h3>

                    <p style={styles.customerInfo}>
                      {review.customer?.email || "-"}
                    </p>

                    <p style={styles.customerInfo}>
                      {review.customer?.mobile || "-"}
                    </p>
                  </div>

                  <div style={styles.ratingBox}>
                    <div style={styles.stars}>
                      {"⭐".repeat(review.rating)}
                    </div>

                    <span style={styles.ratingText}>
                      {review.rating}/5
                    </span>
                  </div>

                </div>

                <div style={styles.propertyBox}>

                  <p style={styles.propertyLabel}>
                    Property
                  </p>

                  <h3 style={styles.propertyTitle}>
                    {review.property?.title ||
                      "Property unavailable"}
                  </h3>

                  <p style={styles.propertyDetails}>
                    {review.property?.propertyType || "-"}
                    {" • "}
                    {review.property?.listingType || "-"}
                    {" • "}
                    {review.property?.city || "-"}
                  </p>

                </div>

                <div style={styles.commentBox}>

                  <p style={styles.commentLabel}>
                    Customer Review
                  </p>

                  <p style={styles.comment}>
                    "{review.comment}"
                  </p>

                </div>

                <div style={styles.bottomRow}>

                  <div>
                    <span style={styles.statusLabel}>
                      Status:
                    </span>

                    <span
                      style={{
                        ...styles.status,
                        ...(review.status === "Approved"
                          ? styles.approved
                          : review.status === "Rejected"
                          ? styles.rejected
                          : styles.pending),
                      }}
                    >
                      {review.status}
                    </span>
                  </div>

                  <div style={styles.actions}>

                    {review.status === "Pending" && (
                      <>
                        <button
                          style={styles.approveButton}
                          onClick={() =>
                            handleApprove(review._id)
                          }
                        >
                          ✓ Approve
                        </button>

                        <button
                          style={styles.rejectButton}
                          onClick={() =>
                            handleReject(review._id)
                          }
                        >
                          ✕ Reject
                        </button>
                      </>
                    )}

                  </div>

                </div>

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
    padding: "40px 20px 80px",
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "30px",
  },

  title: {
    margin: "0 0 8px",
    fontSize: "30px",
  },

  subtitle: {
    margin: 0,
    color: "#8fa4b8",
    fontSize: "14px",
  },

  refreshButton: {
    padding: "11px 18px",
    border: "1px solid #1E4E78",
    borderRadius: "7px",
    backgroundColor: "#102238",
    color: "#33c1ff",
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

  empty: {
    backgroundColor: "#102238",
    border: "1px solid #1E4E78",
    borderRadius: "10px",
    padding: "60px 20px",
    textAlign: "center",
  },

  emptyIcon: {
    fontSize: "45px",
    marginBottom: "15px",
  },

  reviewList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  reviewCard: {
    backgroundColor: "#102238",
    border: "1px solid #1E4E78",
    borderRadius: "10px",
    padding: "25px",
  },

  reviewTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
  },

  customerName: {
    margin: "0 0 6px",
    fontSize: "18px",
  },

  customerInfo: {
    margin: "3px 0",
    color: "#8fa4b8",
    fontSize: "13px",
  },

  ratingBox: {
    textAlign: "right",
  },

  stars: {
    fontSize: "18px",
    marginBottom: "5px",
  },

  ratingText: {
    color: "#33c1ff",
    fontSize: "13px",
    fontWeight: "600",
  },

  propertyBox: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#0b1f36",
    borderRadius: "7px",
    border: "1px solid #1E4E78",
  },

  propertyLabel: {
    margin: "0 0 5px",
    color: "#7f91a5",
    fontSize: "12px",
  },

  propertyTitle: {
    margin: "0 0 6px",
    fontSize: "16px",
  },

  propertyDetails: {
    margin: 0,
    color: "#8fa4b8",
    fontSize: "13px",
  },

  commentBox: {
    marginTop: "20px",
  },

  commentLabel: {
    margin: "0 0 7px",
    color: "#7f91a5",
    fontSize: "12px",
  },

  comment: {
    margin: 0,
    color: "#d8e3ed",
    lineHeight: "1.7",
    fontSize: "14px",
  },

  bottomRow: {
    marginTop: "20px",
    paddingTop: "15px",
    borderTop: "1px solid #1E4E78",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
  },

  statusLabel: {
    color: "#8fa4b8",
    fontSize: "13px",
    marginRight: "8px",
  },

  status: {
    padding: "5px 10px",
    borderRadius: "5px",
    fontSize: "12px",
    fontWeight: "600",
  },

  pending: {
    backgroundColor: "#5a4615",
    color: "#ffd166",
  },

  approved: {
    backgroundColor: "#164d35",
    color: "#7dffb2",
  },

  rejected: {
    backgroundColor: "#4d1c1c",
    color: "#ff8d8d",
  },

  actions: {
    display: "flex",
    gap: "10px",
  },

  approveButton: {
    padding: "9px 15px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#0878e8",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "600",
  },

  rejectButton: {
    padding: "9px 15px",
    border: "1px solid #ff6b6b",
    borderRadius: "6px",
    backgroundColor: "transparent",
    color: "#ff8d8d",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default AdminReviews;