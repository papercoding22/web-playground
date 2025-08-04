// Models and Types
interface BaseEvent {
  id: number;
  startTime: number;
  duration: number;
  day: number;
}

interface Appointment extends BaseEvent {
  type: "appointment";
  title: string;
  color: string;
  status: "pending" | "ready";
  jobId?: string;
  hasBuffer?: boolean;
  bufferBefore?: number; // in minutes
  bufferAfter?: number; // in minutes
}

interface RideEvent extends BaseEvent {
  type: "ride";
  rideType: "pickup" | "dropoff";
}

interface DayCenterEvent extends BaseEvent {
  type: "dayCenter";
  title: string;
  timeRange: string; // e.g., "8am-5pm"
}

type CalendarEvent = Appointment | RideEvent | DayCenterEvent;

export type { Appointment, RideEvent, DayCenterEvent, CalendarEvent };
