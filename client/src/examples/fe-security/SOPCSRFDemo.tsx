import React, { useState } from "react";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Globe,
  Lock,
  Unlock,
  Server,
  Monitor,
} from "lucide-react";

// Type definitions
interface LogEntry {
  id: number;
  type: "success" | "error" | "warning" | "info";
  message: string;
  timestamp: string;
}

type TabType = "sop" | "csrf";
type TestStatus = "" | "testing" | "success" | "error" | "blocked";

const SOPCSRFDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("sop");
  const [sopTest, setSopTest] = useState<TestStatus>("");
  const [csrfTest, setCsrfTest] = useState<TestStatus>("");
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = (type: LogEntry["type"], message: string): void => {
    const newLog: LogEntry = {
      id: Date.now(),
      type,
      message,
      timestamp: new Date().toLocaleTimeString(),
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const testSameOrigin = async (url: string): Promise<void> => {
    setSopTest("testing");
    addLog("info", `Testing SOP with URL: ${url}`);

    try {
      const response = await fetch(url, {
        method: "GET",
        mode: "cors",
      });

      if (response.ok) {
        addLog("success", `✓ Request successful! Same origin or CORS enabled`);
        setSopTest("success");
      } else {
        addLog("error", `✗ Request failed with status: ${response.status}`);
        setSopTest("error");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      addLog("error", `✗ SOP Blocked: ${errorMessage}`);
      setSopTest("error");
    }
  };

  const simulateCSRF = async (
    targetUrl: string,
    maliciousAction: string
  ): Promise<void> => {
    setCsrfTest("testing");
    addLog("warning", `Simulating CSRF attack: ${maliciousAction}`);

    // Simulate a malicious form submission
    const formData = new FormData();
    formData.append("action", maliciousAction);
    formData.append("amount", "1000");
    formData.append("to", "attacker@evil.com");

    try {
      // This would normally be blocked by SOP or CSRF protection
      setTimeout(() => {
        addLog("error", `✗ CSRF attempt blocked by security measures`);
        setCsrfTest("blocked");
      }, 1000);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      addLog("error", `CSRF protection active: ${errorMessage}`);
      setCsrfTest("blocked");
    }
  };

  const clearLogs = (): void => {
    setLogs([]);
    setSopTest("");
    setCsrfTest("");
  };

  const getLogStyles = (type: LogEntry["type"]): string => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-500";
      case "error":
        return "bg-red-50 border-red-500";
      case "warning":
        return "bg-yellow-50 border-yellow-500";
      case "info":
      default:
        return "bg-blue-50 border-blue-500";
    }
  };

  const getLogTextColor = (type: LogEntry["type"]): string => {
    switch (type) {
      case "success":
        return "text-green-800";
      case "error":
        return "text-red-800";
      case "warning":
        return "text-yellow-800";
      case "info":
      default:
        return "text-blue-800";
    }
  };

  const getLogTimestampColor = (type: LogEntry["type"]): string => {
    switch (type) {
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
      case "warning":
        return "text-yellow-600";
      case "info":
      default:
        return "text-blue-600";
    }
  };

  const getTestStatusStyles = (
    status: TestStatus
  ): { containerClass: string; textClass: string } => {
    switch (status) {
      case "testing":
        return {
          containerClass: "bg-blue-50 text-blue-700",
          textClass: "text-blue-700",
        };
      case "success":
        return {
          containerClass: "bg-green-50 text-green-700",
          textClass: "text-green-700",
        };
      case "blocked":
        return {
          containerClass: "bg-green-50 text-green-700",
          textClass: "text-green-700",
        };
      case "error":
      default:
        return {
          containerClass: "bg-red-50 text-red-700",
          textClass: "text-red-700",
        };
    }
  };

  const getTestStatusIcon = (status: TestStatus): JSX.Element => {
    switch (status) {
      case "testing":
        return (
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        );
      case "success":
        return <CheckCircle className="w-5 h-5" />;
      case "blocked":
        return <Shield className="w-5 h-5" />;
      case "error":
      default:
        return <XCircle className="w-5 h-5" />;
    }
  };

  const getTestStatusText = (
    status: TestStatus,
    context: "sop" | "csrf"
  ): string => {
    switch (status) {
      case "testing":
        return context === "sop"
          ? "Testing request..."
          : "Attempting CSRF attack...";
      case "success":
        return "Request successful!";
      case "blocked":
        return "CSRF attack blocked by security measures!";
      case "error":
      default:
        return context === "sop"
          ? "Request blocked by SOP"
          : "CSRF vulnerability detected";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">
              Web Security Demo
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Interactive demonstration of Same-Origin Policy (SOP) and Cross-Site
            Request Forgery (CSRF)
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-lg p-2 flex gap-2">
            <button
              onClick={() => setActiveTab("sop")}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === "sop"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Same-Origin Policy
              </div>
            </button>
            <button
              onClick={() => setActiveTab("csrf")}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === "csrf"
                  ? "bg-red-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                CSRF Protection
              </div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Demo Panel */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            {activeTab === "sop" && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Globe className="w-8 h-8 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-800">
                    Same-Origin Policy Demo
                  </h2>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">
                    What is SOP?
                  </h3>
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <p className="text-gray-700">
                      The Same-Origin Policy restricts web pages from making
                      requests to a different domain, protocol, or port than the
                      one serving the page. This prevents malicious scripts from
                      accessing sensitive data from other origins.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        Same Origin: https://example.com/page1 →
                        https://example.com/api
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        Different Origin: https://example.com →
                        https://other.com/api
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Test SOP Restrictions
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() =>
                        testSameOrigin(
                          "https://jsonplaceholder.typicode.com/posts/1"
                        )
                      }
                      className="flex items-center justify-center gap-2 bg-green-100 hover:bg-green-200 text-green-800 px-4 py-3 rounded-lg transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Test CORS Enabled
                    </button>

                    <button
                      onClick={() => testSameOrigin("https://google.com")}
                      className="flex items-center justify-center gap-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-4 py-3 rounded-lg transition-colors"
                    >
                      <Globe className="w-5 h-5" />
                      Test External API
                    </button>
                  </div>

                  {sopTest && (
                    <div
                      className={`p-4 rounded-lg flex items-center gap-3 ${
                        getTestStatusStyles(sopTest).containerClass
                      }`}
                    >
                      {getTestStatusIcon(sopTest)}
                      <span className="font-medium">
                        {getTestStatusText(sopTest, "sop")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "csrf" && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                  <h2 className="text-2xl font-bold text-gray-800">
                    CSRF Protection Demo
                  </h2>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">
                    What is CSRF?
                  </h3>
                  <div className="bg-red-50 p-4 rounded-lg mb-4">
                    <p className="text-gray-700">
                      Cross-Site Request Forgery tricks users into performing
                      unwanted actions on a web application where they're
                      authenticated. CSRF tokens and SameSite cookies help
                      prevent these attacks.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Common CSRF Protections:
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-green-600" />
                        CSRF Tokens in forms
                      </li>
                      <li className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-green-600" />
                        SameSite cookie attribute
                      </li>
                      <li className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-green-600" />
                        Referer header validation
                      </li>
                      <li className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-green-600" />
                        Double-submit cookies
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Simulate CSRF Attack
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() =>
                        simulateCSRF(
                          "https://bank.example.com/transfer",
                          "transfer_money"
                        )
                      }
                      className="flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-3 rounded-lg transition-colors"
                    >
                      <Unlock className="w-5 h-5" />
                      Malicious Transfer
                    </button>

                    <button
                      onClick={() =>
                        simulateCSRF(
                          "https://social.example.com/post",
                          "post_message"
                        )
                      }
                      className="flex items-center justify-center gap-2 bg-orange-100 hover:bg-orange-200 text-orange-800 px-4 py-3 rounded-lg transition-colors"
                    >
                      <AlertTriangle className="w-5 h-5" />
                      Fake Post
                    </button>
                  </div>

                  {csrfTest && (
                    <div
                      className={`p-4 rounded-lg flex items-center gap-3 ${
                        getTestStatusStyles(csrfTest).containerClass
                      }`}
                    >
                      {getTestStatusIcon(csrfTest)}
                      <span className="font-medium">
                        {getTestStatusText(csrfTest, "csrf")}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">
                    🛡️ Security Best Practices:
                  </h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>
                      • Always use CSRF tokens for state-changing requests
                    </li>
                    <li>• Set SameSite=Strict on authentication cookies</li>
                    <li>• Validate the Origin and Referer headers</li>
                    <li>• Use POST requests for sensitive operations</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Activity Log */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Monitor className="w-8 h-8 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-800">
                  Activity Log
                </h2>
              </div>
              <button
                onClick={clearLogs}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Clear Log
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Server className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No activity yet. Try the demo buttons above!</p>
                </div>
              ) : (
                logs.map((log: LogEntry) => (
                  <div
                    key={log.id}
                    className={`p-3 rounded-lg border-l-4 ${getLogStyles(
                      log.type
                    )}`}
                  >
                    <div className="flex items-start justify-between">
                      <p
                        className={`text-sm font-medium ${getLogTextColor(
                          log.type
                        )}`}
                      >
                        {log.message}
                      </p>
                      <span
                        className={`text-xs ${getLogTimestampColor(log.type)}`}
                      >
                        {log.timestamp}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Educational Footer */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                🔍 Understanding SOP
              </h3>
              <p className="text-gray-600 text-sm">
                The Same-Origin Policy is a critical security concept that
                restricts how documents or scripts loaded from one origin can
                interact with resources from another origin. This demo shows how
                CORS (Cross-Origin Resource Sharing) can allow controlled access
                across origins.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                🛡️ CSRF Protection
              </h3>
              <p className="text-gray-600 text-sm">
                Cross-Site Request Forgery attacks exploit the trust that a web
                application has in a user's browser. Modern applications use
                multiple layers of protection including CSRF tokens, SameSite
                cookies, and proper validation to prevent these attacks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SOPCSRFDemo;
