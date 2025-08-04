// HeaderRow Component
interface HeaderRowProps {
  days: string[];
}

const HeaderRow: React.FC<HeaderRowProps> = ({ days }) => {
  return (
    <div className="grid grid-cols-8 border-b border-gray-200">
      {/* Column Time */}
      <div className="p-4 bg-white font-medium"></div>
      {/* 7 Columns of Day */}
      {days.map((day) => (
        <div
          key={day}
          className="p-4 bg-white font-medium text-center border-l border-gray-200"
        >
          {day}
        </div>
      ))}
    </div>
  );
};

export default HeaderRow;
