import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReviewForm from "../../Components/ReviewForm";

function PropertyDetails() {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState("");

  const [showEnquiry, setShowEnquiry] = useState(false);
  const [message, setMessage] = useState("");
  const [enquiryLoading, setEnquiryLoading] = useState(false);
  const [enquiryMessage, setEnquiryMessage] = useState("");

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistMessage, setWishlistMessage] = useState("");

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState("");

  // ===============================
  // FETCH PROPERTY
  // ===============================

  useEffect(() => {
    if (!id) {
      setError("Invalid property ID");
      setLoading(false);
      return;
    }

    fetchProperty();
    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      setReviewsError("");

      const response = await axios.get(
        `http://localhost:9000/reviews/property/${id}`
      );

      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviewsError("Failed to load reviews.");
    } finally {
      setReviewsLoading(false);
    }
  };

  const fetchProperty = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `http://localhost:9000/properties/${id}`
      );

      const fetchedProperty = response.data.property;

      setProperty(fetchedProperty);

      const images = fetchedProperty.images || [];

      if (images.length > 0) {
        setSelectedImage(images[0]);
      } else {
        setSelectedImage(
          "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=80"
        );
      }

      // ===============================
      // FETCH SIMILAR PROPERTIES
      // ===============================

      try {
        const similarResponse = await axios.get(
          `http://localhost:9000/properties?city=${encodeURIComponent(
            fetchedProperty.city || ""
          )}&propertyType=${encodeURIComponent(
            fetchedProperty.propertyType || ""
          )}`
        );

        const similar = (similarResponse.data.properties || [])
          .filter((item) => item._id !== fetchedProperty._id)
          .slice(0, 4);

        setSimilarProperties(similar);
      } catch (similarError) {
        console.error(
          "Error fetching similar properties:",
          similarError
        );

        setSimilarProperties([]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching property:", error);

      setError("Failed to load property details");
      setLoading(false);
    }
  };

  // ===============================
  // SEND ENQUIRY
  // ===============================

  const handleSendEnquiry = async () => {
    if (!message.trim()) {
      setEnquiryMessage("Please enter a message.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setEnquiryMessage(
        "Please login as a customer to send an enquiry."
      );
      return;
    }

    try {
      setEnquiryLoading(true);
      setEnquiryMessage("");

      const response = await axios.post(
        "http://localhost:9000/enquiries",
        {
          property: property._id,
          message: message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Enquiry response:", response.data);

      setEnquiryMessage("Enquiry sent successfully! ✓");
      setMessage("");

      setTimeout(() => {
        setShowEnquiry(false);
        setEnquiryMessage("");
      }, 1500);
    } catch (error) {
      console.error("Error sending enquiry:", error);

      setEnquiryMessage(
        error.response?.data?.message ||
          "Failed to send enquiry."
      );
    } finally {
      setEnquiryLoading(false);
    }
  };

  // ===============================
  // ADD TO WISHLIST
  // ===============================

  const handleWishlist = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setWishlistMessage(
        "Please login as a customer to save this property."
      );
      return;
    }

    try {
      setWishlistLoading(true);
      setWishlistMessage("");

      const response = await axios.post(
        "http://localhost:9000/wishlist",
        {
          property: property._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Wishlist response:", response.data);

      setIsWishlisted(true);
      setWishlistMessage("Property saved to wishlist! ♥");
    } catch (error) {
      console.error("Error adding to wishlist:", error);

      setWishlistMessage(
        error.response?.data?.message ||
          "Failed to add property to wishlist."
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  // ===============================
  // SHARE PROPERTY
  // ===============================

  const handleShare = async () => {
    const shareData = {
      title: property?.title || "PropNexa Property",
      text: `Check out this property on PropNexa: ${
        property?.title || "Property"
      }`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        alert("Property link copied!");
      } else {
        alert("Copy this page URL to share the property.");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Share failed:", error);
      }
    }
  };

  // ===============================
  // LOADING
  // ===============================

  if (loading) {
    return (
      <div style={styles.message}>
        Loading property details...
      </div>
    );
  }

  // ===============================
  // ERROR
  // ===============================

  if (error) {
    return (
      <div style={styles.error}>
        {error}
      </div>
    );
  }

  if (!property) {
    return (
      <div style={styles.error}>
        Property not found
      </div>
    );
  }

  return (
    <div style={styles.page}>

      {/* ===============================
          GALLERY
      =============================== */}

      <div style={styles.galleryContainer}>

        <div style={styles.mainImageWrapper}>
          <img
            src={selectedImage}
            alt={property.title}
            style={styles.mainGalleryImage}
          />
        </div>

        {property.images &&
          property.images.length > 0 && (
            <div style={styles.thumbnailContainer}>

              {property.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  style={{
                    ...styles.thumbnailButton,
                    ...(selectedImage === image
                      ? styles.activeThumbnail
                      : {}),
                  }}
                >
                  <img
                    src={image}
                    alt={`${property.title} ${index + 1}`}
                    style={styles.thumbnailImage}
                  />
                </button>
              ))}

            </div>
          )}

      </div>

      {/* ===============================
          MAIN CONTENT
      =============================== */}

      <div style={styles.container}>

        {/* LEFT */}

        <div style={styles.mainContent}>

          <span style={styles.badge}>
            {property.listingType}
          </span>

          <h1 style={styles.title}>
            {property.title}
          </h1>

          <p style={styles.location}>
            📍 {property.address}, {property.city},{" "}
            {property.state}
          </p>

          {/* PRICE */}

          <div style={styles.priceBox}>

            <p style={styles.priceLabel}>
              Price
            </p>

            <h2 style={styles.price}>
              {property.listingType === "Rent"
                ? `₹${property.monthlyRent || 0}/month`
                : `₹${property.expectedPrice || 0}`}
            </h2>

          </div>

          {/* PROPERTY INFORMATION */}

          <div style={styles.infoBox}>

            <h2 style={styles.sectionTitle}>
              Property Information
            </h2>

            <div style={styles.infoGrid}>

              <div>
                <span style={styles.label}>
                  Property Type
                </span>

                <strong style={styles.value}>
                  {property.propertyType}
                </strong>
              </div>

              <div>
                <span style={styles.label}>
                  BHK
                </span>

                <strong style={styles.value}>
                  {property.bhk || "-"}
                </strong>
              </div>

              <div>
                <span style={styles.label}>
                  Bedrooms
                </span>

                <strong style={styles.value}>
                  {property.bedrooms || "-"}
                </strong>
              </div>

              <div>
                <span style={styles.label}>
                  Bathrooms
                </span>

                <strong style={styles.value}>
                  {property.bathrooms || "-"}
                </strong>
              </div>

              <div>
                <span style={styles.label}>
                  Built-up Area
                </span>

                <strong style={styles.value}>
                  {property.builtUpArea || "-"}{" "}
                  {property.areaUnit || ""}
                </strong>
              </div>

              <div>
                <span style={styles.label}>
                  Furnishing
                </span>

                <strong style={styles.value}>
                  {property.furnishing || "-"}
                </strong>
              </div>

            </div>

          </div>

          {/* DESCRIPTION */}

          <div style={styles.infoBox}>

            <h2 style={styles.sectionTitle}>
              Description
            </h2>

            <p style={styles.description}>
              {property.description ||
                "No description available."}
            </p>

          </div>

          {/* AMENITIES */}

          <div style={styles.infoBox}>

            <h2 style={styles.sectionTitle}>
              Amenities
            </h2>

            <div style={styles.amenities}>

              {property.amenities &&
              property.amenities.length > 0 ? (
                property.amenities.map(
                  (amenity, index) => (
                    <span
                      key={index}
                      style={styles.amenity}
                    >
                      ✓ {amenity}
                    </span>
                  )
                )
              ) : (
                <span style={styles.noData}>
                  No amenities listed.
                </span>
              )}

            </div>

          </div>

          {/* ===============================
              REVIEWS & RATINGS
          =============================== */}

          <div style={styles.infoBox}>

            <h2 style={styles.sectionTitle}>
              Reviews & Ratings
            </h2>

            {reviewsLoading ? (
              <p style={styles.noData}>
                Loading reviews...
              </p>
            ) : reviewsError ? (
              <p style={styles.reviewError}>
                {reviewsError}
              </p>
            ) : reviews.length === 0 ? (
              <p style={styles.noData}>
                No approved reviews yet.
              </p>
            ) : (
              <div style={styles.reviewList}>

                {reviews.map((review) => (
                  <div
                    key={review._id}
                    style={styles.reviewCard}
                  >

                    <div style={styles.reviewHeader}>

                      <strong style={styles.reviewCustomer}>
                        {review.customer?.name || "Customer"}
                      </strong>

                      <span style={styles.reviewRating}>
                        {"⭐".repeat(review.rating)}
                      </span>

                    </div>

                    <p style={styles.reviewComment}>
                      {review.comment}
                    </p>

                    <span style={styles.reviewDate}>
                      {new Date(
                        review.createdAt
                      ).toLocaleDateString()}
                    </span>

                  </div>
                ))}

              </div>
            )}

            {/* WRITE REVIEW */}

            {localStorage.getItem("token") && (
              <ReviewForm
                propertyId={property._id}
                onReviewSubmitted={fetchReviews}
              />
            )}

          </div>

        </div>

        {/* ===============================
            RIGHT SIDEBAR
        =============================== */}

        <div style={styles.sidebar}>

          <h2 style={styles.sidebarTitle}>
            Interested in this property?
          </h2>

          {/* CONTACT OWNER */}

          <button
            style={styles.primaryButton}
            onClick={() => {
              if (property.owner?.mobile) {
                window.location.href =
                  `tel:${property.owner.mobile}`;
              } else {
                alert(
                  "Owner mobile number is not available."
                );
              }
            }}
          >
            📞 Contact Owner
          </button>

          {/* WHATSAPP */}

          <button
            style={styles.whatsappButton}
            onClick={() => {
              if (property.owner?.mobile) {

                let phoneNumber =
                  property.owner.mobile.replace(
                    /\D/g,
                    ""
                  );

                if (phoneNumber.length === 10) {
                  phoneNumber = `91${phoneNumber}`;
                }

                const whatsappMessage =
                  encodeURIComponent(
                    `Hello, I am interested in your property "${property.title}".`
                  );

                window.open(
                  `https://wa.me/${phoneNumber}?text=${whatsappMessage}`,
                  "_blank"
                );
              } else {
                alert(
                  "Owner WhatsApp number is not available."
                );
              }
            }}
          >
            💬 WhatsApp
          </button>

          {/* SEND ENQUIRY */}

          <button
            style={styles.enquiryButton}
            onClick={() => {
              setShowEnquiry(!showEnquiry);
              setEnquiryMessage("");
            }}
          >
            Send Enquiry
          </button>

          {/* ENQUIRY FORM */}

          {showEnquiry && (
            <div style={styles.enquiryBox}>

              <h3 style={styles.enquiryTitle}>
                Send Your Enquiry
              </h3>

              <textarea
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                placeholder="Write your message..."
                style={styles.textarea}
                rows="5"
              />

              {enquiryMessage && (
                <p style={styles.enquiryMessage}>
                  {enquiryMessage}
                </p>
              )}

              <button
                style={styles.sendButton}
                onClick={handleSendEnquiry}
                disabled={enquiryLoading}
              >
                {enquiryLoading
                  ? "Sending..."
                  : "Send Enquiry"}
              </button>

            </div>
          )}

          {/* SAVE PROPERTY */}

          <button
            style={{
              ...styles.saveButton,
              ...(isWishlisted
                ? styles.savedButton
                : {}),
            }}
            onClick={handleWishlist}
            disabled={
              wishlistLoading || isWishlisted
            }
          >
            {wishlistLoading
              ? "Saving..."
              : isWishlisted
              ? "♥ Saved to Wishlist"
              : "♡ Save Property"}
          </button>

          {/* WISHLIST MESSAGE */}

          {wishlistMessage && (
            <p style={styles.wishlistMessage}>
              {wishlistMessage}
            </p>
          )}

          {/* SHARE */}

          <button
            style={styles.shareButton}
            onClick={handleShare}
          >
            ↗ Share Property
          </button>

          {/* PROVIDER DETAILS */}

          <div style={styles.providerBox}>

            <h3 style={styles.providerTitle}>
              Property Listed By
            </h3>

            <div style={styles.providerIcon}>
              👤
            </div>

            <h4 style={styles.providerName}>
              {property.owner?.name ||
                "Property Owner"}
            </h4>

            <p style={styles.providerRole}>
              {property.owner?.role
                ? property.owner.role
                    .charAt(0)
                    .toUpperCase() +
                  property.owner.role.slice(1)
                : "Owner"}
            </p>

            {property.owner?.mobile && (
              <p style={styles.providerContact}>
                📞 {property.owner.mobile}
              </p>
            )}

            {property.owner?.email && (
              <p style={styles.providerContact}>
                ✉️ {property.owner.email}
              </p>
            )}

          </div>

        </div>

      </div>

      {/* ===============================
          SIMILAR PROPERTIES
      =============================== */}

      {similarProperties.length > 0 && (
        <div style={styles.similarSection}>

          <h2 style={styles.similarTitle}>
            Similar Properties
          </h2>

          <p style={styles.similarSubtitle}>
            Properties you may also be interested in
          </p>

          <div style={styles.similarGrid}>

            {similarProperties.map((item) => (
              <div
                key={item._id}
                style={styles.similarCard}
              >

                <div style={styles.similarImageWrapper}>

                  <img
                    src={
                      item.images?.length > 0
                        ? item.images[0]
                        : "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80"
                    }
                    alt={item.title}
                    style={styles.similarImage}
                  />

                  <span style={styles.similarBadge}>
                    {item.listingType}
                  </span>

                </div>

                <div style={styles.similarContent}>

                  <h3 style={styles.similarCardTitle}>
                    {item.title}
                  </h3>

                  <p style={styles.similarLocation}>
                    📍 {item.city}, {item.state}
                  </p>

                  <div style={styles.similarInfo}>

                    <span>
                      🏠 {item.propertyType}
                    </span>

                    {item.bhk && (
                      <span>
                        🛏 {item.bhk} BHK
                      </span>
                    )}

                    {item.builtUpArea && (
                      <span>
                        📐 {item.builtUpArea}{" "}
                        {item.areaUnit}
                      </span>
                    )}

                  </div>

                  <h3 style={styles.similarPrice}>
                    {item.listingType === "Rent"
                      ? `₹${item.monthlyRent || 0}/month`
                      : `₹${item.expectedPrice || 0}`}
                  </h3>

                  <button
                    style={styles.viewSimilarButton}
                    onClick={() => {
                      window.location.href =
                        `/properties/${item._id}`;
                    }}
                  >
                    View Property →
                  </button>

                </div>

              </div>
            ))}

          </div>

        </div>
      )}

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

  galleryContainer: {
    width: "100%",
    backgroundColor: "#071525",
    paddingBottom: "10px",
  },

  mainImageWrapper: {
    width: "100%",
    height: "450px",
    overflow: "hidden",
    backgroundColor: "#102238",
  },

  mainGalleryImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  thumbnailContainer: {
    maxWidth: "1200px",
    margin: "15px auto 0",
    padding: "0 20px",
    display: "flex",
    gap: "12px",
    overflowX: "auto",
  },

  thumbnailButton: {
    width: "90px",
    height: "65px",
    padding: "0",
    flexShrink: 0,
    border: "2px solid #1E4E78",
    borderRadius: "6px",
    backgroundColor: "#102238",
    cursor: "pointer",
    overflow: "hidden",
  },

  activeThumbnail: {
    border: "2px solid #33c1ff",
  },

  thumbnailImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  container: {
    maxWidth: "1200px",
    margin: "40px auto",
    padding: "0 20px",
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "30px",
  },

  mainContent: {
    minWidth: 0,
  },

  badge: {
    display: "inline-block",
    background:
      "linear-gradient(135deg, #0878e8, #1251c7)",
    padding: "7px 14px",
    borderRadius: "5px",
    fontSize: "12px",
    fontWeight: "600",
  },

  title: {
    fontSize: "38px",
    margin: "15px 0 8px",
  },

  location: {
    color: "#9db0c2",
    fontSize: "15px",
  },

  priceBox: {
    marginTop: "25px",
    padding: "20px",
    backgroundColor: "#102238",
    border: "1px solid #1E4E78",
    borderRadius: "10px",
  },

  priceLabel: {
    color: "#8fa4b8",
    margin: "0",
    fontSize: "13px",
  },

  price: {
    color: "#33c1ff",
    margin: "5px 0 0",
    fontSize: "30px",
  },

  infoBox: {
    marginTop: "25px",
    padding: "25px",
    backgroundColor: "#102238",
    border: "1px solid #1E4E78",
    borderRadius: "10px",
  },

  sectionTitle: {
    fontSize: "21px",
    marginTop: 0,
    marginBottom: "20px",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "25px",
  },

  label: {
    display: "block",
    color: "#7f91a5",
    fontSize: "12px",
    marginBottom: "6px",
  },

  value: {
    color: "#ffffff",
    fontSize: "14px",
  },

  description: {
    color: "#c4cfda",
    lineHeight: "1.8",
    fontSize: "15px",
  },

  amenities: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
  },

  amenity: {
    backgroundColor: "#0b1f36",
    border: "1px solid #1E4E78",
    padding: "10px 14px",
    borderRadius: "6px",
    color: "#d8e3ed",
    fontSize: "13px",
  },

  noData: {
    color: "#7f91a5",
    fontSize: "14px",
  },

  reviewList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  reviewCard: {
    padding: "16px",
    backgroundColor: "#0b1f36",
    border: "1px solid #1E4E78",
    borderRadius: "8px",
  },

  reviewHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap",
  },

  reviewCustomer: {
    color: "#ffffff",
    fontSize: "15px",
  },

  reviewRating: {
    color: "#ffd166",
    fontSize: "14px",
  },

  reviewComment: {
    color: "#c4cfda",
    lineHeight: "1.7",
    margin: "10px 0",
  },

  reviewDate: {
    color: "#7f91a5",
    fontSize: "12px",
  },

  reviewError: {
    color: "#ff8d8d",
    fontSize: "14px",
  },

  sidebar: {
    backgroundColor: "#102238",
    border: "1px solid #1E4E78",
    borderRadius: "10px",
    padding: "25px",
    height: "fit-content",
    position: "sticky",
    top: "20px",
  },

  sidebarTitle: {
    fontSize: "20px",
    marginTop: 0,
    marginBottom: "20px",
  },

  primaryButton: {
    width: "100%",
    padding: "13px",
    marginBottom: "12px",
    border: "none",
    borderRadius: "6px",
    background:
      "linear-gradient(135deg, #0878e8, #1251c7)",
    color: "#ffffff",
    fontWeight: "600",
    cursor: "pointer",
  },

  whatsappButton: {
    width: "100%",
    padding: "13px",
    marginBottom: "12px",
    border: "1px solid #1E4E78",
    borderRadius: "6px",
    backgroundColor: "#0b1f36",
    color: "#ffffff",
    cursor: "pointer",
  },

  enquiryButton: {
    width: "100%",
    padding: "13px",
    marginBottom: "12px",
    border: "1px solid #33c1ff",
    borderRadius: "6px",
    backgroundColor: "transparent",
    color: "#33c1ff",
    cursor: "pointer",
  },

  enquiryBox: {
    marginBottom: "15px",
    padding: "18px",
    backgroundColor: "#0b1f36",
    border: "1px solid #1E4E78",
    borderRadius: "8px",
  },

  enquiryTitle: {
    fontSize: "17px",
    marginTop: 0,
    marginBottom: "15px",
    color: "#ffffff",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #1E4E78",
    backgroundColor: "#071525",
    color: "#ffffff",
    outline: "none",
    resize: "vertical",
    fontSize: "14px",
    marginBottom: "10px",
  },

  enquiryMessage: {
    color: "#33c1ff",
    fontSize: "13px",
    margin: "5px 0 12px",
  },

  sendButton: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    background:
      "linear-gradient(135deg, #0878e8, #1251c7)",
    color: "#ffffff",
    fontWeight: "600",
    cursor: "pointer",
  },

  saveButton: {
    width: "100%",
    padding: "13px",
    border: "1px solid #1E4E78",
    borderRadius: "6px",
    backgroundColor: "transparent",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "14px",
  },

  savedButton: {
    border: "1px solid #33c1ff",
    color: "#33c1ff",
    backgroundColor: "#0b1f36",
  },

  wishlistMessage: {
    color: "#33c1ff",
    fontSize: "13px",
    textAlign: "center",
    marginTop: "10px",
    marginBottom: 0,
  },

  shareButton: {
    width: "100%",
    padding: "13px",
    marginTop: "12px",
    border: "1px solid #1E4E78",
    borderRadius: "6px",
    backgroundColor: "#0b1f36",
    color: "#33c1ff",
    cursor: "pointer",
    fontSize: "14px",
  },

  providerBox: {
    marginTop: "20px",
    padding: "20px",
    backgroundColor: "#0b1f36",
    border: "1px solid #1E4E78",
    borderRadius: "8px",
    textAlign: "center",
  },

  providerTitle: {
    marginTop: 0,
    marginBottom: "18px",
    fontSize: "16px",
    color: "#ffffff",
  },

  providerIcon: {
    width: "60px",
    height: "60px",
    margin: "0 auto 12px",
    borderRadius: "50%",
    backgroundColor: "#102238",
    border: "1px solid #1E4E78",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "25px",
  },

  providerName: {
    margin: "0 0 5px",
    fontSize: "17px",
    color: "#ffffff",
  },

  providerRole: {
    margin: "0 0 15px",
    color: "#33c1ff",
    fontSize: "13px",
    textTransform: "capitalize",
  },

  providerContact: {
    margin: "8px 0",
    color: "#b9c8d6",
    fontSize: "13px",
    wordBreak: "break-word",
  },

  similarSection: {
    maxWidth: "1200px",
    margin: "60px auto 0",
    padding: "0 20px",
  },

  similarTitle: {
    margin: "0",
    fontSize: "28px",
    color: "#ffffff",
  },

  similarSubtitle: {
    margin: "8px 0 25px",
    color: "#8fa4b8",
    fontSize: "14px",
  },

  similarGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
  },

  similarCard: {
    backgroundColor: "#102238",
    border: "1px solid #1E4E78",
    borderRadius: "10px",
    overflow: "hidden",
  },

  similarImageWrapper: {
    position: "relative",
    height: "180px",
    backgroundColor: "#0b1f36",
  },

  similarImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  similarBadge: {
    position: "absolute",
    top: "12px",
    left: "12px",
    padding: "6px 10px",
    borderRadius: "5px",
    background:
      "linear-gradient(135deg, #0878e8, #1251c7)",
    color: "#ffffff",
    fontSize: "11px",
    fontWeight: "600",
  },

  similarContent: {
    padding: "16px",
  },

  similarCardTitle: {
    margin: "0 0 8px",
    fontSize: "17px",
    color: "#ffffff",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  similarLocation: {
    margin: "0 0 12px",
    color: "#8fa4b8",
    fontSize: "12px",
  },

  similarInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    color: "#b9c8d6",
    fontSize: "12px",
  },

  similarPrice: {
    margin: "15px 0",
    color: "#33c1ff",
    fontSize: "18px",
  },

  viewSimilarButton: {
    width: "100%",
    padding: "10px",
    border: "1px solid #1E4E78",
    borderRadius: "6px",
    backgroundColor: "#0b1f36",
    color: "#33c1ff",
    cursor: "pointer",
    fontSize: "13px",
  },

  message: {
    minHeight: "100vh",
    backgroundColor: "#071525",
    color: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  error: {
    minHeight: "100vh",
    backgroundColor: "#071525",
    color: "#ff6b6b",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

export default PropertyDetails;