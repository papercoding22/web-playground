import DayColumn from "./DayColumn";
import type { CalendarEvent } from "./models";
import TimeColumn from "./TimeColumn";

// CalendarBody Component
interface CalendarBodyProps {
  hours: number[];
  days: string[];
  events: CalendarEvent[];
}

const CalendarBody: React.FC<CalendarBodyProps> = ({ hours, days, events }) => {
  return (
    <div className="grid grid-cols-8 relative">
      <TimeColumn hours={hours} />
      <DayColumn events={events} hours={hours} days={days} />
    </div>
  );
};

export default CalendarBody;
