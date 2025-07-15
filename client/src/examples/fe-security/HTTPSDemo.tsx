import React, { useState } from "react";
import {
  Shield,
  Lock,
  Unlock,
  Key,
  Send,
  Eye,
  EyeOff,
  Server,
  Monitor,
  Wifi,
} from "lucide-react";

// Types
interface CryptoKeys {
  publicKey: string;
  privateKey: string;
}

interface Message {
  id: number;
  from: "browser" | "server" | "eavesdropper";
  to: "browser" | "server" | "eavesdropper";
  content: string;
  encrypted: boolean;
  encryptedContent?: string;
  timestamp: string;
  phase: 1 | 2;
  canDecrypt: boolean;
  keyUsed?: string;
}

const HTTPSDemo: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [sessionKey, setSessionKey] = useState<string>("");
  const [serverKeys, setServerKeys] = useState<CryptoKeys>({
    publicKey: "",
    privateKey: "",
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [phase2Data, setPhase2Data] = useState<string>("");
  const [showEavesdropper, setShowEavesdropper] = useState<boolean>(true);

  // Simple "encryption" simulation for demo purposes
  const simpleEncrypt = (text: string, key: string): string => {
    return (
      btoa(text + "::" + key)
        .replace(/[+/=]/g, "")
        .slice(0, 20) + "..."
    );
  };

  const simpleDecrypt = (encrypted: string, key: string): string => {
    // In real crypto, this would be actual decryption
    return `[DECRYPTED with key: ${key.slice(0, 8)}...]`;
  };

  const generateKeys = (): void => {
    const publicKey = "PUB_" + Math.random().toString(36).substring(2, 15);
    const privateKey = "PRIV_" + Math.random().toString(36).substring(2, 15);
    setServerKeys({ publicKey, privateKey });
    setCurrentStep(1);
  };

  const sendPublicKey = (): void => {
    const message: Message = {
      id: Date.now(),
      from: "server",
      to: "browser",
      content: `Server's Public Key: ${serverKeys.publicKey}`,
      encrypted: false,
      timestamp: new Date().toLocaleTimeString(),
      phase: 1,
      canDecrypt: true,
      keyUsed: "None (public key is shared openly)",
    };

    setMessages((prev) => [...prev, message]);
    setCurrentStep(2);
  };

  const generateSessionKey = (): void => {
    const newSessionKey =
      "SESSION_" + Math.random().toString(36).substring(2, 15);
    setSessionKey(newSessionKey);

    const encryptedSessionKey = simpleEncrypt(
      newSessionKey,
      serverKeys.publicKey
    );

    const message: Message = {
      id: Date.now(),
      from: "browser",
      to: "server",
      content: `Session Key: ${newSessionKey}`,
      encrypted: true,
      encryptedContent: encryptedSessionKey,
      timestamp: new Date().toLocaleTimeString(),
      phase: 1,
      canDecrypt: true,
      keyUsed: `Server's Private Key: ${serverKeys.privateKey.slice(0, 12)}...`,
    };

    setMessages((prev) => [...prev, message]);
    setCurrentStep(3);
  };

  const sendPhase2Data = (
    direction: "browser-to-server" | "server-to-browser"
  ): void => {
    let content: string;
    let from: "browser" | "server";
    let to: "browser" | "server";

    if (direction === "browser-to-server") {
      content = phase2Data || "Transfer $1000 to John";
      from = "browser";
      to = "server";
    } else {
      content = "Your account balance: $5,000";
      from = "server";
      to = "browser";
    }

    const encryptedContent = simpleEncrypt(content, sessionKey);

    const message: Message = {
      id: Date.now(),
      from,
      to,
      content,
      encrypted: true,
      encryptedContent,
      timestamp: new Date().toLocaleTimeString(),
      phase: 2,
      canDecrypt: true,
      keyUsed: `Session Key: ${sessionKey.slice(0, 12)}...`,
    };

    setMessages((prev) => [...prev, message]);
  };

  const resetDemo = (): void => {
    setCurrentStep(0);
    setSessionKey("");
    setServerKeys({ publicKey: "", privateKey: "" });
    setMessages([]);
    setPhase2Data("");
  };

  const steps = [
    { title: "Start", description: "Begin HTTPS handshake process" },
    {
      title: "Server Keys",
      description: "Server generates public/private key pair",
    },
    {
      title: "Public Key Share",
      description: "Server sends public key to browser",
    },
    {
      title: "Session Key",
      description: "Browser generates and encrypts session key",
    },
    {
      title: "Secure Communication",
      description: "Use session key for symmetric encryption",
    },
  ];

  const MessageBox: React.FC<{ message: Message }> = ({ message }) => {
    const canEavesdropperDecrypt =
      message.phase === 1
        ? message.from === "server" // Public key is visible to everyone
        : false; // Session key encrypted data cannot be decrypted by eavesdropper

    return (
      <div
        className={`border rounded-lg p-4 mb-4 ${
          message.encrypted
            ? "border-red-300 bg-red-50"
            : "border-green-300 bg-green-50"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {message.from === "server" ? (
              <Server size={16} />
            ) : (
              <Monitor size={16} />
            )}
            <span className="font-semibold capitalize">{message.from}</span>
            <span>→</span>
            {message.to === "server" ? (
              <Server size={16} />
            ) : (
              <Monitor size={16} />
            )}
            <span className="font-semibold capitalize">{message.to}</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 text-xs rounded ${
                message.phase === 1
                  ? "bg-blue-100 text-blue-700"
                  : "bg-purple-100 text-purple-700"
              }`}
            >
              Phase {message.phase}
            </span>
            {message.encrypted ? (
              <Lock size={16} className="text-red-600" />
            ) : (
              <Unlock size={16} className="text-green-600" />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <strong>Original Data:</strong>
            <div className="font-mono text-sm bg-white p-2 rounded border">
              {message.content}
            </div>
          </div>

          {message.encrypted && (
            <div>
              <strong>Encrypted (What travels over network):</strong>
              <div className="font-mono text-sm bg-gray-100 p-2 rounded border">
                {message.encryptedContent}
              </div>
            </div>
          )}

          <div className="text-xs text-gray-600">
            <strong>Decryption Key:</strong> {message.keyUsed}
          </div>

          {showEavesdropper && (
            <div
              className={`text-xs p-2 rounded ${
                canEavesdropperDecrypt
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              <strong>🕵️ Eavesdropper:</strong>{" "}
              {canEavesdropperDecrypt
                ? "Can see this data (public key or unencrypted)"
                : "Cannot decrypt this data (lacks private/session key)"}
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 mt-2">{message.timestamp}</div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">
        HTTPS Encryption Process Demo
      </h1>

      {/* Progress Steps */}
      <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Process Steps</h2>
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index <= currentStep
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {index + 1}
              </div>
              <div className="text-center mt-2">
                <div className="font-semibold text-sm">{step.title}</div>
                <div className="text-xs text-gray-600 max-w-24">
                  {step.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Demo Controls</h2>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showEavesdropper}
                onChange={(e) => setShowEavesdropper(e.target.checked)}
              />
              <Wifi size={16} />
              Show Eavesdropper Analysis
            </label>
            <button
              onClick={resetDemo}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Reset Demo
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {/* Phase 1 Controls */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3 text-blue-700">
              Phase 1: Asymmetric Encryption (Key Exchange)
            </h3>
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={generateKeys}
                disabled={currentStep > 0}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <Key size={16} />
                1. Generate Server Keys
              </button>

              <button
                onClick={sendPublicKey}
                disabled={currentStep < 1}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <Send size={16} />
                2. Send Public Key
              </button>

              <button
                onClick={generateSessionKey}
                disabled={currentStep < 2}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <Lock size={16} />
                3. Generate Session Key
              </button>
            </div>
          </div>

          {/* Phase 2 Controls */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3 text-purple-700">
              Phase 2: Symmetric Encryption (Data Transfer)
            </h3>
            <div className="flex gap-4 flex-wrap items-center">
              <input
                type="text"
                placeholder="Enter data to send..."
                value={phase2Data}
                onChange={(e) => setPhase2Data(e.target.value)}
                disabled={currentStep < 3}
                className="border border-gray-300 rounded px-3 py-2 flex-1 min-w-48"
              />

              <button
                onClick={() => sendPhase2Data("browser-to-server")}
                disabled={currentStep < 3}
                className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <Send size={16} />
                Browser → Server
              </button>

              <button
                onClick={() => sendPhase2Data("server-to-browser")}
                disabled={currentStep < 3}
                className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <Send size={16} />
                Server → Browser
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Current State */}
      {(serverKeys.publicKey || sessionKey) && (
        <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            Current Encryption Keys
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {serverKeys.publicKey && (
              <div className="border rounded p-3">
                <h3 className="font-semibold text-green-700 mb-2">
                  🔓 Server's Public Key (Visible to All)
                </h3>
                <code className="text-xs bg-gray-100 p-2 rounded block break-all">
                  {serverKeys.publicKey}
                </code>
              </div>
            )}

            {serverKeys.privateKey && (
              <div className="border rounded p-3">
                <h3 className="font-semibold text-red-700 mb-2">
                  🔐 Server's Private Key (Secret)
                </h3>
                <code className="text-xs bg-gray-100 p-2 rounded block break-all">
                  {serverKeys.privateKey}
                </code>
              </div>
            )}

            {sessionKey && (
              <div className="border rounded p-3 md:col-span-2">
                <h3 className="font-semibold text-blue-700 mb-2">
                  🔑 Shared Session Key (Used by Both)
                </h3>
                <code className="text-xs bg-gray-100 p-2 rounded block break-all">
                  {sessionKey}
                </code>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Message Log */}
      {messages.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            Network Communication Log
          </h2>
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBox key={message.id} message={message} />
            ))}
          </div>
        </div>
      )}

      {/* Educational Summary */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-800 mb-2">
          Key Learning Points:
        </h3>
        <ul className="text-sm text-blue-700 space-y-1 list-disc ml-4">
          <li>
            <strong>Phase 1 (Asymmetric):</strong> Securely exchange session key
            using public/private key pair
          </li>
          <li>
            <strong>Phase 2 (Symmetric):</strong> Fast encryption of actual data
            using shared session key
          </li>
          <li>
            <strong>Eavesdropper Protection:</strong> Can see encrypted data but
            cannot decrypt without keys
          </li>
          <li>
            <strong>Performance:</strong> Asymmetric for key exchange (slow),
            symmetric for data (fast)
          </li>
          <li>
            <strong>Security:</strong> Even if public key is intercepted,
            session key remains secure
          </li>
        </ul>

        <div className="mt-4 p-3 bg-blue-100 rounded">
          <h4 className="font-semibold text-blue-800 mb-1">
            Why This Hybrid Approach?
          </h4>
          <p className="text-sm text-blue-700">
            Asymmetric encryption is secure but slow. Symmetric encryption is
            fast but requires shared keys. HTTPS combines both: asymmetric to
            securely share a key, then symmetric for fast data transfer.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HTTPSDemo;
