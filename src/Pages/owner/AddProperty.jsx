import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddProperty() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    propertyType: "Apartment",
    listingType: "Sell",
    description: "",

    state: "",
    district: "",
    city: "",
    area: "",
    landmark: "",
    address: "",

    bhk: "",
    bedrooms: "",
    bathrooms: "",
    balconies: "",
    floor: "",
    totalFloors: "",
    furnishing: "Unfurnished",

    builtUpArea: "",
    carpetArea: "",
    plotArea: "",
    areaUnit: "sq.ft",

    expectedPrice: "",
    negotiable: false,
    monthlyRent: "",
    securityDeposit: "",
    maintenance: "",
    bookingAmount: "",

    amenities: [],
  });

  const [amenityInput, setAmenityInput] = useState("");
  const [bannerImage, setBannerImage] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const amenitiesList = [
    "Parking",
    "Lift",
    "Security",
    "Garden",
    "Gym",
    "Swimming Pool",
    "Power Backup",
    "Water Supply",
  ];

  /* =========================
     FORM CHANGE
  ========================= */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* =========================
     AMENITIES
  ========================= */

  const toggleAmenity = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((item) => item !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const addCustomAmenity = () => {
    const value = amenityInput.trim();

    if (!value) return;

    if (!formData.amenities.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, value],
      }));
    }

    setAmenityInput("");
  };

  /* =========================
     IMAGE UPLOAD
  ========================= */

  const handleBannerImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setError("");
    setMessage("");

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    const maxFileSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setError("Banner image: Only JPG, JPEG, PNG and WEBP images are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > maxFileSize) {
      setError("Banner image: Image size must be less than 5 MB.");
      e.target.value = "";
      return;
    }

    if (bannerImage?.preview) {
      URL.revokeObjectURL(bannerImage.preview);
    }

    setBannerImage({
      file,
      preview: URL.createObjectURL(file),
    });

    e.target.value = "";
  };

  const removeBannerImage = () => {
    if (bannerImage?.preview) {
      URL.revokeObjectURL(bannerImage.preview);
    }

    setBannerImage(null);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    setError("");
    setMessage("");

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    const maxFileSize = 5 * 1024 * 1024;

    const validFiles = [];
    const invalidFiles = [];

    files.forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        invalidFiles.push(
          `${file.name}: Only JPG, JPEG, PNG and WEBP images are allowed.`
        );
        return;
      }

      if (file.size > maxFileSize) {
        invalidFiles.push(
          `${file.name}: Image size must be less than 5 MB.`
        );
        return;
      }

      validFiles.push(file);
    });

    setSelectedImages((prev) => {
      const remainingSlots = 10 - prev.length;

      if (remainingSlots <= 0) {
        return prev;
      }

      const filesToAdd = validFiles.slice(0, remainingSlots);

      const newImages = filesToAdd.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      return [...prev, ...newImages];
    });

    if (invalidFiles.length > 0) {
      setError(invalidFiles.join(" "));
    }

    if (
      validFiles.length > 0 &&
      selectedImages.length + validFiles.length > 10
    ) {
      setError("You can upload a maximum of 10 images.");
    }

    e.target.value = "";
  };

  const removeImage = (index) => {
    setSelectedImages((prev) => {
      const imageToRemove = prev[index];

      if (imageToRemove?.preview) {
        URL.revokeObjectURL(imageToRemove.preview);
      }

      return prev.filter((_, i) => i !== index);
    });
  };

  /* =========================
     CLEAN IMAGE PREVIEWS
  ========================= */

  useEffect(() => {
    return () => {
      selectedImages.forEach((image) => {
        if (image.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, [selectedImages]);

  /* =========================
     SUBMIT PROPERTY
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login as an owner first.");
        setLoading(false);
        return;
      }

      /*
        FormData is required because
        we are sending images + property data.
      */

      const formDataToSend = new FormData();

      /* =========================
         BASIC INFORMATION
      ========================= */

      formDataToSend.append("title", formData.title);
      formDataToSend.append(
        "propertyType",
        formData.propertyType
      );
      formDataToSend.append(
        "listingType",
        formData.listingType
      );
      formDataToSend.append(
        "description",
        formData.description
      );

      /* =========================
         LOCATION
      ========================= */

      formDataToSend.append("state", formData.state);
      formDataToSend.append(
        "district",
        formData.district
      );
      formDataToSend.append("city", formData.city);
      formDataToSend.append("area", formData.area);
      formDataToSend.append(
        "landmark",
        formData.landmark
      );
      formDataToSend.append(
        "address",
        formData.address
      );

      /* =========================
         PROPERTY DETAILS
      ========================= */

      if (formData.bhk !== "") {
        formDataToSend.append(
          "bhk",
          formData.bhk
        );
      }

      if (formData.bedrooms !== "") {
        formDataToSend.append(
          "bedrooms",
          formData.bedrooms
        );
      }

      if (formData.bathrooms !== "") {
        formDataToSend.append(
          "bathrooms",
          formData.bathrooms
        );
      }

      if (formData.balconies !== "") {
        formDataToSend.append(
          "balconies",
          formData.balconies
        );
      }

      if (formData.floor !== "") {
        formDataToSend.append(
          "floor",
          formData.floor
        );
      }

      if (formData.totalFloors !== "") {
        formDataToSend.append(
          "totalFloors",
          formData.totalFloors
        );
      }

      formDataToSend.append(
        "furnishing",
        formData.furnishing
      );

      /* =========================
         AREA DETAILS
      ========================= */

      if (formData.builtUpArea !== "") {
        formDataToSend.append(
          "builtUpArea",
          formData.builtUpArea
        );
      }

      if (formData.carpetArea !== "") {
        formDataToSend.append(
          "carpetArea",
          formData.carpetArea
        );
      }

      if (formData.plotArea !== "") {
        formDataToSend.append(
          "plotArea",
          formData.plotArea
        );
      }

      formDataToSend.append(
        "areaUnit",
        formData.areaUnit
      );

      /* =========================
         PRICING
      ========================= */

      if (formData.expectedPrice !== "") {
        formDataToSend.append(
          "expectedPrice",
          formData.expectedPrice
        );
      }

      formDataToSend.append(
        "negotiable",
        String(formData.negotiable)
      );

      if (formData.monthlyRent !== "") {
        formDataToSend.append(
          "monthlyRent",
          formData.monthlyRent
        );
      }

      if (formData.securityDeposit !== "") {
        formDataToSend.append(
          "securityDeposit",
          formData.securityDeposit
        );
      }

      if (formData.maintenance !== "") {
        formDataToSend.append(
          "maintenance",
          formData.maintenance
        );
      }

      if (formData.bookingAmount !== "") {
        formDataToSend.append(
          "bookingAmount",
          formData.bookingAmount
        );
      }

      /* =========================
         AMENITIES
      ========================= */

      formData.amenities.forEach((amenity) => {
        formDataToSend.append(
          "amenities",
          amenity
        );
      });

      /* =========================
         BANNER IMAGE
      ========================= */

      if (bannerImage) {
        formDataToSend.append("bannerImage", bannerImage.file);
      }

      /* =========================
         GALLERY IMAGES
      ========================= */

      selectedImages.forEach((imageObject) => {
        formDataToSend.append(
          "images",
          imageObject.file
        );
      });

      /* =========================
         API REQUEST
      ========================= */

      const response = await axios.post(
        "http://localhost:9000/properties",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message ||
          "Property created successfully."
      );

      /* =========================
         RESET FORM
      ========================= */

      setFormData({
        title: "",
        propertyType: "Apartment",
        listingType: "Sell",
        description: "",

        state: "",
        district: "",
        city: "",
        area: "",
        landmark: "",
        address: "",

        bhk: "",
        bedrooms: "",
        bathrooms: "",
        balconies: "",
        floor: "",
        totalFloors: "",
        furnishing: "Unfurnished",

        builtUpArea: "",
        carpetArea: "",
        plotArea: "",
        areaUnit: "sq.ft",

        expectedPrice: "",
        negotiable: false,
        monthlyRent: "",
        securityDeposit: "",
        maintenance: "",
        bookingAmount: "",

        amenities: [],
      });

      setAmenityInput("");

      if (bannerImage?.preview) {
        URL.revokeObjectURL(bannerImage.preview);
      }

      setBannerImage(null);

      selectedImages.forEach((imageObject) => {
        if (imageObject.preview) {
          URL.revokeObjectURL(imageObject.preview);
        }
      });

      setSelectedImages([]);
    } catch (err) {
      console.error("Create property error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to create property."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     JSX
  ========================= */

  return (
    <div style={styles.page}>

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside style={styles.sidebar}>

        <div style={styles.logo}>
          Prop
          <span style={styles.logoNexa}>
            Nexa
          </span>
        </div>

        <div style={styles.role}>
          OWNER PANEL
        </div>

        <button
          style={styles.menu}
          onClick={() =>
            navigate("/owner/dashboard")
          }
        >
          Dashboard
        </button>

        <button
          style={styles.menu}
          onClick={() =>
            navigate("/owner/properties")
          }
        >
          My Properties
        </button>

        <button
          style={styles.activeMenu}
        >
          Add Property
        </button>

        <button
          style={styles.menu}
          onClick={() =>
            navigate("/owner/profile")
          }
        >
          My Profile
        </button>

        <button
          style={styles.menu}
          onClick={() =>
            navigate("/owner/enquiries")
          }
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


      {/* =========================
          MAIN
      ========================= */}

      <main style={styles.main}>

        {/* HEADER */}

        <div style={styles.header}>

          <div>
            <h1 style={styles.heading}>
              Add New Property
            </h1>

            <p style={styles.subtitle}>
              Submit your property for admin approval
            </p>
          </div>

          <button
            style={styles.backButton}
            onClick={() =>
              navigate("/owner/dashboard")
            }
          >
            ← Dashboard
          </button>

        </div>


        {/* SUCCESS MESSAGE */}

        {message && (
          <div style={styles.success}>
            ✓ {message}

            <br />

            <span style={styles.successSmall}>
              Your property is now waiting for admin approval.
            </span>
          </div>
        )}


        {/* ERROR MESSAGE */}

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}


        {/* FORM */}

        <form onSubmit={handleSubmit}>

          {/* =========================
              BASIC INFORMATION
          ========================= */}

          <section style={styles.section}>

            <h2 style={styles.sectionTitle}>
              1. Basic Information
            </h2>

            <div style={styles.grid}>

              <div style={styles.full}>

                <label style={styles.label}>
                  Property Title *
                </label>

                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Example: 2 BHK Premium Apartment"
                  required
                  style={styles.input}
                />

              </div>


              <div>

                <label style={styles.label}>
                  Property Type *
                </label>

                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option>Apartment</option>
                  <option>Flat</option>
                  <option>Villa</option>
                  <option>House</option>
                  <option>Plot</option>
                  <option>Farmhouse</option>
                  <option>Shop</option>
                  <option>Office</option>
                  <option>Warehouse</option>
                  <option>Industrial Land</option>
                </select>

              </div>


              <div>

                <label style={styles.label}>
                  Listing Type *
                </label>

                <select
                  name="listingType"
                  value={formData.listingType}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option>Sell</option>
                  <option>Rent</option>
                  <option>Lease</option>
                </select>

              </div>


              <div style={styles.full}>

                <label style={styles.label}>
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your property..."
                  rows="5"
                  style={styles.textarea}
                />

              </div>

            </div>

          </section>


          {/* =========================
              PROPERTY IMAGES
          ========================= */}

          <section style={styles.section}>

            <h2 style={styles.sectionTitle}>
              2. Property Images
            </h2>

            {/* BANNER IMAGE */}

            <div style={styles.bannerSection}>

              <div style={styles.imageHeader}>

                <div>
                  <h3 style={styles.imageSubTitle}>
                    Banner Image
                  </h3>

                  <p style={styles.imageHint}>
                    This image will be used as the main front/card image
                    of your property. JPG, JPEG, PNG and WEBP only.
                    Maximum 5 MB.
                  </p>
                </div>

                <div style={styles.bannerBadge}>
                  1 image
                </div>

              </div>

              {!bannerImage ? (
                <label style={styles.bannerUploadBox}>

                  <span style={styles.uploadIcon}>
                    +
                  </span>

                  <span style={styles.uploadText}>
                    Choose Banner Image
                  </span>

                  <span style={styles.uploadSubText}>
                    Select one main property image
                  </span>

                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleBannerImageChange}
                    style={styles.hiddenFileInput}
                  />

                </label>
              ) : (
                <div style={styles.bannerPreviewCard}>

                  <img
                    src={bannerImage.preview}
                    alt="Property Banner"
                    style={styles.bannerPreviewImage}
                  />

                  <div style={styles.bannerOverlay}>

                    <span style={styles.bannerLabel}>
                      Main Banner Image
                    </span>

                    <button
                      type="button"
                      onClick={removeBannerImage}
                      style={styles.removeImageButton}
                    >
                      ×
                    </button>

                  </div>

                </div>
              )}

            </div>

            {/* GALLERY IMAGES */}

            <div style={styles.gallerySection}>

              <div style={styles.imageHeader}>

                <div>

                  <h3 style={styles.imageSubTitle}>
                    Gallery Images
                  </h3>

                  <p style={styles.imageHint}>
                    Upload 1–10 additional property images.
                    These are separate from the banner image.
                    JPG, JPEG, PNG and WEBP only. Maximum 5 MB per image.
                  </p>

                </div>

                <div style={styles.imageCount}>
                  {selectedImages.length}/10
                </div>

              </div>

              <label style={styles.uploadBox}>

                <span style={styles.uploadIcon}>
                  +
                </span>

                <span style={styles.uploadText}>
                  Choose Gallery Images
                </span>

                <span style={styles.uploadSubText}>
                  You can select multiple images
                </span>

                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  multiple
                  onChange={handleImageChange}
                  style={styles.hiddenFileInput}
                />

              </label>

              {selectedImages.length > 0 && (

                <div style={styles.imageGrid}>

                  {selectedImages.map(
                    (imageObject, index) => (

                      <div
                        key={
                          imageObject.file.name +
                          imageObject.file.lastModified +
                          index
                        }
                        style={styles.imagePreviewCard}
                      >

                        <img
                          src={imageObject.preview}
                          alt={`Gallery ${index + 1}`}
                          style={styles.previewImage}
                        />

                        <div style={styles.imageOverlay}>

                          <span style={styles.imageNumber}>
                            Gallery {index + 1}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              removeImage(index)
                            }
                            style={styles.removeImageButton}
                          >
                            ×
                          </button>

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

          </section>


          {/* =========================
              LOCATION
          ========================= */}

          <section style={styles.section}>

            <h2 style={styles.sectionTitle}>
              3. Location
            </h2>

            <div style={styles.grid}>

              <div>

                <label style={styles.label}>
                  State
                </label>

                <input
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Karnataka"
                  style={styles.input}
                />

              </div>


              <div>

                <label style={styles.label}>
                  District
                </label>

                <input
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="Belagavi"
                  style={styles.input}
                />

              </div>


              <div>

                <label style={styles.label}>
                  City
                </label>

                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Belagavi"
                  style={styles.input}
                />

              </div>


              <div>

                <label style={styles.label}>
                  Area
                </label>

                <input
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="Tilakwadi"
                  style={styles.input}
                />

              </div>


              <div>

                <label style={styles.label}>
                  Landmark
                </label>

                <input
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                  placeholder="Near Main Road"
                  style={styles.input}
                />

              </div>


              <div style={styles.full}>

                <label style={styles.label}>
                  Full Address
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter complete property address"
                  rows="3"
                  style={styles.textarea}
                />

              </div>

            </div>

          </section>


          {/* =========================
              PROPERTY DETAILS
          ========================= */}

          <section style={styles.section}>

            <h2 style={styles.sectionTitle}>
              4. Property Details
            </h2>

            <div style={styles.grid}>

              <div>

                <label style={styles.label}>
                  BHK
                </label>

                <input
                  type="number"
                  name="bhk"
                  value={formData.bhk}
                  onChange={handleChange}
                  min="0"
                  style={styles.input}
                />

              </div>


              <div>

                <label style={styles.label}>
                  Bedrooms
                </label>

                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  min="0"
                  style={styles.input}
                />

              </div>


              <div>

                <label style={styles.label}>
                  Bathrooms
                </label>

                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  min="0"
                  style={styles.input}
                />

              </div>


              <div>

                <label style={styles.label}>
                  Balconies
                </label>

                <input
                  type="number"
                  name="balconies"
                  value={formData.balconies}
                  onChange={handleChange}
                  min="0"
                  style={styles.input}
                />

              </div>


              <div>

                <label style={styles.label}>
                  Floor
                </label>

                <input
                  type="number"
                  name="floor"
                  value={formData.floor}
                  onChange={handleChange}
                  min="0"
                  style={styles.input}
                />

              </div>


              <div>

                <label style={styles.label}>
                  Total Floors
                </label>

                <input
                  type="number"
                  name="totalFloors"
                  value={formData.totalFloors}
                  onChange={handleChange}
                  min="0"
                  style={styles.input}
                />

              </div>


              <div>

                <label style={styles.label}>
                  Furnishing
                </label>

                <select
                  name="furnishing"
                  value={formData.furnishing}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option>Unfurnished</option>
                  <option>Semi-Furnished</option>
                  <option>Fully Furnished</option>
                </select>

              </div>

            </div>

          </section>


          {/* =========================
              AREA DETAILS
          ========================= */}

          <section style={styles.section}>

            <h2 style={styles.sectionTitle}>
              5. Area Details
            </h2>

            <div style={styles.grid}>

              <div>

                <label style={styles.label}>
                  Built-up Area
                </label>

                <input
                  type="number"
                  name="builtUpArea"
                  value={formData.builtUpArea}
                  onChange={handleChange}
                  min="0"
                  style={styles.input}
                />

              </div>


              <div>

                <label style={styles.label}>
                  Carpet Area
                </label>

                <input
                  type="number"
                  name="carpetArea"
                  value={formData.carpetArea}
                  onChange={handleChange}
                  min="0"
                  style={styles.input}
                />

              </div>


              <div>

                <label style={styles.label}>
                  Plot Area
                </label>

                <input
                  type="number"
                  name="plotArea"
                  value={formData.plotArea}
                  onChange={handleChange}
                  min="0"
                  style={styles.input}
                />

              </div>


              <div>

                <label style={styles.label}>
                  Area Unit
                </label>

                <select
                  name="areaUnit"
                  value={formData.areaUnit}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="sq.ft">
                    sq.ft
                  </option>

                  <option value="sq.m">
                    sq.m
                  </option>

                  <option value="acre">
                    acre
                  </option>

                  <option value="cent">
                    cent
                  </option>
                </select>

              </div>

            </div>

          </section>


          {/* =========================
              PRICING
          ========================= */}

          <section style={styles.section}>

            <h2 style={styles.sectionTitle}>
              6. Pricing
            </h2>

            <div style={styles.grid}>

              <div>

                <label style={styles.label}>
                  Expected Price
                </label>

                <input
                  type="number"
                  name="expectedPrice"
                  value={formData.expectedPrice}
                  onChange={handleChange}
                  min="0"
                  placeholder="4500000"
                  style={styles.input}
                />

              </div>


              <div>

                <label style={styles.label}>
                  Monthly Rent
                </label>

                <input
                  type="number"
                  name="monthlyRent"
                  value={formData.monthlyRent}
                  onChange={handleChange}
                  min="0"
                  style={styles.input}
                />

              </div>


              <div>

                <label style={styles.label}>
                  Security Deposit
                </label>

                <input
                  type="number"
                  name="securityDeposit"
                  value={formData.securityDeposit}
                  onChange={handleChange}
                  min="0"
                  style={styles.input}
                />

              </div>


              <div>

                <label style={styles.label}>
                  Maintenance
                </label>

                <input
                  type="number"
                  name="maintenance"
                  value={formData.maintenance}
                  onChange={handleChange}
                  min="0"
                  style={styles.input}
                />

              </div>


              <div>

                <label style={styles.label}>
                  Booking Amount
                </label>

                <input
                  type="number"
                  name="bookingAmount"
                  value={formData.bookingAmount}
                  onChange={handleChange}
                  min="0"
                  style={styles.input}
                />

              </div>


              <div style={styles.checkboxBox}>

                <input
                  type="checkbox"
                  name="negotiable"
                  checked={formData.negotiable}
                  onChange={handleChange}
                  id="negotiable"
                />

                <label
                  htmlFor="negotiable"
                  style={styles.checkboxLabel}
                >
                  Price is negotiable
                </label>

              </div>

            </div>

          </section>


          {/* =========================
              AMENITIES
          ========================= */}

          <section style={styles.section}>

            <h2 style={styles.sectionTitle}>
              7. Amenities
            </h2>

            <div style={styles.amenities}>

              {amenitiesList.map((amenity) => (

                <button
                  type="button"
                  key={amenity}
                  onClick={() =>
                    toggleAmenity(amenity)
                  }
                  style={
                    formData.amenities.includes(
                      amenity
                    )
                      ? styles.amenityActive
                      : styles.amenity
                  }
                >

                  {formData.amenities.includes(
                    amenity
                  )
                    ? "✓ "
                    : ""}

                  {amenity}

                </button>

              ))}

            </div>


            <div style={styles.customAmenity}>

              <input
                value={amenityInput}
                onChange={(e) =>
                  setAmenityInput(
                    e.target.value
                  )
                }
                placeholder="Add custom amenity"
                style={styles.input}
              />

              <button
                type="button"
                onClick={addCustomAmenity}
                style={styles.addButton}
              >
                Add
              </button>

            </div>


            {formData.amenities.length > 0 && (

              <p style={styles.selectedText}>
                Selected:{" "}
                {formData.amenities.join(", ")}
              </p>

            )}

          </section>


          {/* =========================
              SUBMIT
          ========================= */}

          <div style={styles.submitArea}>

            <button
              type="button"
              style={styles.cancelButton}
              onClick={() =>
                navigate("/owner/dashboard")
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              style={styles.submitButton}
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Property"}
            </button>

          </div>

        </form>

      </main>

    </div>
  );
}


/* =====================================================
   STYLES
===================================================== */

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
    background:
      "linear-gradient(135deg, #0878e8, #1251c7)",
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
    maxWidth: "1200px",
    width: "100%",
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

  backButton: {
    background: "#102238",
    border: "1px solid #1E4E78",
    color: "#ffffff",
    padding: "10px 16px",
    borderRadius: "7px",
    cursor: "pointer",
  },

  section: {
    backgroundColor: "#102238",
    border: "1px solid #1E4E78",
    borderRadius: "12px",
    padding: "25px",
    marginBottom: "20px",
  },

  sectionTitle: {
    margin: "0 0 22px",
    fontSize: "19px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, 1fr)",
    gap: "18px",
  },

  full: {
    gridColumn: "1 / -1",
  },

  label: {
    display: "block",
    color: "#b9c9d8",
    fontSize: "13px",
    marginBottom: "7px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "#071525",
    border: "1px solid #1E4E78",
    color: "#ffffff",
    padding: "11px 12px",
    borderRadius: "6px",
    outline: "none",
    fontSize: "13px",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "#071525",
    border: "1px solid #1E4E78",
    color: "#ffffff",
    padding: "11px 12px",
    borderRadius: "6px",
    outline: "none",
    fontSize: "13px",
    resize: "vertical",
  },

  /* IMAGE UPLOAD */

  bannerSection: {
    marginBottom: "28px",
  },

  gallerySection: {
    marginTop: "8px",
  },

  imageSubTitle: {
    margin: "0 0 8px",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "600",
  },

  bannerBadge: {
    padding: "7px 12px",
    background: "#071525",
    border: "1px solid #1E4E78",
    color: "#33c1ff",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },

  bannerUploadBox: {
    minHeight: "190px",
    border: "2px dashed #1E4E78",
    borderRadius: "10px",
    backgroundColor: "#071525",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "0.2s",
    marginTop: "10px",
    boxSizing: "border-box",
  },

  bannerPreviewCard: {
    position: "relative",
    height: "260px",
    borderRadius: "10px",
    overflow: "hidden",
    border: "1px solid #1E4E78",
    backgroundColor: "#071525",
    marginTop: "10px",
  },

  bannerPreviewImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  bannerOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: "12px",
    background:
      "linear-gradient(transparent, rgba(0,0,0,0.88))",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    minHeight: "70px",
    boxSizing: "border-box",
  },

  bannerLabel: {
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: "600",
  },

  imageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
  },

  imageHint: {
    color: "#8da5bc",
    fontSize: "12px",
    marginTop: "0",
    lineHeight: "1.6",
    maxWidth: "650px",
  },

  imageCount: {
    minWidth: "50px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#071525",
    border: "1px solid #1E4E78",
    color: "#33c1ff",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },

  uploadBox: {
    minHeight: "150px",
    border: "2px dashed #1E4E78",
    borderRadius: "10px",
    backgroundColor: "#071525",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "0.2s",
    marginTop: "5px",
    boxSizing: "border-box",
  },

  uploadIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, #0878e8, #1251c7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "27px",
    fontWeight: "300",
    marginBottom: "10px",
  },

  uploadText: {
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "600",
  },

  uploadSubText: {
    color: "#7f9bb5",
    fontSize: "11px",
    marginTop: "6px",
  },

  hiddenFileInput: {
    display: "none",
  },

  imageGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "14px",
    marginTop: "18px",
  },

  imagePreviewCard: {
    position: "relative",
    height: "150px",
    borderRadius: "9px",
    overflow: "hidden",
    border: "1px solid #1E4E78",
    backgroundColor: "#071525",
  },

  previewImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  imageOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: "8px",
    background:
      "linear-gradient(transparent, rgba(0,0,0,0.85))",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    minHeight: "55px",
    boxSizing: "border-box",
  },

  imageNumber: {
    color: "#ffffff",
    fontSize: "11px",
    fontWeight: "600",
  },

  removeImageButton: {
    width: "27px",
    height: "27px",
    borderRadius: "50%",
    border: "1px solid #ffffff",
    background: "#7f2020",
    color: "#ffffff",
    fontSize: "20px",
    lineHeight: "20px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  checkboxBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    paddingTop: "28px",
  },

  checkboxLabel: {
    color: "#c5d4e3",
    fontSize: "13px",
    cursor: "pointer",
  },

  amenities: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },

  amenity: {
    background: "#071525",
    border: "1px solid #1E4E78",
    color: "#c5d4e3",
    padding: "9px 13px",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "12px",
  },

  amenityActive: {
    background:
      "linear-gradient(135deg, #0878e8, #1251c7)",
    border: "1px solid #0878e8",
    color: "#ffffff",
    padding: "9px 13px",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "12px",
  },

  customAmenity: {
    display: "flex",
    gap: "10px",
    marginTop: "18px",
  },

  addButton: {
    background: "#162c43",
    border: "1px solid #1E4E78",
    color: "#ffffff",
    padding: "0 18px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  selectedText: {
    color: "#8da5bc",
    fontSize: "12px",
    marginTop: "15px",
  },

  submitArea: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    paddingBottom: "40px",
  },

  cancelButton: {
    background: "#162c43",
    border: "1px solid #1E4E78",
    color: "#ffffff",
    padding: "12px 22px",
    borderRadius: "7px",
    cursor: "pointer",
  },

  submitButton: {
    background:
      "linear-gradient(135deg, #0878e8, #1251c7)",
    border: "none",
    color: "#ffffff",
    padding: "12px 25px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600",
  },

  success: {
    background: "#123f2b",
    border: "1px solid #287a52",
    color: "#8ff0bb",
    padding: "15px 18px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "14px",
  },

  successSmall: {
    fontSize: "12px",
    color: "#a8d9bd",
  },

  error: {
    background: "#4a2020",
    border: "1px solid #8b3838",
    color: "#ffaaaa",
    padding: "14px 18px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "14px",
  },
};

export default AddProperty;