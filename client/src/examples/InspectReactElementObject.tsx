import React, { useState } from "react";

// Custom component to demonstrate the difference
const MyButton: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
}> = ({ children, onClick }) => {
  console.log("🎯 MyButton component function called");
  return <button onClick={onClick}>{children}</button>;
};

// Function to inspect any React element
const inspectElement = (element: React.ReactElement, name: string) => {
  console.log(`\n🔍 Inspecting ${name}:`);
  console.log("Type:", element.type);
  console.log("Type of type:", typeof element.type);
  console.log("Props:", element.props);
  console.log("Full element:", element);
};

// Simulate React's rendering decision
const simulateReactRenderer = (element: React.ReactElement): string => {
  console.log("\n🤖 React Renderer Processing:", element);

  if (typeof element.type === "string") {
    // Native DOM element
    console.log(`✅ Native element detected: "${element.type}"`);
    console.log("🔧 React will: Create actual DOM node");
    return `DOM Node: <${element.type}>`;
  } else if (typeof element.type === "function") {
    // Custom component
    console.log(`🎯 Custom component detected: ${element.type.name}`);
    console.log("🔧 React will: Call component function");
    return `Function Call: ${element.type.name}()`;
  } else {
    return "Unknown type";
  }
};

const InspectReactElementDemo: React.FC = () => {
  const [showInspection, setShowInspection] = useState(false);

  // Create different types of elements
  const nativeElement = <div className="p-4 bg-blue-100">I'm a native div</div>;
  const componentElement = (
    <MyButton onClick={() => console.log("Clicked!")}>I'm a component</MyButton>
  );
  const nestedElement = (
    <div className="border">
      <MyButton onClick={() => {}}>Nested component in native element</MyButton>
    </div>
  );

  const handleInspect = () => {
    setShowInspection(true);

    // Inspect different element types
    inspectElement(nativeElement, "Native <div> element");
    inspectElement(componentElement, "Custom <MyButton> component");
    inspectElement(nestedElement, "Nested structure");

    // Show React's decision process
    console.log("\n🤖 REACT'S RENDERING DECISIONS:");
    simulateReactRenderer(nativeElement);
    simulateReactRenderer(componentElement);
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-gradient-to-br from-emerald-50 to-teal-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <h3 className="text-3xl font-bold text-gray-800 mb-4">
          Native Elements vs Components
        </h3>

        {/* The Key Difference */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border-l-4 border-blue-500">
            <h4 className="text-xl font-semibold text-blue-800 mb-4">
              🏠 Native Elements
            </h4>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded font-mono text-sm">
                <div className="text-blue-600">
                  element.type = <span className="text-green-600">"div"</span>
                </div>
                <div className="text-gray-600">
                  typeof type ={" "}
                  <span className="text-purple-600">"string"</span>
                </div>
              </div>
              <div className="text-sm text-blue-700">
                ➜ React creates actual DOM node
                <br />
                ➜ No function to call
                <br />➜ Direct mapping to HTML
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border-l-4 border-purple-500">
            <h4 className="text-xl font-semibold text-purple-800 mb-4">
              ⚛️ Custom Components
            </h4>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded font-mono text-sm">
                <div className="text-purple-600">
                  element.type ={" "}
                  <span className="text-green-600">MyButton</span>
                </div>
                <div className="text-gray-600">
                  typeof type ={" "}
                  <span className="text-blue-600">"function"</span>
                </div>
              </div>
              <div className="text-sm text-purple-700">
                ➜ React calls the function
                <br />
                ➜ Gets returned JSX
                <br />➜ Processes recursively
              </div>
            </div>
          </div>
        </div>

        {/* React's Decision Tree */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-lg border-l-4 border-amber-500 mb-6">
          <h4 className="text-xl font-semibold text-amber-800 mb-4">
            🧠 React's Decision Process
          </h4>
          <div className="bg-white p-4 rounded-lg font-mono text-sm">
            <div className="text-gray-600">
              // React's internal logic (simplified)
            </div>
            <div className="text-blue-600 mt-2">
              if (typeof element.type === 'string') {`{`}
            </div>
            <div className="text-green-600 ml-4">
              // Create DOM node: document.createElement(element.type)
            </div>
            <div className="text-blue-600">
              {`}`} else if (typeof element.type === 'function') {`{`}
            </div>
            <div className="text-purple-600 ml-4">
              // Call component: element.type(element.props)
            </div>
            <div className="text-blue-600">{`}`}</div>
          </div>
        </div>

        {/* Interactive Demo */}
        <div className="space-y-6">
          <button
            onClick={handleInspect}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            🔍 Inspect Elements (Check Console!)
          </button>

          {showInspection && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h5 className="font-semibold text-gray-800 mb-3">
                  Native Element Example:
                </h5>
                {nativeElement}
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h5 className="font-semibold text-gray-800 mb-3">
                  Component Element Example:
                </h5>
                {componentElement}
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h5 className="font-semibold text-gray-800 mb-3">
                  Nested Structure Example:
                </h5>
                {nestedElement}
              </div>
            </div>
          )}
        </div>

        {/* The Complete Picture */}
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 p-6 rounded-lg border-l-4 border-gray-500 mt-8">
          <h4 className="text-xl font-semibold text-gray-800 mb-4">
            🎯 The Complete Rendering Process
          </h4>
          <div className="space-y-3 text-gray-700">
            <div className="flex items-start">
              <span className="text-blue-600 mr-3 font-bold">1.</span>
              <span>
                JSX creates element objects with{" "}
                <code className="bg-gray-200 px-2 py-1 rounded">type</code> and{" "}
                <code className="bg-gray-200 px-2 py-1 rounded">props</code>
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-green-600 mr-3 font-bold">2.</span>
              <span>
                React checks:{" "}
                <code className="bg-gray-200 px-2 py-1 rounded">
                  typeof element.type
                </code>
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-purple-600 mr-3 font-bold">3a.</span>
              <span>If string → Create DOM node (div, span, button, etc.)</span>
            </div>
            <div className="flex items-start">
              <span className="text-red-600 mr-3 font-bold">3b.</span>
              <span>
                If function → Call component function, get more elements
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-amber-600 mr-3 font-bold">4.</span>
              <span>Repeat recursively until only native elements remain</span>
            </div>
            <div className="flex items-start">
              <span className="text-indigo-600 mr-3 font-bold">5.</span>
              <span>Create final DOM tree and render to browser</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectReactElementDemo;
