import React from "react";
import { HOUR_HEIGHT, type Appointment, type CalendarEvent } from "./models";
import { formatTime, getBasicEventStyle } from "./utilts";

// Appointment Component
interface AppointmentProps {
  eventsInDay: CalendarEvent[];
  appointment: Appointment;
}

const AppointmentCard: React.FC<AppointmentProps> = ({
  eventsInDay,
  appointment,
}) => {
  const isPending = appointment.status === "pending";

  // Different styling based on status
  const statusClasses = isPending
    ? "bg-white border-2 border-blue-500 text-blue-600"
    : `${appointment.color} text-white`;

  const hoverClasses = isPending
    ? "hover:border-blue-600 hover:bg-blue-50"
    : "hover:shadow-md";

  const mainStyle = getBasicEventStyle(eventsInDay, appointment);

  return (
    <>
      {/* Buffer Before */}
      {appointment.hasBuffer && appointment.bufferBefore && (
        <div
          className="absolute"
          style={{
            ...mainStyle,
            height: `${(appointment.bufferBefore / 60) * HOUR_HEIGHT}px`,
            top: `${
              parseFloat(mainStyle.top as string) -
              (appointment.bufferBefore / 60) * HOUR_HEIGHT
            }px`,
            background:
              "repeating-linear-gradient(45deg, #dbeafe, #dbeafe 4px, transparent 4px, transparent 8px)",
            borderRadius: "6px",
            opacity: 0.7,
          }}
        />
      )}

      {/* Main Appointment */}
      <div
        className={`${statusClasses} ${hoverClasses} p-2 rounded-md cursor-pointer shadow-sm transition-all overflow-hidden relative z-10`}
        style={mainStyle}
      >
        <div className="font-medium text-xs truncate">{appointment.title}</div>
        {appointment.jobId && (
          <div className="text-xs opacity-90">{appointment.jobId}</div>
        )}
        <div className="text-xs opacity-75">
          {formatTime(appointment.startTime)}-
          {formatTime(appointment.startTime + appointment.duration / 60)}
        </div>
      </div>

      {/* Buffer After */}
      {appointment.hasBuffer && appointment.bufferAfter && (
        <div
          className="absolute"
          style={{
            ...mainStyle,
            height: `${(appointment.bufferAfter / 60) * HOUR_HEIGHT}px`,
            top: `${
              parseFloat(mainStyle.top as string) +
              parseFloat(mainStyle.height as string)
            }px`,
            background:
              "repeating-linear-gradient(45deg, #dbeafe, #dbeafe 4px, transparent 4px, transparent 8px)",
            borderRadius: "6px",
            opacity: 0.7,
          }}
        />
      )}
    </>
  );
};

export default AppointmentCard;
