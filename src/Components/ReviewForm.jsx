import React, { useState } from "react";
import axios from "axios";

const ReviewForm = ({ propertyId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!comment.trim()) {
      setError("Please write a comment.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login as a customer first.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:9000/reviews",
        {
          property: propertyId,
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message ||
          "Review submitted successfully. Waiting for admin approval."
      );

      setComment("");
      setRating(5);

      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to submit review."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Write a Review</h2>

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

      <form onSubmit={handleSubmit}>
        <label style={styles.label}>
          Rating
        </label>

        <select
          value={rating}
          onChange={(e) =>
            setRating(Number(e.target.value))
          }
          style={styles.input}
        >
          <option value={5}>⭐⭐⭐⭐⭐ — 5</option>
          <option value={4}>⭐⭐⭐⭐ — 4</option>
          <option value={3}>⭐⭐⭐ — 3</option>
          <option value={2}>⭐⭐ — 2</option>
          <option value={1}>⭐ — 1</option>
        </select>

        <label style={styles.label}>
          Comment
        </label>

        <textarea
          value={comment}
          onChange={(e) =>
            setComment(e.target.value)
          }
          placeholder="Write your experience..."
          rows="5"
          style={styles.textarea}
        />

        <button
          type="submit"
          disabled={loading}
          style={styles.button}
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    background: "#102238",
    padding: "25px",
    borderRadius: "12px",
    marginTop: "25px",
  },

  heading: {
    color: "#ffffff",
    marginBottom: "20px",
  },

  label: {
    display: "block",
    color: "#ffffff",
    marginBottom: "8px",
    marginTop: "15px",
    fontWeight: "600",
  },

  input: {
    width: "100%",
    padding: "12px",
    boxSizing: "border-box",
    background: "#0b1f36",
    color: "#ffffff",
    border: "1px solid #35516d",
    borderRadius: "8px",
  },

  textarea: {
    width: "100%",
    padding: "12px",
    boxSizing: "border-box",
    background: "#0b1f36",
    color: "#ffffff",
    border: "1px solid #35516d",
    borderRadius: "8px",
    resize: "vertical",
  },

  button: {
    marginTop: "20px",
    padding: "12px 22px",
    background: "#0878e8",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  success: {
    background: "#164d35",
    color: "#7dffb2",
    padding: "10px",
    borderRadius: "7px",
    marginBottom: "15px",
  },

  error: {
    background: "#4d1c1c",
    color: "#ff8d8d",
    padding: "10px",
    borderRadius: "7px",
    marginBottom: "15px",
  },
};

export default ReviewForm;