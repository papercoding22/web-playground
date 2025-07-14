import React, { useEffect } from "react";

// Type definitions
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface InputProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error";
  className?: string;
}

interface AlertProps {
  children: React.ReactNode;
  variant?: "error" | "warning" | "success";
  className?: string;
}

// Reusable UI Components
const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 ${className}`}
  >
    {children}
  </div>
);

const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  onChange,
  className = "",
}) => (
  <input
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none ${className}`}
  />
);

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  className = "",
}) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

const Alert: React.FC<AlertProps> = ({
  children,
  variant = "error",
  className = "",
}) => {
  const variants = {
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    success: "bg-green-50 border-green-200 text-green-800",
  };

  return (
    <div
      className={`border-l-4 p-4 rounded-r-lg ${variants[variant]} ${className}`}
    >
      {children}
    </div>
  );
};

// Mock API function with proper typing
const fakeGetName = (input: string, delay: number): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Guest: ${input}`);
    }, delay);
  });
};

const RaceConditionExample: React.FC = () => {
  const [input, setInput] = React.useState<string>("");
  const [guest, setGuest] = React.useState<string>("");
  const [log, setLog] = React.useState<string[]>([]);
  const [isRaceCondition, setIsRaceCondition] = React.useState<boolean>(false);

  useEffect(() => {
    if (!input) return;
    const delay = Math.random() * 2000 + 500;
    const logMessage = `Fetching name for "${input}" with delay ${Math.round(
      delay
    )}ms`;
    setLog((prev) => [...prev, logMessage]);
    fakeGetName(input, delay).then((name: string) => {
      setGuest(name);
    });
  }, [input]);

  useEffect(() => {
    const lastLog = log[log.length - 1];
    if (lastLog && lastLog.includes("Fetching name for")) {
      const currentName = guest;
      const expectedName = lastLog.split('"')[1];
      if (currentName !== `Guest: ${expectedName}`) {
        setIsRaceCondition(true);
      } else {
        setIsRaceCondition(false);
      }
    }
  }, [guest, log]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInput(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🎉 Who's Coming to the Party?
          </h1>
          <p className="text-gray-600">
            Type a name to see the race condition in action
          </p>
        </div>

        {/* Main Input Card */}
        <Card>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Guest Name
              </label>
              <Input
                placeholder="Type a name..."
                value={input}
                onChange={handleInputChange}
              />
            </div>

            {/* Guest Display */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🧑‍💼</span>
                <div>
                  <p className="text-2xl font-semibold text-gray-800">
                    {guest || "Waiting for a name..."}
                  </p>
                  <p className="text-sm text-gray-500">
                    The guest name might change if you type quickly!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Race Condition Alert */}
        {isRaceCondition && (
          <Alert variant="error">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🚨</span>
              <span className="font-semibold">Race Condition Detected!</span>
            </div>
            <p className="mt-1 text-sm">
              The displayed name doesn't match the last request due to async
              timing issues.
            </p>
          </Alert>
        )}

        {/* Log Card */}
        <Card>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl">📝</span>
              <h3 className="text-lg font-semibold text-gray-800">
                Request Log
              </h3>
              <Badge variant="default">{log.length} requests</Badge>
            </div>

            {log.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No requests yet. Start typing to see the log!</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {log.map((message: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-200"
                  >
                    <span className="text-blue-500 font-mono text-sm mt-0.5">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm text-gray-700 font-mono">
                      {message}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Status Footer */}
        <div className="text-center">
          <div className="flex justify-center space-x-4">
            <Badge variant={isRaceCondition ? "error" : "success"}>
              {isRaceCondition ? "Race Condition Active" : "No Race Condition"}
            </Badge>
            <Badge variant="default">{log.length} total requests</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaceConditionExample;
