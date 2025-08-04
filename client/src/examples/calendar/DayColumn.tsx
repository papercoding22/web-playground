import EventRenderer from "./EventRenderer";
import { HOUR_HEIGHT, type CalendarEvent } from "./models";

// DayColumn Component
interface DayColumnProps {
  days: string[];
  hours: number[];
  events: CalendarEvent[];
}

const DayColumn: React.FC<DayColumnProps> = ({ days, hours, events }) => {
  return (
    <>
      {days.map((day, dayIndex) => (
        <div
          key={`${day}-${dayIndex}`}
          className="border-l border-l-gray-300 relative"
        >
          {/* Hour Slot */}
          {hours.map((hour) => (
            <div
              key={`${day}-${hour}`}
              className="border-b border-b-gray-300 hover:bg-blue-50 cursor-pointer transition-colors"
              style={{ height: `${HOUR_HEIGHT}px` }}
            ></div>
          ))}

          {/* Events for this day */}
          <EventRenderer
            eventsInDay={events.filter((event) => event.day === dayIndex)}
          />
        </div>
      ))}
    </>
  );
};

export default DayColumn;
