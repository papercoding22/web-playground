import AppointmentCard from "./Appointment";
import DayCenterEventCard from "./DayCenterEvent";
import type { CalendarEvent } from "./models";
import RideEventCard from "./RideEvent";

// Event Renderer Component
interface EventRendererProps {
  eventsInDay: CalendarEvent[];
}

const EventRenderer: React.FC<EventRendererProps> = ({ eventsInDay }) => {
  return (
    <>
      {eventsInDay.map((event) => {
        switch (event.type) {
          case "appointment":
            return (
              <AppointmentCard
                key={event.id}
                eventsInDay={eventsInDay}
                appointment={event}
              />
            );
          case "ride":
            return (
              <RideEventCard
                key={event.id}
                eventsInDay={eventsInDay}
                rideEvent={event}
              />
            );
          case "dayCenter":
            return (
              <DayCenterEventCard
                key={event.id}
                eventsInDay={eventsInDay}
                dayCenterEvent={event}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
};

export default EventRenderer;
