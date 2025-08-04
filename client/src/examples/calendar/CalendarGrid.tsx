import CalendarBody from "./CalendarBody";
import HeaderRow from "./HeaderRow";
import type { CalendarEvent } from "./models";

// CalendarGrid Component
interface CalendarGridProps {
  days: string[];
  hours: number[];
  events: CalendarEvent[];
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ days, hours, events }) => {
  return (
    <>
      {/* Header with days */}
      <HeaderRow days={days} />
      <CalendarBody events={events} days={days} hours={hours} />
    </>
  );
};

export default CalendarGrid;
