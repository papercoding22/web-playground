import { Home } from "lucide-react";
import type { CalendarEvent, DayCenterEvent } from "./models";
import { getBasicEventStyle } from "./utilts";

// Day Center Event Component
interface DayCenterEventProps {
  eventsInDay: CalendarEvent[];
  dayCenterEvent: DayCenterEvent;
}

const DayCenterEventCard: React.FC<DayCenterEventProps> = ({
  eventsInDay,
  dayCenterEvent,
}) => {
  // Check if there are appointments on the same day
  const hasAppointments = eventsInDay.some(
    (event) => event.type === "appointment" && event.id !== dayCenterEvent.id
  );

  const style = getBasicEventStyle(eventsInDay, dayCenterEvent);

  // Adjust width if there are appointments
  const adjustedStyle = hasAppointments
    ? {
        ...style,
        width: "32px", // Narrow width when appointments are present
        left: "4px",
      }
    : style;

  return (
    <div
      className="absolute bg-blue-100 border border-blue-200 rounded-md p-3 text-blue-700 cursor-pointer hover:bg-blue-150 transition-colors"
      style={adjustedStyle}
    >
      <div className="flex items-center gap-2">
        <Home className="w-4 h-4 flex-shrink-0" />
        {!hasAppointments && (
          <div className="flex flex-col">
            <span className="text-sm font-medium">{dayCenterEvent.title}</span>
            <span className="text-xs opacity-80">
              {dayCenterEvent.timeRange}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DayCenterEventCard;
