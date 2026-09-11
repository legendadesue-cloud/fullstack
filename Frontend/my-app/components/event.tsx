import ImageCard from "@/components/imageCard";
import { events } from "@/src/event";
import Link from "next/link";

export default function Events() {
  return (
    <div className="events-container">
      {events.map((event) => (
        <div
          key={event.id}
          className="event-card"
          data-status={event.status}
        >
          <div className="event-image">
            <ImageCard
              src={event.image}
              alt={event.alt}
            />
          </div>

          <div className="event-content">
            <span className={`status ${event.status}`}>
              {event.status.charAt(0).toUpperCase() +
                event.status.slice(1)}
            </span>

            <h3>{event.title}</h3>

            <p>
              <strong>Category:</strong> {event.category}
            </p>

            <p>
              <strong>Organization:</strong> {event.organization}
            </p>

            <p>
              <strong>Location:</strong> {event.location}
            </p>

            <p>
              <strong>Date:</strong> {event.date}
            </p>

            <p className="event-description">
              {event.description}
            </p>

            <div className="event-actions">
              <Link
                href={`/events/${event.id}`}
                className="event-view-btn"
              >
                View Details
              </Link>

              <button
                className="event-apply-btn"
                disabled={event.disabled}
              >
                {event.disabled ? "Unavailable" : "Apply Now"}
              </button>

              <button
                className="event-save-btn"
                type="button"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}