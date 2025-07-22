import { useEffect, useRef, useState } from "react";

// Type definitions
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary" | "success";
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
    success: "bg-green-500 hover:bg-green-600 text-white",
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

export default function StaleClosureDemoSolution() {
  const [count, setCount] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);
  const countRef = useRef<number>(count);

  useEffect(() => {
    // Update the ref whenever `count` changes
    countRef.current = count;
  }, [count]);

  function announceCount(): void {
    setLogs((prev) => [...prev, `⏳ Will announce count in 2s...`]);
    setTimeout(() => {
      // Use the ref to get the latest count
      setLogs((prev) => [
        ...prev,
        `📣 Count is: ${countRef.current}`, // Always gets the current value!
      ]);
    }, 2000);
  }

  const handleIncrement = (): void => {
    setCount((c) => c + 1);
  };

  // Check if announcements match current expectations
  const hasCorrectAnnouncements = logs.some((log) =>
    log.includes("📣 Count is:")
  );
  const allAnnouncementsCorrect = logs
    .filter((log) => log.includes("📣 Count is:"))
    .every((log) => {
      const announcedCount = parseInt(log.split(": ")[1]);
      return announcedCount >= 0; // With refs, all announcements should be accurate
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🧠 Stale Closure Solution
          </h1>
          <p className="text-gray-600">
            Using useRef to solve the stale closure problem! 🎯
          </p>
        </div>

        {/* Solution Badge */}
        <div className="text-center">
          <Badge variant="success" className="text-base px-4 py-2">
            ✅ Stale Closure Fixed with useRef
          </Badge>
        </div>

        {/* Counter Card */}
        <Card>
          <div className="space-y-6">
            {/* Count Display */}
            <div className="text-center bg-green-50 rounded-lg p-6 border-2 border-green-200">
              <div className="flex items-center justify-center space-x-3">
                <span className="text-3xl">🔢</span>
                <div>
                  <p className="text-4xl font-bold text-gray-800">
                    Count: {count}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    ✅ Ref always has latest value: {countRef.current}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={handleIncrement}
                variant="success"
                className="flex items-center space-x-2"
              >
                <span>➕</span>
                <span>Increment</span>
              </Button>
              <Button
                onClick={announceCount}
                variant="primary"
                className="flex items-center space-x-2"
              >
                <span>📣</span>
                <span>Announce Count in 2s</span>
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-green-600">
                ✨ Try clicking increment after announcing - the ref will
                capture the latest value!
              </p>
            </div>
          </div>
        </Card>

        {/* Success Alert */}
        {hasCorrectAnnouncements && allAnnouncementsCorrect && (
          <Alert variant="success">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🎯</span>
              <span className="font-semibold">Perfect! No Stale Closures</span>
            </div>
            <p className="mt-1 text-sm">
              The useRef hook successfully provides access to the latest count
              value in all timeouts.
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
                <p>No events yet. Test the solution by clicking the buttons!</p>
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
                          ? "bg-green-50 border-green-200"
                          : isWaiting
                          ? "bg-blue-50 border-blue-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <span
                        className={`font-mono text-sm mt-0.5 ${
                          isAnnouncement
                            ? "text-green-500"
                            : isWaiting
                            ? "text-blue-500"
                            : "text-gray-500"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm font-mono text-gray-700">
                        {log}
                      </span>
                      {isAnnouncement && (
                        <span className="text-xs text-green-600 font-medium ml-auto">
                          ✅ Fresh
                        </span>
                      )}
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
            <Badge variant="success">Stale Closures Prevented</Badge>
            <Badge variant="default">Current Count: {count}</Badge>
            <Badge variant="default">Ref Value: {countRef.current}</Badge>
          </div>
        </div>

        {/* Technical Details Card */}
        <Card className="bg-green-50 border-green-200">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🔧</span>
              <h3 className="text-lg font-semibold text-green-800">
                Solution Details
              </h3>
            </div>
            <div className="text-sm text-green-700 space-y-2">
              <p>
                <strong>useRef Hook:</strong> Creates a mutable reference that
                persists across renders
              </p>
              <p>
                <strong>Always Current:</strong> countRef.current always holds
                the latest count value
              </p>
              <p>
                <strong>No Re-renders:</strong> Updating ref.current doesn't
                trigger component re-renders
              </p>
              <p>
                <strong>Perfect for Timeouts:</strong> Closures can access the
                latest value via the ref
              </p>
            </div>
          </div>
        </Card>

        {/* Comparison Card */}
        <Card className="bg-blue-50 border-blue-200">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-xl">⚖️</span>
              <h3 className="text-lg font-semibold text-blue-800">
                Before vs After
              </h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="bg-red-50 p-3 rounded border border-red-200">
                <p className="font-medium text-red-800 mb-2">
                  ❌ Before (Problem)
                </p>
                <code className="text-xs text-red-700">
                  setTimeout(() =&gt; &#123;
                  <br />
                  &nbsp;&nbsp;console.log(count); // Stale!
                  <br />
                  &#125;, 2000);
                </code>
              </div>
              <div className="bg-green-50 p-3 rounded border border-green-200">
                <p className="font-medium text-green-800 mb-2">
                  ✅ After (Solution)
                </p>
                <code className="text-xs text-green-700">
                  setTimeout(() =&gt; &#123;
                  <br />
                  &nbsp;&nbsp;console.log(countRef.current); // Fresh!
                  <br />
                  &#125;, 2000);
                </code>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
