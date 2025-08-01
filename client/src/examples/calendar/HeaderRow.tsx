const HeaderRow = ({ days }: { days: string[] }) => {
  return (
    <div className="grid grid-cols-8 border-b border-b-gray-300">
      {/* Column Time */}
      <div className="p-4 bg-gray-100 font-medium">Time</div>
      {/* 7 Columns of Day */}
      {days.map((day) => (
        <div
          key={day}
          className="p-4 bg-gray-100 font-medium text-center border-l border-l-gray-300"
        >
          {day}
        </div>
      ))}
    </div>
  );
};

export default HeaderRow;
