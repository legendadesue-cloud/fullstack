"use client";

import { useEffect, useState } from "react";
import Header from "@/components/header";
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
  image_url: string;
  status: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([]);
  const [registeringEvents, setRegisteringEvents] = useState<number[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/events`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await response.json();

        console.log("Events:", data);

        setEvents(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");

    const date = new Date();
    date.setHours(Number(hours), Number(minutes));

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const registerForEvent = async (eventId: number) => {
    try {
      const storedUser = sessionStorage.getItem("loggedInUser");

      if (!storedUser) {
        alert("Please log in before registering for an event.");
        return;
      }

      const user = JSON.parse(storedUser);

      if (!user.id) {
        alert("Unable to identify your account. Please log in again.");
        return;
      }

      if (registeredEvents.includes(eventId)) {
        alert("You have already registered for this event.");
        return;
      }

      if (registeringEvents.includes(eventId)) {
        return;
      }

      setRegisteringEvents((current) => [...current, eventId]);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventId}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            volunteer_id: user.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "Already registered") {
          setRegisteredEvents((current) =>
            current.includes(eventId)
              ? current
              : [...current, eventId]
          );

          alert("You have already registered for this event.");
        } else {
          alert(data.error || "Failed to register.");
        }

        return;
      }

      setRegisteredEvents((current) =>
        current.includes(eventId)
          ? current
          : [...current, eventId]
      );

      alert(data.message || "Successfully registered for the event.");

      setEvents((currentEvents) =>
        currentEvents.map((event) =>
          event.id === eventId
            ? {
                ...event,
                volunteers: event.volunteers + 1,
              }
            : event
        )
      );
    } catch (error) {
      console.error("Registration error:", error);
      alert("Unable to register for this event.");
    } finally {
      setRegisteringEvents((current) =>
        current.filter((eventIdValue) => eventIdValue !== eventId)
      );
    }
  };

  return (
    <>
      <Header />

      <main className="events-page">
        <section className="events-header">
          <h1>Volunteer Events</h1>
          <p>Find an event and make a difference in your community.</p>
        </section>

        {loading && (
          <p className="events-message">
            Loading events...
          </p>
        )}

        {error && (
          <p className="events-message error">
            {error}
          </p>
        )}

        {!loading && !error && events.length === 0 && (
          <p className="events-message">
            No events available.
          </p>
        )}

        <section className="events-grid">
          {events.map((event) => {
            const isRegistered = registeredEvents.includes(event.id);
            const isRegistering = registeringEvents.includes(event.id);

            return (
              <article className="event-card" key={event.id}>
                <div className="event-image">
                  <img
                    src={event.image_url}
                    alt={event.name}
                  />
                </div>

                <div className="event-content">
                  <span className="event-category">
                    {event.category}
                  </span>

                  <h2>{event.name}</h2>

                  <p className="event-organization">
                    <strong>Organization:</strong>{" "}
                    {event.organization}
                  </p>

                  <p>
                    <strong>Date:</strong>{" "}
                    {formatDate(event.event_date)}
                  </p>

                  <p>
                    <strong>Location:</strong>{" "}
                    {event.location}
                  </p>

                  <p>
                    <strong>Time:</strong>{" "}
                    {formatTime(event.start_time)} -{" "}
                    {formatTime(event.end_time)}
                  </p>

                  <p>
                    <strong>Capacity:</strong>{" "}
                    {event.capacity}
                  </p>

                  <p>
                    <strong>Volunteers:</strong>{" "}
                    {event.volunteers}
                  </p>

                  <p>
                    <strong>Registration Deadline:</strong>{" "}
                    {formatDate(event.registration_deadline)}
                  </p>

                  <p className="event-description">
                    {event.description}
                  </p>

                  <div className="event-footer">
                    <span
                      className={`event-status ${event.status.toLowerCase()}`}
                    >
                      {event.status}
                    </span>

                    <button
                      className="register-button"
                      onClick={() => registerForEvent(event.id)}
                      disabled={isRegistered || isRegistering}
                    >
                      {isRegistered
                        ? "Already Registered"
                        : isRegistering
                        ? "Registering..."
                        : "Register"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </main>

      <Footer />
    </>
  );
}