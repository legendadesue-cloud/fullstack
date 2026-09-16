"use client";

import { useEffect, useState } from "react";
import Header from "@/components/secondheader";
import Footer from "@/components/footer";

interface Event {
  id: number;
  name: string;
  organization: string;
  category: string;
  event_date: string;
  location: string;
  start_time: string;
  end_time: string;
  capacity: number;
  volunteers: number;
  registration_deadline: string;
  description: string;
  image_url?: string;
  status: string;
}

type VolunteerOpportunity = {
  id: number;
  opportunity: string;
  category: string;
  location: string;
  deadline: string;
  applicants: number;
  capacity: number;
  status: "Open" | "Upcoming" | "Closed";
  eventDate: string;
  startTime: string;
  endTime: string;
  organization: string;
  description: string;
  image_url?: string;
};

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<VolunteerOpportunity | null>(null);
  const [registering, setRegistering] = useState(false);
  const [registerMessage, setRegisterMessage] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("http://localhost:4000/api/events");

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data: Event[] = await response.json();

        const approvedEvents = Array.isArray(data)
          ? data.filter((event) => event.status?.toLowerCase() === "approved")
          : [];

        const mappedEvents: VolunteerOpportunity[] = approvedEvents.map(
          (event) => {
            const eventDate = new Date(event.event_date);
            const today = new Date();

            let status: "Open" | "Upcoming" | "Closed" = "Open";

            if (eventDate < today) {
              status = "Closed";
            } else if (eventDate.toDateString() !== today.toDateString()) {
              status = "Upcoming";
            }

            const deadline = event.registration_deadline
              ? new Date(event.registration_deadline)
              : null;

            if (deadline && deadline < today) {
              status = "Closed";
            }

            return {
              id: event.id,
              opportunity: event.name,
              category: event.category,
              location: event.location,
              deadline: deadline
                ? deadline.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "N/A",
              applicants: Number(event.volunteers) || 0,
              capacity: Number(event.capacity) || 0,
              status,
              eventDate: event.event_date,
              startTime: event.start_time,
              endTime: event.end_time,
              organization: event.organization,
              description: event.description || "No description available.",
              image_url: event.image_url,
            };
          }
        );

        setOpportunities(mappedEvents);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Unable to load volunteer opportunities.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredOpportunities = opportunities.filter((item) => {
    const searchTerm = search.toLowerCase();

    const matchesSearch =
      item.opportunity.toLowerCase().includes(searchTerm) ||
      item.location.toLowerCase().includes(searchTerm) ||
      item.organization.toLowerCase().includes(searchTerm);

    const matchesCategory =
      category === "All Categories" || item.category === category;

    return matchesSearch && matchesCategory;
  });

  const activeCount = opportunities.filter(
    (item) => item.status === "Open"
  ).length;

  const upcomingCount = opportunities.filter(
    (item) => item.status === "Upcoming"
  ).length;

  const totalApplicants = opportunities.reduce(
    (total, item) => total + item.applicants,
    0
  );

  const completedCount = opportunities.filter(
    (item) => item.status === "Closed"
  ).length;

  const formatDate = (date: string) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (time: string) => {
    if (!time) return "N/A";

    const [hours, minutes] = time.split(":");
    const date = new Date();

    date.setHours(Number(hours), Number(minutes));

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const handleRegister = async (eventId: number) => {
    try {
      setRegistering(true);
      setRegisterMessage("");

      const response = await fetch(
        `http://localhost:4000/api/events/${eventId}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json().catch(() => ({}));

      if (response.status === 404) {
        setRegisterMessage(
          "Registration is not available yet. The backend registration route needs to be added first."
        );
        return;
      }

      if (!response.ok) {
        setRegisterMessage(
          data.error || data.message || "Registration failed."
        );
        return;
      }

      setRegisterMessage(
        data.message || "You have successfully registered for this event."
      );
    } catch (err) {
      console.error("Registration error:", err);
      setRegisterMessage(
        "Unable to connect to the registration service."
      );
    } finally {
      setRegistering(false);
    }
  };

  return (
    <>
      <Header />

      <main className="volunteer-management-page">
        <section className="volunteer-hero">
          <div className="volunteer-hero-content">
            <span className="volunteer-label">
              VOLUNTEER MANAGEMENT
            </span>

            <h1>
              Manage Opportunities.
              <strong> Create Impact.</strong>
            </h1>

            <p>
              Manage volunteer opportunities, monitor applications,
              and connect people with meaningful programs across
              the ARMSLENGTH platform.
            </p>

            <div className="volunteer-hero-actions">
              <a
                href="#opportunities"
                className="volunteer-primary-btn"
              >
                View Opportunities
              </a>

              <a
                href="#statistics"
                className="volunteer-secondary-btn"
              >
                View Statistics
              </a>
            </div>
          </div>

          <div className="volunteer-status">
            <span className="status-dot"></span>
            Platform Active
          </div>
        </section>

        <section className="volunteer-section">
          <div className="volunteer-section-heading">
            <span>OPPORTUNITY DIRECTORY</span>

            <h2>Volunteer Opportunities</h2>

            <p>
              Search and filter opportunities to quickly find
              programs that match your organization's needs.
            </p>
          </div>

          <div className="volunteer-search">
            <div className="search-field">
              <label htmlFor="search">Search</label>

              <input
                id="search"
                type="text"
                placeholder="Search opportunities or locations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="filter-field">
              <label htmlFor="category">Category</label>

              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>All Categories</option>

                {Array.from(
                  new Set(
                    opportunities
                      .map((item) => item.category)
                      .filter(Boolean)
                  )
                ).map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <section className="volunteer-stats" id="statistics">
            <div className="volunteer-stat-card">
              <span className="stat-label">
                Active Opportunities
              </span>

              <strong>{activeCount}</strong>

              <small>Currently open</small>
            </div>

            <div className="volunteer-stat-card">
              <span className="stat-label">
                Applications
              </span>

              <strong>{totalApplicants}</strong>

              <small>Total applicants</small>
            </div>

            <div className="volunteer-stat-card">
              <span className="stat-label">
                Upcoming
              </span>

              <strong>{upcomingCount}</strong>

              <small>Starting soon</small>
            </div>

            <div className="volunteer-stat-card">
              <span className="stat-label">
                Completed
              </span>

              <strong>{completedCount}</strong>

              <small>Closed programs</small>
            </div>
          </section>

          <section
            className="volunteer-table-section"
            id="opportunities"
          >
            <div className="table-heading">
              <div>
                <span>AVAILABLE PROGRAMS</span>

                <h2>Opportunity Management</h2>
              </div>

              <span className="result-count">
                {filteredOpportunities.length} opportunities
              </span>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Opportunity</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Deadline</th>
                    <th>Applicants</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="no-results"
                      >
                        Loading volunteer opportunities...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="no-results"
                      >
                        {error}
                      </td>
                    </tr>
                  ) : filteredOpportunities.length > 0 ? (
                    filteredOpportunities.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <strong className="opportunity-name">
                            {item.opportunity}
                          </strong>
                        </td>

                        <td>{item.category}</td>

                        <td>{item.location}</td>

                        <td>{item.deadline}</td>

                        <td>
                          {item.applicants}
                          {item.capacity > 0
                            ? ` / ${item.capacity}`
                            : ""}
                        </td>

                        <td>
                          <span
                            className={`badge ${item.status.toLowerCase()}`}
                          >
                            {item.status}
                          </span>
                        </td>

                        <td>
                          <div className="table-actions">
                            <button
                              className="tbl-btn view-btn"
                              onClick={() =>
                                setSelectedOpportunity(item)
                              }
                            >
                              View
                            </button>

                            {item.status === "Open" && (
                              <button
                                className="tbl-btn bookmark-btn"
                                onClick={() =>
                                  handleRegister(item.id)
                                }
                                disabled={registering}
                              >
                                {registering
                                  ? "Registering..."
                                  : "Register"}
                              </button>
                            )}

                            {item.status === "Closed" && (
                              <button
                                className="tbl-btn archive-btn"
                                disabled
                              >
                                Archived
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="no-results"
                      >
                        No volunteer opportunities found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </section>

        <section className="volunteer-cta">
          <div className="volunteer-cta-content">
            <span>KEEP MAKING AN IMPACT</span>

            <h2>Help Connect People With Purpose.</h2>

            <p>
              Keep the ARMSLENGTH platform organized by managing
              opportunities and ensuring volunteers can discover
              meaningful programs.
            </p>

            <div className="volunteer-cta-actions">
              <a
                href="#opportunities"
                className="volunteer-cta-primary"
              >
                Manage Opportunities
              </a>

              <a
                href="#statistics"
                className="volunteer-cta-secondary"
              >
                View Statistics
              </a>
            </div>
          </div>
        </section>
      </main>

      {selectedOpportunity && (
        <div
          className="event-modal-overlay"
          onClick={() => {
            setSelectedOpportunity(null);
            setRegisterMessage("");
          }}
        >
          <div
            className="event-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedOpportunity.image_url && (
              <img
                src={selectedOpportunity.image_url}
                alt={selectedOpportunity.opportunity}
                className="event-modal-image"
              />
            )}

            <div className="event-modal-content">
              <span className="volunteer-label">
                {selectedOpportunity.category}
              </span>

              <h2>{selectedOpportunity.opportunity}</h2>

              <p className="event-organization">
                Organized by {selectedOpportunity.organization}
              </p>

              <p>
                {selectedOpportunity.description}
              </p>

              <div className="event-details">
                <div>
                  <strong>Date</strong>
                  <span>
                    {formatDate(
                      selectedOpportunity.eventDate
                    )}
                  </span>
                </div>

                <div>
                  <strong>Time</strong>
                  <span>
                    {formatTime(
                      selectedOpportunity.startTime
                    )}{" "}
                    -{" "}
                    {formatTime(
                      selectedOpportunity.endTime
                    )}
                  </span>
                </div>

                <div>
                  <strong>Location</strong>
                  <span>{selectedOpportunity.location}</span>
                </div>

                <div>
                  <strong>Registration Deadline</strong>
                  <span>{selectedOpportunity.deadline}</span>
                </div>

                <div>
                  <strong>Volunteers</strong>
                  <span>
                    {selectedOpportunity.applicants}
                    {selectedOpportunity.capacity > 0
                      ? ` / ${selectedOpportunity.capacity}`
                      : ""}
                  </span>
                </div>
              </div>

              {registerMessage && (
                <div className="registration-message">
                  {registerMessage}
                </div>
              )}

              <div className="event-modal-actions">
                {selectedOpportunity.status === "Open" && (
                  <button
                    className="volunteer-primary-btn"
                    onClick={() =>
                      handleRegister(selectedOpportunity.id)
                    }
                    disabled={registering}
                  >
                    {registering
                      ? "Registering..."
                      : "Register for Event"}
                  </button>
                )}

                <button
                  className="volunteer-secondary-btn"
                  onClick={() => {
                    setSelectedOpportunity(null);
                    setRegisterMessage("");
                  }}
                >
                  Close
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
