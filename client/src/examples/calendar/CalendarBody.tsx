import DayColumn from "./DayColumn";
import type { Appointment } from "./models";
import TimeColumn from "./TimeColumn";

interface CalendarBodyProps {
  hours: number[];
  days: string[];
  appointments: Appointment[];
}

const CalendarBody: React.FC<CalendarBodyProps> = ({
  hours,
  days,
  appointments,
}) => {
  return (
    <div className="grid grid-cols-8 relative">
      <TimeColumn hours={hours} />
      <DayColumn appointments={appointments} hours={hours} days={days} />
    </div>
  );
};

export default CalendarBody;
