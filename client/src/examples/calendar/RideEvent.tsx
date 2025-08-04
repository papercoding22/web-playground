import { Car } from "lucide-react";
import type { CalendarEvent, RideEvent } from "./models";
import { getBasicEventStyle } from "./utilts";

interface RideEventProps {
  eventsInDay: CalendarEvent[];
  rideEvent: RideEvent;
}

const RideEventCard: React.FC<RideEventProps> = ({
  eventsInDay,
  rideEvent,
}) => {
  return (
    <div
      className="absolute bg-blue-100 border border-blue-200 rounded-md p-2 text-blue-700 flex items-center gap-2 cursor-pointer hover:bg-blue-150 transition-colors"
      style={getBasicEventStyle(eventsInDay, rideEvent)}
    >
      <Car className="w-4 h-4 flex-shrink-0" />
      <span className="text-sm font-medium">
        {rideEvent.rideType === "pickup" ? "Ride" : "Drop off"}
      </span>
    </div>
  );
};

export default RideEventCard;
