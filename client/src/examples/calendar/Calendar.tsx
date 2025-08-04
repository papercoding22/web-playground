import CalendarGrid from "./CalendarGrid";
import { START_HOUR, TOTAL_HOURS, type CalendarEvent } from "./models";

// Sample appointment data with overlapping appointments
// Sample Data
const sampleEvents: CalendarEvent[] = [
  // Day Center event on Monday (full day)
  {
    id: 1,
    type: "dayCenter",
    title: "Day center",
    timeRange: "8am-5pm",
    startTime: 8, // 8:00 AM
    duration: 540, // 9 hours (8am to 5pm)
    day: 0, // Monday
  },
  {
    id: 2,
    type: "appointment",
    title: "Telehealth",
    jobId: "JOB-123",
    startTime: 9, // 9:00 AM
    duration: 60, // 60 minutes
    day: 1, // Tuesday
    color: "bg-blue-600",
    status: "ready",
  },
  {
    id: 3,
    type: "ride",
    rideType: "pickup",
    startTime: 9, // 9:00 AM
    duration: 30, // 30 minutes
    day: 2, // Wednesday
  },
  {
    id: 4,
    type: "appointment",
    title: "On-site visit",
    jobId: "JOB-124",
    startTime: 10, // 10:00 AM
    duration: 60, // 60 minutes
    day: 2, // Wednesday
    color: "bg-blue-600",
    status: "ready",
  },
  {
    id: 5,
    type: "appointment",
    title: "On-site visit",
    jobId: "JOB-125",
    startTime: 12, // 12:00 PM
    duration: 60, // 60 minutes
    day: 2, // Wednesday
    color: "bg-blue-600",
    status: "ready",
    hasBuffer: true,
    bufferBefore: 15, // 15 minutes before
    bufferAfter: 15, // 15 minutes after
  },
  {
    id: 6,
    type: "ride",
    rideType: "dropoff",
    startTime: 13.5, // 1:30 PM
    duration: 30, // 30 minutes
    day: 2, // Wednesday
  },
  {
    id: 7,
    type: "appointment",
    title: "On-site visit",
    jobId: "JOB-126",
    startTime: 10, // 10:00 AM
    duration: 60, // 60 minutes
    day: 4, // Friday
    color: "bg-blue-600",
    status: "pending",
  },
  {
    id: 8,
    type: "appointment",
    title: "On-site visit",
    jobId: "JOB-127",
    startTime: 13, // 1:00 PM
    duration: 60, // 60 minutes
    day: 4, // Friday
    color: "bg-blue-600",
    status: "pending",
  },
  // Day Center with appointments on the same day (Saturday)
  {
    id: 9,
    type: "dayCenter",
    title: "Day center",
    timeRange: "8am-5pm",
    startTime: 8, // 8:00 AM
    duration: 540, // 9 hours
    day: 5, // Saturday
  },
  {
    id: 10,
    type: "appointment",
    title: "Team Standup",
    startTime: 10, // 10:00 AM
    duration: 60, // 60 minutes
    day: 5, // Saturday
    color: "bg-blue-600",
    status: "ready",
  },
  {
    id: 11,
    type: "appointment",
    title: "Project Review",
    startTime: 10.5, // 10:30 AM (overlaps with standup)
    duration: 90, // 90 minutes
    day: 5, // Saturday
    color: "bg-red-500",
    status: "pending",
  },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: TOTAL_HOURS }, (_, i) => START_HOUR + i);
const Calendar = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <CalendarGrid hours={hours} days={days} events={sampleEvents} />
        </div>
      </div>
    </div>
  );
};

export default Calendar;
