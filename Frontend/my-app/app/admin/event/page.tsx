"use client";

import { useState } from "react";
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
}

export default function EventsAdmin() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      name: "Awareness Outreach",
      organization: "Community Hope NGO",
      date: "September 12, 2026",
      time: "9:00 AM - 2:00 PM",
      location: "Lagos",
      volunteers: 24,
      capacity: 50,
      status: "Upcoming",
      category: "Community",
    },
    {
      id: 2,
      name: "Medical Outreach",
      organization: "Health For All",
      date: "September 15, 2026",
      time: "10:00 AM - 4:00 PM",
      location: "Abuja",
      volunteers: 40,
      capacity: 40,
      status: "Full",
      category: "Healthcare",
    },
    {
      id: 3,
      name: "Education For All",
      organization: "Future Generation",
      date: "September 20, 2026",
      time: "8:00 AM - 1:00 PM",
      location: "Lagos",
      volunteers: 12,
      capacity: 30,
      status: "Upcoming",
      category: "Education",
    },
    {
      id: 4,
      name: "Stop Hunger Campaign",
      organization: "Save Lives Initiative",
      date: "August 20, 2026",
      time: "9:00 AM - 3:00 PM",
      location: "Lagos",
      volunteers: 60,
      capacity: 60,
      status: "Completed",
      category: "Community",
    },
    {
      id: 5,
      name: "Environmental Cleanup",
      organization: "Green Earth NGO",
      date: "September 25, 2026",
      time: "8:00 AM - 12:00 PM",
      location: "Port Harcourt",
      volunteers: 18,
      capacity: 40,
      status: "Pending",
      category: "Environment",
    },
  ]);

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(search.toLowerCase()) ||
      event.organization.toLowerCase().includes(search.toLowerCase()) ||
      event.location.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || event.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const deleteEvent = (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (confirmDelete) {
      setEvents(events.filter((event) => event.id !== id));
    }
  };

  const approveEvent = (id: number) => {
    setEvents(
      events.map((event) =>
        event.id === id
          ? { ...event, status: "Upcoming" }
          : event
      )
    );
  };

  return (
    <>
      <Header />

      <main className="events-admin">

        {/* PAGE HEADER */}
        <section className="events-header">

          <div>
            <p className="admin-label">ADMINISTRATION</p>

            <h1>Events Management</h1>

            <p>
              Create, monitor, review, and manage all events
              available on the ARMSLENGTH platform.
            </p>
          </div>

          <button
            className="create-event-btn"
            onClick={() => setShowCreateEvent(true)}
          >
            + Create Event
          </button>

        </section>


        {/* STATISTICS */}
        <section className="event-statistics">

          <div className="event-stat-card">
            <p>Total Events</p>
            <h2>{events.length}</h2>
            <span>All platform events</span>
          </div>

          <div className="event-stat-card">
            <p>Upcoming</p>
            <h2>
              {events.filter((event) => event.status === "Upcoming").length}
            </h2>
            <span>Upcoming events</span>
          </div>

          <div className="event-stat-card">
            <p>Pending</p>
            <h2>
              {events.filter((event) => event.status === "Pending").length}
            </h2>
            <span>Awaiting approval</span>
          </div>

          <div className="event-stat-card">
            <p>Completed</p>
            <h2>
              {events.filter((event) => event.status === "Completed").length}
            </h2>
            <span>Completed events</span>
          </div>

        </section>


        {/* QUICK ACTIONS */}
        <section className="quick-actions">

          <h2>Quick Actions</h2>

          <div className="quick-action-grid">

            <button onClick={() => setShowCreateEvent(true)}>
              <strong>+ Create Event</strong>
              <span>Create a new platform event</span>
            </button>

            <Link href="/organizations">
              <strong>Organizations</strong>
              <span>View event organizations</span>
            </Link>

            <Link href="/volunteers">
              <strong>Volunteers</strong>
              <span>View registered volunteers</span>
            </Link>

            <Link href="/applications">
              <strong>Applications</strong>
              <span>Review applications</span>
            </Link>

          </div>

        </section>


        {/* EVENTS MANAGEMENT */}
        <section className="events-management">

          <div className="section-heading">

            <div>
              <p className="admin-label">EVENT DATABASE</p>
              <h2>Manage Events</h2>
            </div>

            <span>
              {filteredEvents.length} event(s)
            </span>

          </div>


          {/* SEARCH AND FILTER */}
          <div className="event-filters">

            <input
              type="text"
              placeholder="Search events, organizations or locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Pending">Pending</option>
              <option value="Full">Full</option>
              <option value="Completed">Completed</option>
            </select>

          </div>


          {/* EVENT TABLE */}
          <div className="event-table-container">

            <table className="event-table">

              <thead>
                <tr>
                  <th>Event</th>
                  <th>Organization</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Volunteers</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredEvents.map((event) => (

                  <tr key={event.id}>

                    <td>
                      <div className="event-name">
                        <strong>{event.name}</strong>
                        <span>{event.category}</span>
                      </div>
                    </td>

                    <td>{event.organization}</td>

                    <td>
                      <div>
                        {event.date}
                        <small>{event.time}</small>
                      </div>
                    </td>

                    <td>{event.location}</td>

                    <td>
                      <div className="volunteer-count">
                        <strong>
                          {event.volunteers}
                        </strong>

                        <span>
                          / {event.capacity}
                        </span>
                      </div>

                      <div className="progress-bar">
                        <div
                          style={{
                            width: `${Math.min(
                              (event.volunteers / event.capacity) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </td>

                    <td>
                      <span
                        className={`event-status ${event.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {event.status}
                      </span>
                    </td>

                    <td>

                      <div className="event-actions">

                        <Link href={`/events/${event.id}`}>
                          View
                        </Link>

                        <button>
                          Edit
                        </button>

                        {event.status === "Pending" && (
                          <button
                            onClick={() => approveEvent(event.id)}
                          >
                            Approve
                          </button>
                        )}

                        <button
                          className="delete-btn"
                          onClick={() => deleteEvent(event.id)}
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>


            {filteredEvents.length === 0 && (
              <div className="no-events">
                <h3>No events found</h3>
                <p>
                  Try changing your search or filter.
                </p>
              </div>
            )}

          </div>

        </section>


        {/* CREATE EVENT MODAL */}
        {showCreateEvent && (

          <div className="modal-overlay">

            <div className="create-event-modal">

              <div className="modal-header">

                <div>
                  <p className="admin-label">EVENT MANAGEMENT</p>
                  <h2>Create New Event</h2>
                </div>

                <button
                  className="close-modal"
                  onClick={() => setShowCreateEvent(false)}
                >
                  ×
                </button>

              </div>


              <form>

                <div className="form-group">
                  <label>Event Name</label>
                  <input
                    type="text"
                    placeholder="Enter event name"
                  />
                </div>


                <div className="form-row">

                  <div className="form-group">
                    <label>Organization</label>
                    <input
                      type="text"
                      placeholder="Organization name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Category</label>

                    <select>
                      <option>Community</option>
                      <option>Healthcare</option>
                      <option>Education</option>
                      <option>Environment</option>
                      <option>Other</option>
                    </select>
                  </div>

                </div>


                <div className="form-row">

                  <div className="form-group">
                    <label>Date</label> 
                    <input type="date" />
                  </div>

                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      placeholder="Event location"
                    />
                  </div>

                </div>


                <div className="form-row">

                  <div className="form-group">
                    <label>Start Time</label>
                    <input type="time" />
                  </div>

                  <div className="form-group">
                    <label>End Time</label>
                    <input type="time" />
                  </div>

                </div>


                <div className="form-row">

                  <div className="form-group">
                    <label>Maximum Volunteers</label>
                    <input
                      type="number"
                      placeholder="50"
                    />
                  </div>

                  <div className="form-group">
                    <label>Registration Deadline</label>
                    <input type="date" />
                  </div>

                </div>


                <div className="form-group">
                  <label>Event Description</label>

                  <textarea
                    placeholder="Describe the event..."
                    rows={5}
                  />
                </div>


                <div className="modal-actions">

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowCreateEvent(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="save-event-btn"
                  >
                    Create Event
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