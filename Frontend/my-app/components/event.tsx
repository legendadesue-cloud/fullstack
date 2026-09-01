import  ImageCard  from "@/components/imageCard";
import { events } from "@/src/event";

export default function Events() {
  return (
    <div className="events-container">
      {events.map((event) => (
        <div
          key={event.id}
          className="event-card"
          data-status={event.status}
        >
          <ImageCard
            src={event.image}
            alt={event.alt}
          />

          <span className={`status ${event.status}`}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
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

          <p>{event.description}</p>

          <button disabled={event.disabled}>
            {event.buttonText}
          </button>
        </div>
      ))}
    </div>
  );
}