import { HOUR_HEIGHT } from "./models";
import { formatTime } from "./utilts";

interface TimeColumnProps {
  hours: number[];
}

const TimeColumn: React.FC<TimeColumnProps> = ({ hours }) => {
  return (
    <div className="bg-gray-50">
      {hours.map((hour) => (
        <div
          key={hour}
          className="h-15 px-4 py-2 text-sm text-gray-600 border-b flex items-start border-b-gray-300"
          style={{
            height: `${HOUR_HEIGHT}px`,
          }}
        >
          {formatTime(hour)}
        </div>
      ))}
    </div>
  );
};

export default TimeColumn;
