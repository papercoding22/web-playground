import React, { useState } from "react";

// Component that logs when it's called
const ExpensiveComponent: React.FC<{ id: string; color: string }> = ({
  id,
  color,
}) => {
  console.log(`🎯 ExpensiveComponent ${id} function called!`);

  // Simulate expensive operation
  const expensiveValue = (() => {
    console.log(`💰 Expensive calculation for ${id}!`);
    return Math.random().toString(36).substring(7);
  })();

  return (
    <div className={`p-4 rounded-lg ${color} border-2 border-gray-300`}>
      <h4 className="font-semibold">Component {id}</h4>
      <p className="text-sm">Expensive value: {expensiveValue}</p>
    </div>
  );
};

const ReactPhaseExperiment: React.FC = () => {
  const [showFirst, setShowFirst] = useState(true);
  const [showSecond, setShowSecond] = useState(false);

  // 🔍 PHASE 1: Element Creation (happens immediately)
  console.log("📝 Creating elements...");
  const element1 = <ExpensiveComponent id="A" color="bg-blue-100" />;
  const element2 = <ExpensiveComponent id="B" color="bg-red-100" />;
  const element3 = <ExpensiveComponent id="C" color="bg-green-100" />;
  console.log("✅ Elements created (but functions NOT called yet)");

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <h3 className="text-3xl font-bold text-gray-800 mb-4">
          React Two-Phase Process
        </h3>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
          <h4 className="font-semibold text-yellow-800 mb-2">
            🔍 Watch the Console!
          </h4>
          <p className="text-yellow-700">
            Notice when "Creating elements..." appears vs when components
            actually render
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-gray-800">
              Phase 1: Element Creation
            </h4>
            <div className="bg-purple-50 p-4 rounded-lg border">
              <p className="text-sm text-purple-700 mb-2">
                Elements exist as objects:
              </p>
              <code className="text-xs bg-purple-100 p-2 rounded block">
                element1 = {"{"}type: ExpensiveComponent, props: {"{"}id: "A"
                {"}"}
                {"}"}
              </code>
              <p className="text-xs text-purple-600 mt-2">
                ✅ Created instantly, no function calls
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-gray-800">
              Phase 2: Rendering
            </h4>
            <div className="bg-green-50 p-4 rounded-lg border">
              <p className="text-sm text-green-700 mb-2">
                React decides when to render:
              </p>
              <code className="text-xs bg-green-100 p-2 rounded block">
                if (showFirst) render(element1)
              </code>
              <p className="text-xs text-green-600 mt-2">
                ⚡ Function called only when needed
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-wrap gap-4 mb-4">
            <button
              onClick={() => setShowFirst(!showFirst)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                showFirst
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {showFirst ? "Hide" : "Show"} Component A
            </button>

            <button
              onClick={() => setShowSecond(!showSecond)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                showSecond
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {showSecond ? "Hide" : "Show"} Component B
            </button>
          </div>

          <div className="space-y-4">
            {showFirst && (
              <div>
                <h5 className="font-medium text-gray-700 mb-2">
                  Rendered Component A:
                </h5>
                {element1}
              </div>
            )}

            {showSecond && (
              <div>
                <h5 className="font-medium text-gray-700 mb-2">
                  Rendered Component B:
                </h5>
                {element2}
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-2">
                Component C (never rendered):
              </h5>
              <p className="text-sm text-gray-600">
                Element C exists but its function is never called because we
                don't render it!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReactPhaseExperiment;
