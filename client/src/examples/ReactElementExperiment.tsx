import React from "react";

// Simple function component
const Button: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log("🎯 Button function is being called!");
  return <button>{children}</button>;
};

const ReactElementExperiment: React.FC = () => {
  // Let's examine what JSX actually creates
  const element1 = <Button>Click me</Button>;
  const element2 = React.createElement(Button, { children: "Click me" });

  console.log("📊 What is element1?", element1);
  console.log("📊 What is element2?", element2);
  console.log("📊 Are they the same?", element1 === element2);

  // Let's also check the type
  console.log("📊 element1 type:", typeof element1);
  console.log("📊 element1 constructor:", element1.constructor.name);

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <h3 className="text-3xl font-bold text-gray-800 mb-2">
          React Element Experiment
        </h3>
        <p className="text-gray-600 mb-8 text-lg">
          Open your browser's developer console to see the logs! 🔍
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-lg border-l-4 border-purple-500">
            <h4 className="text-xl font-semibold text-purple-800 mb-4">
              The JSX Element:
            </h4>
            <div className="bg-white p-4 rounded-lg shadow-sm">{element1}</div>
          </div>

          <div className="bg-gradient-to-r from-green-100 to-teal-100 p-6 rounded-lg border-l-4 border-green-500">
            <h4 className="text-xl font-semibold text-green-800 mb-4">
              The React.createElement Element:
            </h4>
            <div className="bg-white p-4 rounded-lg shadow-sm">{element2}</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-lg border-l-4 border-amber-500">
          <h4 className="text-xl font-semibold text-amber-800 mb-4">
            🔬 Key Observations:
          </h4>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-amber-600 mr-2">🕒</span>
              <span>
                Check console: When did the Button function actually get called?
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-600 mr-2">🔍</span>
              <span>What type of object is the element?</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-600 mr-2">📊</span>
              <span>Compare the structure of the logged objects</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReactElementExperiment;
