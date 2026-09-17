"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/secondheader";
import Footer from "@/components/footer";

interface Event {
  id: number;
  name: string;
  organization: string;
  date: string;
  time: string;
  location: string;
  volunteers: number;
  capacity: number;
  status: string;
  category: string;
  image_url?: string;
}

interface EventForm {
  name: string;
  organization: string;
  category: string;
  eventDate: string;
  location: string;
  startTime: string;
  endTime: string;
  capacity: string;
  registrationDeadline: string;
  description: string;
}

const API_URL = "http://localhost:4000";

export default function EventsAdmin() {
  /* =====================================================
     STATE
  ===================================================== */

  const [events, setEvents] = useState<Event[]>([]);

  const [image, setImage] = useState("");

  const [uploadingImage, setUploadingImage] =
    useState(false);

  const [loadingEvents, setLoadingEvents] =
    useState(true);

  const [creatingEvent, setCreatingEvent] =
    useState(false);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [showCreateEvent, setShowCreateEvent] =
    useState(false);

  const [eventForm, setEventForm] =
    useState<EventForm>({
      name: "",
      organization: "",
      category: "Community",
      eventDate: "",
      location: "",
      startTime: "",
      endTime: "",
      capacity: "",
      registrationDeadline: "",
      description: "",
    });

  /* =====================================================
     HELPER - READ API RESPONSE SAFELY
  ===================================================== */

  const readResponse = async (response: Response) => {
    const text = await response.text();

    console.log(
      "API STATUS:",
      response.status
    );

    console.log(
      "API RESPONSE:",
      text
    );

    if (!text) {
      return {};
    }

    try {
      return JSON.parse(text);
    } catch {
      throw new Error(
        `Server returned HTML or invalid JSON. Status: ${response.status}`
      );
    }
  };

  /* =====================================================
     GET EVENTS
  ===================================================== */

  const fetchEvents = async () => {
    try {
      setLoadingEvents(true);

      const response = await fetch(
        `${API_URL}/api/events`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        }
      );

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch events"
        );
      }

      if (!Array.isArray(data)) {
        throw new Error(
          "The backend did not return an events array."
        );
      }

      const formattedEvents: Event[] =
        data.map((event: any) => ({
          id: Number(event.id),

          name: event.name || "",

          organization:
            event.organization || "",

          category:
            event.category || "Other",

          date: event.event_date
            ? new Date(
                event.event_date
              ).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )
            : "No date",

          time: `${event.start_time || ""} - ${
            event.end_time || ""
          }`,

          location:
            event.location || "No location",

          volunteers:
            Number(event.volunteers) || 0,

          capacity:
            Number(event.capacity) || 0,

          status:
            event.status || "Pending",

          image_url:
            event.image_url || "",
        }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error(
        "Fetch events error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to load events. Make sure your backend is running on port 4000."
      );
    } finally {
      setLoadingEvents(false);
    }
  };

  /* =====================================================
     LOAD EVENTS WHEN PAGE OPENS
  ===================================================== */

  useEffect(() => {
    fetchEvents();
  }, []);

  /* =====================================================
     FORM CHANGE
  ===================================================== */

  const handleEventChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
        HTMLSelectElement |
        HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setEventForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =====================================================
     IMAGE UPLOAD
  ===================================================== */

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    /* Check file type */

    if (!file.type.startsWith("image/")) {
      alert(
        "Please select a valid image file."
      );

      e.target.value = "";

      return;
    }

    /* Check file size */

    if (file.size > 5 * 1024 * 1024) {
      alert(
        "Image must be smaller than 5MB."
      );

      e.target.value = "";

      return;
    }

    try {
      setUploadingImage(true);

      const formData = new FormData();

      formData.append(
        "file",
        file
      );

      console.log(
        "Uploading image to:",
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/upload-image`
      );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/upload-image`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data =
        await readResponse(response);

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Image upload failed"
        );
      }

      if (!data.imageUrl) {
        throw new Error(
          "Cloudinary did not return an image URL."
        );
      }

      setImage(data.imageUrl);

      console.log(
        "Cloudinary image:",
        data.imageUrl
      );

      alert(
        "Image uploaded successfully!"
      );
    } catch (error) {
      console.error(
        "Upload error:",
        error
      );

      setImage("");

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong while uploading the image."
      );
    } finally {
      setUploadingImage(false);
    }
  };

  /* =====================================================
     CREATE EVENT
  ===================================================== */

  const handleCreateEvent = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (uploadingImage) {
      alert(
        "Please wait for the image upload to finish."
      );

      return;
    }

    /* Basic validation */

    if (!eventForm.name.trim()) {
      alert("Please enter an event name.");
      return;
    }

    if (!eventForm.organization.trim()) {
      alert(
        "Please enter an organization."
      );
      return;
    }

    if (!eventForm.eventDate) {
      alert(
        "Please select an event date."
      );
      return;
    }

    if (!eventForm.location.trim()) {
      alert(
        "Please enter an event location."
      );
      return;
    }

    if (
      !eventForm.startTime ||
      !eventForm.endTime
    ) {
      alert(
        "Please select the start and end time."
      );

      return;
    }

    const capacity =
      Number(eventForm.capacity);

    if (
      !eventForm.capacity ||
      Number.isNaN(capacity) ||
      capacity <= 0
    ) {
      alert(
        "Please enter a valid volunteer capacity."
      );

      return;
    }

    try {
      setCreatingEvent(true);

      const eventData = {
        name: eventForm.name.trim(),

        organization:
          eventForm.organization.trim(),

        category:
          eventForm.category,

        eventDate:
          eventForm.eventDate,

        location:
          eventForm.location.trim(),

        startTime:
          eventForm.startTime,

        endTime:
          eventForm.endTime,

        capacity,

        registrationDeadline:
          eventForm.registrationDeadline ||
          null,

        description:
          eventForm.description.trim() ||
          null,

        imageUrl:
          image || null,
      };

      console.log(
        "Creating event:",
        eventData
      );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Accept:
              "application/json",
          },

          body: JSON.stringify(
            eventData
          ),
        }
      );

      const data =
        await readResponse(response);

      if (!response.ok) {
       throw new Error(
          data.message ||
            "Failed to create event"
        );
      }

      console.log(
        "Created event:",
        data.event
      );

      alert(
        "Event created successfully!"
      );

      /* Reset form */

      setEventForm({
        name: "",
        organization: "",
        category: "Community",
        eventDate: "",
        location: "",
        startTime: "",
        endTime: "",
        capacity: "",
        registrationDeadline: "",
        description: "",
      });

      setImage("");

      setShowCreateEvent(false);

      /* Reload events */

      await fetchEvents();
    } catch (error) {
      console.error(
        "Create event error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to connect to the backend."
      );
    } finally {
      setCreatingEvent(false);
    }
  };

  /* =====================================================
     DELETE EVENT
  ===================================================== */

  const deleteEvent = async (
    id: number
  ) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this event?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}`,
        {
          method: "DELETE",

          headers: {
            Accept:
              "application/json",
          },
        }
      );

      const data =
        await readResponse(response);

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete event"
        );
      }

      alert(
        "Event deleted successfully."
      );

      setEvents((previous) =>
        previous.filter(
          (event) =>
            event.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Delete error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to connect to the backend."
      );
    }
  };

  /* =====================================================
     APPROVE EVENT
  ===================================================== */

  const approveEvent = async (
    id: number
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}/approve`,
        {
          method: "PATCH",

          headers: {
            Accept:
              "application/json",
          },
        }
      );

      const data =
        await readResponse(response);

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to approve event"
        );
      }

      alert(
        "Event approved successfully!"
      );

      /*
       * Backend changes status to "Approved",
       * so frontend must also use "Approved".
       */

      setEvents((previous) =>
        previous.map((event) =>
          event.id === id
            ? {
                ...event,
                status: "Approved",
              }
            : event
        )
      );
    } catch (error) {
      console.error(
        "Approve error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to connect to the backend."
      );
    }
  };

  /* =====================================================
     SEARCH + FILTER
  ===================================================== */

  const filteredEvents =
    events.filter((event) => {
      const searchText =
        search.toLowerCase().trim();

      const matchesSearch =
        event.name
          .toLowerCase()
          .includes(searchText) ||

        event.organization
          .toLowerCase()
          .includes(searchText) ||

        event.location
          .toLowerCase()
          .includes(searchText) ||

        event.category
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        event.status ===
          statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  /* =====================================================
     STATISTICS
  ===================================================== */

  const totalEvents =
    events.length;

  const upcomingEvents =
    events.filter(
      (event) =>
        event.status ===
          "Approved" ||
        event.status ===
          "Upcoming"
    ).length;

  const pendingEvents =
    events.filter(
      (event) =>
        event.status ===
        "Pending"
    ).length;

  const completedEvents =
    events.filter(
      (event) =>
        event.status ===
        "Completed"
    ).length;

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <>
      <Header />

      <main className="events-admin">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <section className="events-header">

          <div>

            <p className="admin-label">
              ADMINISTRATION
            </p>

            <h1>
              Events Management
            </h1>

            <p>
              Create, monitor, review,
              and manage all events
              available on the
              ARMSLENGTH platform.
            </p>

          </div>

          <button
            type="button"
            className="create-event-btn"
            onClick={() =>
              setShowCreateEvent(true)
            }
          >
            + Create Event
          </button>

        </section>

        {/* =================================================
            STATISTICS
        ================================================= */}

        <section className="event-statistics">

          <div className="event-stat-card">

            <p>Total Events</p>

            <h2>
              {totalEvents}
            </h2>

            <span>
              All platform events
            </span>

          </div>

          <div className="event-stat-card">

            <p>Upcoming</p>

            <h2>
              {upcomingEvents}
            </h2>

            <span>
              Approved events
            </span>

          </div>

          <div className="event-stat-card">

            <p>Pending</p>

            <h2>
              {pendingEvents}
            </h2>

            <span>
              Awaiting approval
            </span>

          </div>

          <div className="event-stat-card">

            <p>Completed</p>

            <h2>
              {completedEvents}
            </h2>

            <span>
              Completed events
            </span>

          </div>

        </section>

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <section className="quick-actions">

          <h2>
            Quick Actions
          </h2>

          <div className="quick-action-grid">

            <button
              type="button"
              onClick={() =>
                setShowCreateEvent(
                  true
                )
              }
            >

              <strong>
                + Create Event
              </strong>

              <span>
                Create a new platform
                event
              </span>

            </button>

            <Link href="/organizations">

              <strong>
                Organizations
              </strong>

              <span>
                View event
                organizations
              </span>

            </Link>

            <Link href="/volunteers">

              <strong>
                Volunteers
              </strong>

              <span>
                View registered
                volunteers
              </span>

            </Link>

            <Link href="/applications">

              <strong>
                Applications
              </strong>

              <span>
                Review applications
              </span>

            </Link>

          </div>

        </section>

        {/* =================================================
            EVENTS MANAGEMENT
        ================================================= */}

        <section className="events-management">

          <div className="section-heading">

            <div>

              <p className="admin-label">
                EVENT DATABASE
              </p>

              <h2>
                Manage Events
              </h2>

            </div>

            <span>
              {filteredEvents.length}{" "}
              event(s)
            </span>

          </div>

          {/* SEARCH + FILTER */}

          <div className="event-filters">

            <input
              type="text"
              placeholder="Search events, organizations or locations..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
            >

              <option value="All">
                All Status
              </option>

              <option value="Approved">
                Approved
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Upcoming">
                Upcoming
              </option>

              <option value="Full">
                Full
              </option>

              <option value="Completed">
                Completed
              </option>

            </select>

          </div>

          {/* =================================================
              EVENT TABLE
          ================================================= */}

          <div className="event-table-container">

            {loadingEvents ? (

              <div className="no-events">

                <h3>
                  Loading events...
                </h3>

                <p>
                  Please wait while
                  events are loaded.
                </p>

              </div>

            ) : filteredEvents.length ===
              0 ? (

              <div className="no-events">

                <h3>
                  No events found
                </h3>

                <p>
                  Try changing your
                  search or filter.
                </p>

              </div>

            ) : (

              <table className="event-table">

                <thead>

                  <tr>

                    <th>
                      Event
                    </th>

                    <th>
                      Organization
                    </th>

                    <th>
                      Date
                    </th>

                    <th>
                      Location
                    </th>

                    <th>
                      Volunteers
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredEvents.map(
                    (event) => {

                      const progress =
                        event.capacity >
                        0
                          ? Math.min(
                              (
                                event.volunteers /
                                event.capacity
                              ) *
                                100,
                              100
                            )
                          : 0;

                      return (

                        <tr
                          key={
                            event.id
                          }
                        >

                          {/* EVENT */}

                          <td>

                            <div className="event-name">

                              {event.image_url ? (

                                <img
                                  src={
                                    event.image_url
                                  }
                                  alt={
                                    event.name
                                  }
                                  className="event-table-image"
                                />

                              ) : (

                                <div className="event-table-image-placeholder">
                                  No Image
                                </div>

                              )}

                              <div>

                                <strong>
                                  {
                                    event.name
                                  }
                                </strong>

                                <span>
                                  {
                                    event.category
                                  }
                                </span>

                              </div>

                            </div>

                          </td>

                          {/* ORGANIZATION */}

                          <td>
                            {
                              event.organization
                            }
                          </td>

                          {/* DATE */}

                          <td>

                            <div>

                              {
                                event.date
                              }

                              <small>
                                {
                                  event.time
                                }
                              </small>

                            </div>

                          </td>

                          {/* LOCATION */}

                          <td>
                            {
                              event.location
                            }
                          </td>

                          {/* VOLUNTEERS */}

                          <td>

                            <div className="volunteer-count">

                              <strong>
                                {
                                  event.volunteers
                                }
                              </strong>

                              <span>
                                /{" "}
                                {
                                  event.capacity
                                }
                              </span>

                            </div>

                            <div className="progress-bar">

                              <div
                                style={{
                                  width: `${progress}%`,
                                }}
                              />

                            </div>

                          </td>

                          {/* STATUS */}

                          <td>

                            <span
                              className={`event-status ${event.status
                                .toLowerCase()
                                .replace(
                                  /\s+/g,
                                  "-"
                                )}`}
                            >
                              {
                                event.status
                              }
                            </span>

                          </td>

                          {/* ACTIONS */}

                          <td>

                            <div className="event-actions">

                              <Link
                                href={`/events/${event.id}`}
                              >
                                View
                              </Link>

                              <button
                                type="button"
                                onClick={() =>
                                  alert(
                                    "Edit functionality can be connected here."
                                  )
                                }
                              >
                                Edit
                              </button>

                              {event.status ===
                                "Pending" && (

                                <button
                                  type="button"
                                  onClick={() =>
                                    approveEvent(
                                      event.id
                                    )
                                  }
                                >
                                  Approve
                                </button>

                              )}

                              <button
                                type="button"
                                className="delete-btn"
                                onClick={() =>
                                  deleteEvent(
                                    event.id
                                  )
                                }
                              >
                                Delete
                              </button>

                            </div>

                          </td>

                        </tr>

                      );
                    }
                  )}

                </tbody>

              </table>

            )}

          </div>

        </section>

        {/* =================================================
            CREATE EVENT MODAL
        ================================================= */}

        {showCreateEvent && (

          <div
            className="modal-overlay"
            onClick={(e) => {

              if (
                e.target ===
                e.currentTarget
              ) {
                setShowCreateEvent(
                  false
                );
              }

            }}
          >

            <div className="create-event-modal">

              {/* MODAL HEADER */}

              <div className="modal-header">

                <div>

                  <p className="admin-label">
                    EVENT MANAGEMENT
                  </p>

                  <h2>
                    Create New Event
                  </h2>

                </div>

                <button
                  type="button"
                  className="close-modal"
                  onClick={() =>
                    setShowCreateEvent(
                      false
                    )
                  }
                >
                  ×
                </button>

              </div>

              {/* FORM */}

              <form
                onSubmit={
                  handleCreateEvent
                }
              >

                {/* EVENT NAME */}

                <div className="form-group">

                  <label>
                    Event Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={
                      eventForm.name
                    }
                    onChange={
                      handleEventChange
                    }
                    placeholder="Enter event name"
                    required
                  />

                </div>

                {/* ORGANIZATION + CATEGORY */}

                <div className="form-row">

                  <div className="form-group">

                    <label>
                      Organization
                    </label>

                    <input
                      type="text"
                      name="organization"
                      value={
                        eventForm.organization
                      }
                      onChange={
                        handleEventChange
                      }
                      placeholder="Organization name"
                      required
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Category
                    </label>

                    <select
                      name="category"
                      value={
                        eventForm.category
                      }
                      onChange={
                        handleEventChange
                      }
                    >

                      <option value="Community">
                        Community
                      </option>

                      <option value="Healthcare">
                        Healthcare
                      </option>

                      <option value="Education">
                        Education
                      </option>

                      <option value="Environment">
                        Environment
                      </option>

                      <option value="Other">
                        Other
                      </option>

                    </select>

                  </div>

                </div>

                {/* DATE + LOCATION */}

                <div className="form-row">

                  <div className="form-group">

                    <label>
                      Date
                    </label>

                    <input
                      type="date"
                      name="eventDate"
                      value={
                        eventForm.eventDate
                      }
                      onChange={
                        handleEventChange
                      }
                      required
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Location
                    </label>

                    <input
                      type="text"
                      name="location"
                      value={
                        eventForm.location
                      }
                      onChange={
                        handleEventChange
                      }
                      placeholder="Event location"
                      required
                    />

                  </div>

                </div>

                {/* TIME */}

                <div className="form-row">

                  <div className="form-group">

                    <label>
                      Start Time
                    </label>

                    <input
                      type="time"
                      name="startTime"
                      value={
                        eventForm.startTime
                      }
                      onChange={
                        handleEventChange
                      }
                      required
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      End Time
                    </label>

                    <input
                      type="time"
                      name="endTime"
                      value={
                        eventForm.endTime
                      }
                      onChange={
                        handleEventChange
                      }
                      required
                    />

                  </div>

                </div>

                {/* CAPACITY + DEADLINE */}

                <div className="form-row">

                  <div className="form-group">

                    <label>
                      Maximum Volunteers
                    </label>

                    <input
                      type="number"
                      name="capacity"
                      value={
                        eventForm.capacity
                      }
                      onChange={
                        handleEventChange
                      }
                      placeholder="50"
                      min="1"
                      required
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Registration Deadline
                    </label>

                    <input
                      type="date"
                      name="registrationDeadline"
                      value={
                        eventForm.registrationDeadline
                      }
                      onChange={
                        handleEventChange
                      }
                    />

                  </div>

                </div>

                {/* DESCRIPTION */}

                <div className="form-group">

                  <label>
                    Event Description
                  </label>

                  <textarea
                    name="description"
                    value={
                      eventForm.description
                    }
                    onChange={
                      handleEventChange
                    }
                    placeholder="Describe the event..."
                    rows={5}
                  />

                </div>

                {/* IMAGE */}

                <div className="form-group">

                  <label>
                    Event Image
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={
                      handleImageUpload
                    }
                    disabled={
                      uploadingImage
                    }
                  />

                  <small>
                    Maximum image size:
                    5MB
                  </small>

                  {uploadingImage && (

                    <p>
                      Uploading image
                      to Cloudinary...
                    </p>

                  )}

                  {image && (

                    <div
                      style={{
                        marginTop:
                          "15px",
                      }}
                    >

                      <img
                        src={image}
                        alt="Event preview"
                        style={{
                          width:
                            "200px",
                          height:
                            "120px",
                          objectFit:
                            "cover",
                          borderRadius:
                            "8px",
                        }}
                      />

                      <p>
                        Image uploaded
                        successfully.
                      </p>

                    </div>

                  )}

                </div>

                {/* BUTTONS */}

                <div className="modal-actions">

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() =>
                      setShowCreateEvent(
                        false
                      )
                    }
                    disabled={
                      creatingEvent
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="save-event-btn"
                    disabled={
                      creatingEvent ||
                      uploadingImage
                    }
                  >

                    {creatingEvent
                      ? "Creating..."
                      : "Create Event"}

                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

      </main>

      <Footer />
    </>
  );
}
