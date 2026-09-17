"use client";

import { useEffect, useState } from "react";
import Footer from "@/components/footer";
import Header from "@/components/secondheader";
import Link from "next/link";
import ImageCard from "@/components/imageCard";

export default function Home() {
  // =========================================
  // SERVER STATUS
  // =========================================

  const [serverStatus, setServerStatus] =
    useState("Checking system...");

  // =========================================
  // CREATE EVENT
  // =========================================

  const [showCreateEvent, setShowCreateEvent] =
    useState(false);

  const [uploadingImage, setUploadingImage] =
    useState(false);

  const [eventForm, setEventForm] = useState({
    title: "",
    category: "Healthcare",
    location: "",
    date: "",
    description: "",
    image: "",
  });

  // =========================================
  // CHECK BACKEND SERVER
  // =========================================

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/`
        );

        const contentType =
          response.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
          const data = await response.json();

          console.log("SERVER RESPONSE:", data);
        } else {
          const text = await response.text();

          console.log("SERVER RESPONSE:", text);
        }

        if (response.ok) {
          setServerStatus("System Online");
        } else {
          setServerStatus(
            "System Requires Attention"
          );
        }
      } catch (error) {
        console.error(
          "Server connection error:",
          error
        );

        setServerStatus("System Offline");
      }
    };

    checkServer();
  }, []);

  // =========================================
  // HANDLE EVENT FORM CHANGES
  // =========================================

  const handleEventChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setEventForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================
  // CLOUDINARY IMAGE UPLOAD
  // =========================================

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploadingImage(true);

    try {
      const cloudName =
        process.env
          .NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

      const uploadPreset =
        process.env
          .NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        alert(
          "Cloudinary configuration is missing."
        );

        return;
      }

      const formData = new FormData();

      formData.append("file", file);

      formData.append(
        "upload_preset",
        uploadPreset
      );

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "Cloudinary error:",
          data
        );

        alert("Image upload failed.");

        return;
      }

      console.log(
        "Cloudinary image:",
        data.secure_url
      );

      // Save Cloudinary URL into event form
      setEventForm((prev) => ({
        ...prev,
        image: data.secure_url,
      }));

      alert(
        "Image uploaded successfully!"
      );
    } catch (error) {
      console.error(
        "Image upload error:",
        error
      );

      alert(
        "Unable to upload image."
      );
    } finally {
      setUploadingImage(false);
    }
  };

  // =========================================
  // OPEN CREATE EVENT POPUP
  // =========================================

  const openCreateEvent = () => {
    setEventForm({
      title: "",
      category: "Healthcare",
      location: "",
      date: "",
      description: "",
      image: "",
    });

    setShowCreateEvent(true);
  };

  // =========================================
  // CLOSE CREATE EVENT POPUP
  // =========================================

  const closeCreateEvent = () => {
    setShowCreateEvent(false);
  };

  return (
    <>
      <Header />

      <main className="admin-dashboard-page">

        {/* =========================================
            HERO
        ========================================= */}

        <section className="admin-dashboard-hero">
          <div className="admin-hero-content">

            <span className="admin-dashboard-label">
              ADMINISTRATION CENTER
            </span>

            <h1>
              Manage <strong>ARMSLENGTH</strong>
            </h1>

            <p>
              Monitor organizations, volunteers,
              events, and opportunities from one
              centralized dashboard. Keep the platform
              organized, secure, and ready to create
              meaningful connections.
            </p>

            <div className="admin-hero-actions">

              {/* CREATE EVENT BUTTON */}

              <button
                type="button"
                className="admin-primary-btn"
                onClick={openCreateEvent}
              >
                + Create Event
              </button>

              <Link
                href="/organizations"
                className="admin-secondary-btn"
              >
                View Organizations
              </Link>

            </div>
          </div>

          <div className="admin-system-status">
            <span className="status-dot"></span>
            {serverStatus}
          </div>
        </section>

        {/* =========================================
            OVERVIEW
        ========================================= */}

        <section className="admin-overview-section">

          <div className="admin-section-title">

            <span>
              PLATFORM OVERVIEW
            </span>

            <h2>
              Everything you need in one place
            </h2>

            <p>
              Monitor the main areas of the
              ARMSLENGTH platform and quickly
              access the tools needed to manage
              the community.
            </p>

          </div>

          <div className="admin-overview-card">

            <div className="overview-icon">
              ⚙️
            </div>

            <div>

              <h3>
                Administrator Dashboard
              </h3>

              <p>
                Your administrator dashboard gives
                you control over the platform&apos;s
                organizations, volunteers, events,
                and community opportunities.
              </p>

              <p>
                Review activity, manage information,
                and help maintain a trusted
                environment for everyone using
                ARMSLENGTH.
              </p>

            </div>

          </div>

        </section>

        {/* =========================================
            STATISTICS
        ========================================= */}

        <section className="admin-statistics-section">

          <div className="admin-section-title">

            <span>
              PLATFORM ACTIVITY
            </span>

            <h2>
              Quick overview
            </h2>

          </div>

          <div className="admin-stats-grid">

            <div className="admin-stat-card">

              <div className="stat-icon">
                👥
              </div>

              <div>

                <h3>
                  Volunteers
                </h3>

                <p>
                  Manage registered volunteers
                </p>

              </div>

            </div>

            <div className="admin-stat-card">

              <div className="stat-icon">
                🏢
              </div>

              <div>

                <h3>
                  Organizations
                </h3>

                <p>
                  Review partner organizations
                </p>

              </div>

            </div>

            <div className="admin-stat-card">

              <div className="stat-icon">
                📅
              </div>

              <div>

                <h3>
                  Events
                </h3>

                <p>
                  Monitor platform opportunities
                </p>

              </div>

            </div>

            <div className="admin-stat-card">

              <div className="stat-icon">
                📋
              </div>

              <div>

                <h3>
                  Applications
                </h3>

                <p>
                  Review volunteer activity
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* =========================================
            MANAGEMENT
        ========================================= */}

        <section className="admin-management-section">

          <div className="admin-section-title">

            <span>
              MANAGEMENT TOOLS
            </span>

            <h2>
              Manage the platform
            </h2>

            <p>
              Quickly access the most important
              administrative areas.
            </p>

          </div>

          <div className="admin-management-grid">

            <div className="admin-management-card">

              <div className="management-icon">
                👥
              </div>

              <h3>
                Volunteer Management
              </h3>

              <p>
                View volunteer profiles, review
                information, and manage registered
                users.
              </p>

              <Link href="/volunteers">
                Manage Volunteers →
              </Link>

            </div>

            <div className="admin-management-card">

              <div className="management-icon">
                🏢
              </div>

              <h3>
                Organization Management
              </h3>

              <p>
                Review organizations and ensure
                that information on the platform
                is accurate.
              </p>

              <Link href="/organizations">
                Manage Organizations →
              </Link>

            </div>

            <div className="admin-management-card">

              <div className="management-icon">
                📅
              </div>

              <h3>
                Event Management
              </h3>

              <p>
                Monitor events and opportunities
                created by organizations.
              </p>

              <Link href="/adminevents">
                Manage Events →
              </Link>

            </div>

            <div className="admin-management-card">

              <div className="management-icon">
                📊
              </div>

              <h3>
                Applications
              </h3>

              <p>
                Review volunteer applications and
                monitor activity across opportunities.
              </p>

              <Link href="/applications">
                View Applications →
              </Link>

            </div>

          </div>

        </section>

        {/* =========================================
            RECENT EVENTS
        ========================================= */}

        <section className="admin-events-section">

          <div className="admin-events-header">

            <div className="admin-section-title">

              <span>
                EVENT MANAGEMENT
              </span>

              <h2>
                Featured opportunities
              </h2>

              <p>
                Review some of the opportunities
                currently available on the platform.
              </p>

            </div>

            <Link
              href="/adminevents"
              className="view-all-events"
            >
              View All Events →
            </Link>

          </div>

          <div className="admin-events-grid">

            <div className="admin-event-card">

              <ImageCard
                src="/images/COMMUNITY EME.jpg"
                alt="Awareness Outreach"
              />

              <div className="admin-event-content">

                <span>
                  COMMUNITY
                </span>

                <h3>
                  Awareness Outreach
                </h3>

                <p>
                  Community-focused programs
                  designed to create awareness
                  and encourage positive change.
                </p>

                <Link href="/adminevents">
                  Review Event →
                </Link>

              </div>

            </div>

            <div className="admin-event-card">

              <ImageCard
                src="/images/This past Saturday, we had the honour of joining….jpg"
                alt="Medical Assistant"
              />

              <div className="admin-event-content">

                <span>
                  HEALTHCARE
                </span>

                <h3>
                  Medical Assistant
                </h3>

                <p>
                  Volunteer opportunities
                  supporting healthcare outreach
                  and community medical services.
                </p>

                <Link href="/adminevents">
                  Review Event →
                </Link>

              </div>

            </div>

            <div className="admin-event-card">

              <ImageCard
                src="/images/Education for All.jpg"
                alt="Educational Outreach"
              />

              <div className="admin-event-content">

                <span>
                  EDUCATION
                </span>

                <h3>
                  Educational Outreach
                </h3>

                <p>
                  Opportunities focused on
                  supporting learning, development,
                  and educational access.
                </p>

                <Link href="/adminevents">
                  Review Event →
                </Link>

              </div>

            </div>

            <div className="admin-event-card">

              <ImageCard
                src="/images/save Africans lives.jpg"
                alt="Stop Hunger Campaign"
              />

              <div className="admin-event-content">

                <span>
                  HUMANITARIAN
                </span>

                <h3>
                  Stop Hunger Campaign
                </h3>

                <p>
                  Community programs focused on
                  food support and helping people
                  in need.
                </p>

                <Link href="/adminevents">
                  Review Event →
                </Link>

              </div>

            </div>

          </div>

        </section>

        {/* =========================================
            RESPONSIBILITIES
        ========================================= */}

        <section className="admin-responsibilities">

          <div>

            <span className="admin-dashboard-label">
              YOUR RESPONSIBILITIES
            </span>

            <h2>
              Help maintain a trusted and effective
              platform.
            </h2>

            <p>
              Administrators play an important role
              in ensuring that organizations,
              volunteers, and opportunities meet the
              standards of the ARMSLENGTH community.
            </p>

          </div>

          <div className="responsibility-list">

            <div className="responsibility-item">

              <span>
                ✓
              </span>

              <div>

                <h3>
                  Verify Information
                </h3>

                <p>
                  Ensure organizations and
                  opportunities provide accurate
                  and appropriate information.
                </p>

              </div>

            </div>

            <div className="responsibility-item">

              <span>
                ✓
              </span>

              <div>

                <h3>
                  Manage Community Activity
                </h3>

                <p>
                  Monitor volunteers, events,
                  applications, and platform activity.
                </p>

              </div>

            </div>

            <div className="responsibility-item">

              <span>
                ✓
              </span>

              <div>

                <h3>
                  Maintain Platform Quality
                </h3>

                <p>
                  Help create a safe, organized,
                  and reliable environment for users.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* =========================================
            CTA
        ========================================= */}

        <section className="admin-dashboard-cta">

          <div>

            <span>
              READY TO MANAGE?
            </span>

            <h2>
              Keep ARMSLENGTH moving forward.
            </h2>

            <p>
              Access the tools you need to manage
              organizations, volunteers, events,
              and opportunities.
            </p>

            <div className="admin-cta-actions">

              <button
                type="button"
                className="admin-cta-primary"
                onClick={openCreateEvent}
              >
                + Create Event
              </button>

              <Link
                href="/organizations"
                className="admin-cta-secondary"
              >
                View Organizations
              </Link>

            </div>

          </div>

        </section>

      </main>

      {/* =========================================
          CREATE EVENT MODAL
      ========================================= */}

      {showCreateEvent && (
        <div
          className="create-event-overlay"
          onClick={closeCreateEvent}
        >

          <div
            className="create-event-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="create-event-header">

              <div>
                <span>
                  EVENT MANAGEMENT
                </span>

                <h2>
                  Create New Event
                </h2>
              </div>

              <button
                type="button"
                className="create-event-close"
                onClick={closeCreateEvent}
                aria-label="Close"
              >
                ×
              </button>

            </div>

            {/* FORM */}

            <div className="create-event-form">

              {/* TITLE */}

              <div className="create-event-field">

                <label htmlFor="title">
                  Event Title
                </label>

                <input
                  type="text"
                  id="title"
                  name="title"
                  value={eventForm.title}
                  onChange={handleEventChange}
                  placeholder="Enter event title"
                />

              </div>

              {/* CATEGORY */}

              <div className="create-event-field">

                <label htmlFor="category">
                  Category
                </label>

                <select
                  id="category"
                  name="category"
                  value={eventForm.category}
                  onChange={handleEventChange}
                >
                  <option value="Healthcare">
                    Healthcare
                  </option>

                  <option value="Education">
                    Education
                  </option>

                  <option value="Humanitarian Aid">
                    Humanitarian Aid
                  </option>

                  <option value="Environment">
                    Environment
                  </option>

                  <option value="Youth Development">
                    Youth Development
                  </option>

                  <option value="Community">
                    Community
                  </option>

                  <option value="Emergency Response">
                    Emergency Response
                  </option>
                </select>

              </div>

              {/* LOCATION */}

              <div className="create-event-field">

                <label htmlFor="location">
                  Location
                </label>

                <input
                  type="text"
                  id="location"
                  name="location"
                  value={eventForm.location}
                  onChange={handleEventChange}
                  placeholder="Enter event location"
                />

              </div>

              {/* DATE */}

              <div className="create-event-field">

                <label htmlFor="date">
                  Event Date
                </label>

                <input
                  type="date"
                  id="date"
                  name="date"
                  value={eventForm.date}
                  onChange={handleEventChange}
                />

              </div>

              {/* DESCRIPTION */}

              <div className="create-event-field">

                <label htmlFor="description">
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={eventForm.description}
                  onChange={handleEventChange}
                  placeholder="Describe the event..."
                  rows={5}
                />

              </div>

              {/* CLOUDINARY IMAGE */}

              <div className="create-event-field">

                <label htmlFor="event-image">
                  Event Image
                </label>

                <div className="cloudinary-upload">

                  <input
                    type="file"
                    id="event-image"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />

                  {uploadingImage && (
                    <p className="upload-status">
                      Uploading image to Cloudinary...
                    </p>
                  )}

                  {eventForm.image && (
                    <div className="event-image-preview">

                      <p>
                        Image uploaded successfully
                      </p>

                      <img
                        src={eventForm.image}
                        alt="Event preview"
                      />

                    </div>
                  )}

                </div>

              </div>

              {/* ACTIONS */}

              <div className="create-event-actions">

                <button
                  type="button"
                  className="create-event-cancel"
                  onClick={closeCreateEvent}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="create-event-submit"
                  disabled={
                    uploadingImage
                  }
                  onClick={() => {
                    alert(
                      "Image upload is working. We will connect this form to the backend next."
                    );
                  }}
                >
                  Create Event
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

      <Footer />
    </>
  );
}