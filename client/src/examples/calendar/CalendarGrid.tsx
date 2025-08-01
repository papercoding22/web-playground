import CalendarBody from "./CalendarBody";
import HeaderRow from "./HeaderRow";
import type { Appointment } from "./models";

interface CalendarGridProps {
  days: string[];
  hours: number[];
  appointments: Appointment[];
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  days,
  hours,
  appointments,
}) => {
  return (
    <>
      {/* Header with days */}
      <HeaderRow days={days} />
      <CalendarBody appointments={appointments} days={days} hours={hours} />
    </>
  );
};

export default CalendarGrid;
