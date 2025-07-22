import { useState } from "react";

// Type definitions
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary" | "warning";
  className?: string;
  disabled?: boolean;
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error";
  className?: string;
}

interface AlertProps {
  children: React.ReactNode;
  variant?: "error" | "warning" | "success" | "info";
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

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
}) => {
  const variants = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white",
    warning: "bg-orange-500 hover:bg-orange-600 text-white",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-3 text-lg font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

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
  variant = "info",
  className = "",
}) => {
  const variants = {
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    success: "bg-green-50 border-green-200 text-green-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  return (
    <div
      className={`border-l-4 p-4 rounded-r-lg ${variants[variant]} ${className}`}
    >
      {children}
    </div>
  );
};

export default function StaleClosureDemo() {
  const [count, setCount] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);

  function announceCount(): void {
    setLogs((prev) => [...prev, `⏳ Will announce count in 2s...`]);
    setTimeout(() => {
      // Captures `count` from THIS render
      setLogs((prev) => [...prev, `📣 Count is: ${count}`]);
    }, 2000);
  }

  const handleIncrement = (): void => {
    setCount((c) => c + 1);
  };

  // Check if there are any stale closures in the logs
  const hasStaleClosures = logs.some((log, index) => {
    if (log.includes("📣 Count is:")) {
      const announcedCount = parseInt(log.split(": ")[1]);
      // Find the corresponding "Will announce" log
      const willAnnounceIndex = logs
        .slice(0, index)
        .findLastIndex((l) => l.includes("⏳ Will announce"));
      if (willAnnounceIndex >= 0) {
        // Count how many increments happened between the announcement and the result
        const incrementsAfter = logs
          .slice(willAnnounceIndex + 1, index)
          .filter((l) => l.includes("Incremented")).length;
        return announcedCount < count - incrementsAfter;
      }
    }
    return false;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🧠 Stale Closure Demo
          </h1>
          <p className="text-gray-600">
            Watch how closures capture values from their creation time
          </p>
        </div>

        {/* Problem Badge */}
        <div className="text-center">
          <Badge variant="warning" className="text-base px-4 py-2">
            ⚠️ Stale Closure Issue
          </Badge>
        </div>

        {/* Counter Card */}
        <Card>
          <div className="space-y-6">
            {/* Count Display */}
            <div className="text-center bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
              <div className="flex items-center justify-center space-x-3">
                <span className="text-3xl">🔢</span>
                <div>
                  <p className="text-4xl font-bold text-gray-800">
                    Count: {count}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Current value in state
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={handleIncrement}
                variant="primary"
                className="flex items-center space-x-2"
              >
                <span>➕</span>
                <span>Increment</span>
              </Button>
              <Button
                onClick={announceCount}
                variant="warning"
                className="flex items-center space-x-2"
              >
                <span>📣</span>
                <span>Announce Count in 2s</span>
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Try clicking increment after announcing to see the stale closure
                effect!
              </p>
            </div>
          </div>
        </Card>

        {/* Stale Closure Alert */}
        {hasStaleClosures && (
          <Alert variant="warning">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🕰️</span>
              <span className="font-semibold">Stale Closure Detected!</span>
            </div>
            <p className="mt-1 text-sm">
              The announced count is stale because the closure captured the
              count value from when the timeout was created.
            </p>
          </Alert>
        )}

        {/* Logs Card */}
        <Card>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🧾</span>
              <h3 className="text-lg font-semibold text-gray-800">
                Event Logs
              </h3>
              <Badge variant="default">{logs.length} events</Badge>
            </div>

            {logs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>
                  No events yet. Click the buttons to see the stale closure
                  effect!
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {logs.map((log: string, index: number) => {
                  const isAnnouncement = log.includes("📣 Count is:");
                  const isWaiting = log.includes("⏳ Will announce");

                  return (
                    <div
                      key={index}
                      className={`flex items-start space-x-3 p-3 rounded-lg border-l-4 ${
                        isAnnouncement
                          ? "bg-orange-50 border-orange-200"
                          : isWaiting
                          ? "bg-yellow-50 border-yellow-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <span
                        className={`font-mono text-sm mt-0.5 ${
                          isAnnouncement
                            ? "text-orange-500"
                            : isWaiting
                            ? "text-yellow-500"
                            : "text-gray-500"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm font-mono text-gray-700">
                        {log}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Card>

        {/* Status Footer */}
        <div className="text-center">
          <div className="flex justify-center space-x-4">
            <Badge variant={hasStaleClosures ? "warning" : "default"}>
              {hasStaleClosures
                ? "Stale Closures Detected"
                : "No Stale Closures Yet"}
            </Badge>
            <Badge variant="default">Current Count: {count}</Badge>
          </div>
        </div>

        {/* Educational Card */}
        <Card className="bg-orange-50 border-orange-200">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🎓</span>
              <h3 className="text-lg font-semibold text-orange-800">
                What's Happening?
              </h3>
            </div>
            <div className="text-sm text-orange-700 space-y-2">
              <p>
                <strong>Stale Closure:</strong> The setTimeout captures the
                count value from when it was created
              </p>
              <p>
                <strong>The Problem:</strong> If you increment after clicking
                "Announce", the announced value will be outdated
              </p>
              <p>
                <strong>Why It Happens:</strong> JavaScript closures capture
                variables by reference at creation time
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
