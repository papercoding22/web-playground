import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  MessageSquare,
  Search,
  Bug,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";

// Types
interface Comment {
  id: number;
  username: string;
  content: string;
  timestamp: string;
  isXSS?: boolean;
}

interface XSSPayload {
  name: string;
  payload: string;
  description: string;
  type: "stored" | "reflected";
}

const XSSDemo: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({ username: "", content: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [safeMode, setSafeMode] = useState(true);
  const [showPayloads, setShowPayloads] = useState(false);
  const [attackResults, setAttackResults] = useState<string[]>([]);

  // Sample XSS payloads for demonstration
  const xssPayloads: XSSPayload[] = [
    {
      name: "Basic Alert",
      payload: "<script>alert('XSS Attack!')</script>",
      description: "Simple script injection that shows an alert",
      type: "stored",
    },
    {
      name: "Cookie Stealer",
      payload: "<script>alert('Stolen cookies: ' + document.cookie)</script>",
      description: "Demonstrates accessing user cookies",
      type: "stored",
    },
    {
      name: "DOM Manipulation",
      payload:
        "<script>document.body.style.backgroundColor='red'; document.body.innerHTML='<h1>HACKED!</h1>';</script>",
      description: "Changes the entire page content",
      type: "stored",
    },
    {
      name: "Image with Onerror",
      payload:
        "<img src='invalid' onerror='alert(\"XSS via img onerror!\")' />",
      description: "Uses image onerror event to execute JavaScript",
      type: "stored",
    },
    {
      name: "Reflected Search",
      payload: "<script>alert('Reflected XSS!')</script>",
      description: "XSS through search parameter",
      type: "reflected",
    },
  ];

  // Load initial safe comments
  useEffect(() => {
    setComments([
      {
        id: 1,
        username: "Alice",
        content: "Great article! Thanks for sharing.",
        timestamp: new Date(Date.now() - 3600000).toLocaleString(),
      },
      {
        id: 2,
        username: "Bob",
        content: "I found this very helpful. Looking forward to more content.",
        timestamp: new Date(Date.now() - 1800000).toLocaleString(),
      },
    ]);
  }, []);

  // Simulate XSS execution (for demo purposes)
  const simulateXSSExecution = (payload: string): void => {
    const message = `🚨 XSS EXECUTED: ${payload}`;
    setAttackResults((prev) => [...prev, message]);

    // Show what the attack would do (without actually executing it)
    if (payload.includes("alert")) {
      const alertMatch = payload.match(/alert\(['"`]([^'"`]*)['"`]\)/);
      if (alertMatch) {
        setTimeout(() => {
          alert(`SIMULATED XSS: ${alertMatch[1]}`);
        }, 100);
      }
    }
  };

  // Add comment (vulnerable or safe based on mode)
  const addComment = (): void => {
    if (!newComment.username.trim() || !newComment.content.trim()) return;

    const comment: Comment = {
      id: Date.now(),
      username: newComment.username,
      content: newComment.content,
      timestamp: new Date().toLocaleString(),
      isXSS:
        !safeMode &&
        (newComment.content.includes("<script>") ||
          newComment.content.includes("onerror")),
    };

    // Check for XSS in unsafe mode
    if (!safeMode && comment.isXSS) {
      simulateXSSExecution(newComment.content);
    }

    setComments((prev) => [...prev, comment]);
    setNewComment({ username: "", content: "" });
  };

  // Use XSS payload
  const handlePayload = (payload: XSSPayload): void => {
    if (payload.type === "stored") {
      setNewComment((prev) => ({ ...prev, content: payload.payload }));
    } else {
      setSearchTerm(payload.payload);
    }
  };

  // Safe HTML sanitization (simplified for demo)
  const sanitizeHTML = (html: string): string => {
    return html
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;");
  };

  // Render content safely or unsafely
  const renderContent = (content: string): JSX.Element => {
    if (safeMode) {
      return <span>{sanitizeHTML(content)}</span>;
    } else {
      // DANGEROUS: Direct HTML rendering (for demo only)
      return <span dangerouslySetInnerHTML={{ __html: content }} />;
    }
  };

  // Render search results (reflected XSS vulnerability)
  const renderSearchResults = (): JSX.Element => {
    if (!searchTerm.trim()) return <div />;

    if (!safeMode && searchTerm.includes("<script>")) {
      simulateXSSExecution(searchTerm);
    }

    return (
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-semibold mb-2">Search Results:</h3>
        <p>
          Results for:{" "}
          {safeMode ? (
            sanitizeHTML(searchTerm)
          ) : (
            <span dangerouslySetInnerHTML={{ __html: searchTerm }} />
          )}
        </p>
        <p className="text-sm text-gray-600 mt-2">
          {safeMode
            ? "✅ Search term safely encoded"
            : "⚠️ Search term rendered without sanitization"}
        </p>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">
        XSS Vulnerability Demo
      </h1>

      {/* Security Mode Toggle */}
      <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {safeMode ? (
              <ShieldCheck className="text-green-600" size={24} />
            ) : (
              <AlertTriangle className="text-red-600" size={24} />
            )}
            <h2 className="text-xl font-semibold">Security Mode</h2>
          </div>
          <button
            onClick={() => setSafeMode(!safeMode)}
            className={`px-6 py-3 rounded-lg font-semibold ${
              safeMode
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            {safeMode ? "🛡️ Safe Mode ON" : "⚠️ Vulnerable Mode ON"}
          </button>
        </div>

        <div
          className="mt-4 p-4 rounded-lg"
          style={{ backgroundColor: safeMode ? "#f0f9f0" : "#fff0f0" }}
        >
          <p className="text-sm">
            {safeMode ? (
              <>
                <strong>Safe Mode:</strong> User input is properly sanitized and
                encoded. XSS attacks are prevented.
              </>
            ) : (
              <>
                <strong>Vulnerable Mode:</strong> User input is rendered
                directly without sanitization. XSS attacks will execute!
              </>
            )}
          </p>
        </div>
      </div>

      {/* XSS Payloads Reference */}
      <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bug className="text-purple-600" size={24} />
            <h2 className="text-xl font-semibold">XSS Payloads for Testing</h2>
          </div>
          <button
            onClick={() => setShowPayloads(!showPayloads)}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-800"
          >
            {showPayloads ? <EyeOff size={16} /> : <Eye size={16} />}
            {showPayloads ? "Hide" : "Show"} Payloads
          </button>
        </div>

        {showPayloads && (
          <div className="space-y-3">
            {xssPayloads.map((payload, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{payload.name}</span>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        payload.type === "stored"
                          ? "bg-red-100 text-red-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {payload.type}
                    </span>
                  </div>
                  <button
                    onClick={() => handlePayload(payload)}
                    className="text-sm bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded"
                  >
                    Use Payload
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {payload.description}
                </p>
                <code className="text-xs bg-gray-100 p-2 rounded block break-all">
                  {payload.payload}
                </code>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reflected XSS - Search Feature */}
      <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Search className="text-blue-600" size={24} />
          <h2 className="text-xl font-semibold">
            Search Feature (Reflected XSS Test)
          </h2>
        </div>

        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-3 py-2"
          />
          <button
            onClick={() => {
              /* Search handled by renderSearchResults */
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
          >
            Search
          </button>
        </div>

        {renderSearchResults()}
      </div>

      {/* Stored XSS - Comment System */}
      <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="text-green-600" size={24} />
          <h2 className="text-xl font-semibold">
            Comment System (Stored XSS Test)
          </h2>
        </div>

        {/* Add Comment Form */}
        <div className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="Your name"
            value={newComment.username}
            onChange={(e) =>
              setNewComment((prev) => ({ ...prev, username: e.target.value }))
            }
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          <textarea
            placeholder="Write your comment..."
            value={newComment.content}
            onChange={(e) =>
              setNewComment((prev) => ({ ...prev, content: e.target.value }))
            }
            className="w-full border border-gray-300 rounded px-3 py-2 h-24"
          />
          <button
            onClick={addComment}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
          >
            Post Comment
          </button>
        </div>

        {/* Comments Display */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className={`border rounded-lg p-4 ${
                comment.isXSS ? "border-red-300 bg-red-50" : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{comment.username}</span>
                  {comment.isXSS && (
                    <span className="px-2 py-1 text-xs bg-red-200 text-red-700 rounded">
                      XSS DETECTED
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {comment.timestamp}
                </span>
              </div>
              <div className="text-gray-700">
                {renderContent(comment.content)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attack Results Log */}
      {attackResults.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="font-semibold text-red-800 mb-2">⚠️ XSS Attack Log</h3>
          <div className="space-y-2">
            {attackResults.map((result, index) => (
              <div
                key={index}
                className="text-sm text-red-700 font-mono bg-red-100 p-2 rounded"
              >
                {result}
              </div>
            ))}
          </div>
          <button
            onClick={() => setAttackResults([])}
            className="mt-4 text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Clear Log
          </button>
        </div>
      )}

      {/* Educational Notes */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-800 mb-2">
          Key Learning Points:
        </h3>
        <ul className="text-sm text-blue-700 space-y-1 list-disc ml-4">
          <li>
            <strong>Stored XSS:</strong> Malicious scripts stored in database,
            executed when content is viewed
          </li>
          <li>
            <strong>Reflected XSS:</strong> Scripts reflected back from user
            input (search, URL parameters)
          </li>
          <li>
            <strong>Input Sanitization:</strong> Encoding special characters
            prevents script execution
          </li>
          <li>
            <strong>Safe Mode:</strong> Shows how proper sanitization blocks all
            XSS attempts
          </li>
          <li>
            <strong>Vulnerable Mode:</strong> Demonstrates what happens without
            proper protection
          </li>
        </ul>

        <div className="mt-4 p-3 bg-blue-100 rounded">
          <h4 className="font-semibold text-blue-800 mb-1">
            Prevention in Real Apps:
          </h4>
          <p className="text-sm text-blue-700">
            Use libraries like DOMPurify for sanitization, Content Security
            Policy (CSP) headers, and always validate/encode user input on both
            client and server sides.
          </p>
        </div>
      </div>
    </div>
  );
};

export default XSSDemo;
