import React from "react";
import type { Appointment } from "./models";
import { formatTime, getBasicAppointmentStyle } from "./utilts";

interface AppointmentProps {
  appointmentInDays: Appointment[];
  appointment: Appointment;
}

const Appointment: React.FC<AppointmentProps> = ({
  appointmentInDays,
  appointment,
}) => {
  return (
    <div
      className={`${appointment.color} text-white p-2 rounded-md cursor-pointer shadow-sm hover:shadow-md transition-shadow border border-white/20 overflow-hidden`}
      style={getBasicAppointmentStyle(appointmentInDays, appointment)}
    >
      <div className="font-medium text-xs truncate">{appointment.title}</div>
      <div className="text-xs opacity-90">
        {formatTime(appointment.startTime)}
      </div>
      <div className="text-xs opacity-75">{appointment.duration}min</div>
    </div>
  );
};

export default Appointment;
