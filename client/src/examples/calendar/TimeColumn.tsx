import { HOUR_HEIGHT } from "./models";
import { formatTime } from "./utilts";

interface TimeColumnProps {
  hours: number[];
}

const TimeColumn: React.FC<TimeColumnProps> = ({ hours }) => {
  return (
    <div className="bg-white relative">
      {hours.map((hour) => (
        <div
          key={hour}
          className="border-b border-gray-200 relative"
          style={{
            height: `${HOUR_HEIGHT}px`,
          }}
        >
          {/* Time label positioned at the top of each hour line */}
          <div className="absolute -top-2 left-2 text-xs text-gray-600 bg-white px-1">
            {formatTime(hour)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimeColumn;
