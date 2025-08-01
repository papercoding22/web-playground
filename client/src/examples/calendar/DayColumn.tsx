import Appointment from "./Appointment";
import { HOUR_HEIGHT, type Appointment as AppointmentType } from "./models";

interface DayColumnProps {
  days: string[];
  hours: number[];
  appointments: AppointmentType[];
}

const DayColumn: React.FC<DayColumnProps> = ({ days, hours, appointments }) => {
  return (
    <>
      {days.map((day, dayIndex) => (
        <div
          key={`${day}-${dayIndex}`}
          className="border-l border-l-gray-300  relative"
        >
          {/* Hour Slot */}
          {hours.map((hour) => (
            <div
              key={`${day}-${hour}`}
              className="border-b border-b-gray-300 hover:bg-blue-50 cursor-pointer transition-colors"
              style={{ height: `${HOUR_HEIGHT}px` }}
            ></div>
          ))}

          {/* Appointments for this day */}
          {appointments
            .filter((apt) => apt.day === dayIndex)
            .map((apt) => (
              <Appointment
                key={`${apt.id}`}
                appointmentInDays={appointments.filter(
                  (apt) => apt.day === dayIndex
                )}
                appointment={apt}
              />
            ))}
        </div>
      ))}
    </>
  );
};

export default DayColumn;
