import CalendarGrid from "./CalendarGrid";
import { START_HOUR, TOTAL_HOURS, type Appointment } from "./models";

// Sample appointment data with overlapping appointments
const sampleAppointments: Appointment[] = [
  {
    id: 1,
    title: "Meeting with John",
    startTime: 9.5, // 9:30 AM
    duration: 60, // 60 minutes
    day: 1, // Monday
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "Doctor Appointment",
    startTime: 14, // 2:00 PM
    duration: 90, // 90 minutes
    day: 1, // Monday
    color: "bg-green-500",
  },
  // Overlapping appointments on Tuesday
  {
    id: 3,
    title: "Team Standup",
    startTime: 10, // 10:00 AM
    duration: 60, // 60 minutes
    day: 2, // Tuesday
    color: "bg-purple-500",
  },
  {
    id: 4,
    title: "Project Review",
    startTime: 10.5, // 10:30 AM (overlaps with standup)
    duration: 90, // 90 minutes
    day: 2, // Tuesday
    color: "bg-red-500",
  },
  {
    id: 5,
    title: "Quick Call",
    startTime: 11, // 11:00 AM (overlaps with both above)
    duration: 30, // 30 minutes
    day: 2, // Tuesday
    color: "bg-yellow-500",
  },
  // More overlapping on Wednesday
  {
    id: 6,
    title: "Client Call",
    startTime: 15.5, // 3:30 PM
    duration: 45, // 45 minutes
    day: 3, // Wednesday
    color: "bg-orange-500",
  },
  {
    id: 7,
    title: "Team Sync",
    startTime: 15.75, // 3:45 PM (15 min overlap)
    duration: 60, // 60 minutes
    day: 3, // Wednesday
    color: "bg-indigo-500",
  },
  {
    id: 8,
    title: "Lunch Meeting",
    startTime: 12, // 12:00 PM
    duration: 60, // 60 minutes
    day: 4, // Thursday
    color: "bg-pink-500",
  },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: TOTAL_HOURS }, (_, i) => START_HOUR + i);
const Calendar = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <CalendarGrid
            hours={hours}
            days={days}
            appointments={sampleAppointments}
          />
        </div>
      </div>
    </div>
  );
};

export default Calendar;
