import { useState, type JSX } from "react";

import RaceConditionProblem from "./examples/RaceConditionProblem";
import RaceConditionSolution from "./examples/RaceConditionSolution";
import CapturedPropsChange from "./examples/CapturedPropsProblem";
import StaleClosureDemo from "./examples/StaleClosureProblem";
import StaleClosureDemoSolution from "./examples/StaleClosureDemo";
import CapturedPropsChangeSolution from "./examples/CapturedPropsSolution";
import ListView from "./examples/ListViewProblem";
import ListViewSolution from "./examples/ListViewSolution";
import RefreshTokenDemo from "./examples/refresh-token/refresh-token-demo";
import RefreshTokenChallenge from "./examples/refresh-token-challenge/refresh-token-challenge";
import DFSWordSearch from "./algo-visualizers/WordSearchVisualizer";
import MoveZeroes from "./algo-visualizers/MoveZeroes";
import SOPCSRFDemo from "./examples/fe-security/SOPCSRFDemo";
import XSSDemo from "./examples/fe-security/XSSDemo";
import HTTPSDemo from "./examples/fe-security/HTTPSDemo";
import ClosureDemo from "./examples/JSClosureDemo";
import DebouncedSearchDemo from "./examples/DebouncedSearchDemo";

const demos: Record<string, JSX.Element> = {
  "Race Condition": <RaceConditionProblem />,
  "Race Condition Solution": <RaceConditionSolution />,
  "Stale Closure": <StaleClosureDemo />,
  "Stale Closure Solution": <StaleClosureDemoSolution />,
  "Captured Props Change": <CapturedPropsChange />,
  "Captured Props Change Solution": <CapturedPropsChangeSolution />,
  "List View": <ListView />,
  "List View Solution": <ListViewSolution />,
  "Refresh Token Challenge": <RefreshTokenChallenge />,
  "Refresh Token Demo": <RefreshTokenDemo />,
  "DFS Word Search": <DFSWordSearch />,
  "Move Zeroes": <MoveZeroes />,
  "SOP/CSRF Demo": <SOPCSRFDemo />,
  "XSS Demo": <XSSDemo />,
  "HTTPS Demo": <HTTPSDemo />,
  "JS Closure Demo": <ClosureDemo />,
  "Debounced Search": <DebouncedSearchDemo />,
};

function App() {
  const [selectedDemo, setSelectedDemo] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            React Demo
          </h1>
          <div className="h-8 flex items-center justify-center">
            <p className="text-xl text-gray-300">
              {"Welcome to React Demo Playground! 🚀"}
            </p>
          </div>
        </div>

        {/* Demo selector */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <select
              value={selectedDemo}
              onChange={(e) => setSelectedDemo(e.target.value)}
              className="w-full px-6 py-4 text-lg bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-white/20 appearance-none cursor-pointer"
            >
              <option value="" className="bg-gray-800 text-white">
                ✨ Select a demo to explore
              </option>
              {Object.keys(demos).map((key) => (
                <option
                  key={key}
                  value={key}
                  className="bg-gray-800 text-white"
                >
                  {key}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg
                className="w-6 h-6 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Welcome Message if first load */}
        {selectedDemo === "" && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 text-center">
              <div className="text-6xl mb-6">🎯</div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Welcome to the React Playground
              </h2>
              <p className="text-gray-300 text-lg mb-6">
                Select a demo from the dropdown above to see how React handles
                various concepts and patterns.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-4 border border-blue-500/30">
                  <div className="text-3xl mb-2">⚡</div>
                  <h3 className="font-semibold text-white">Performance</h3>
                  <p className="text-sm text-gray-300">
                    Race conditions, closures, and optimization techniques
                  </p>
                </div>
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30">
                  <div className="text-3xl mb-2">🔒</div>
                  <h3 className="font-semibold text-white">Security</h3>
                  <p className="text-sm text-gray-300">
                    Authentication, tokens, and secure practices
                  </p>
                </div>
                <div className="bg-gradient-to-r from-pink-500/20 to-red-500/20 rounded-xl p-4 border border-pink-500/30">
                  <div className="text-3xl mb-2">🎨</div>
                  <h3 className="font-semibold text-white">Algorithms</h3>
                  <p className="text-sm text-gray-300">
                    Visualizers and interactive problem solving
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Demo content */}
        {selectedDemo && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white flex items-center">
                  <span className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></span>
                  {selectedDemo}
                </h2>
                <button
                  onClick={() => setSelectedDemo("")}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-colors duration-200 border border-red-500/30"
                >
                  Close
                </button>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                {demos[selectedDemo]}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 text-gray-400">
          <p>Built with React & Tailwind CSS ✨</p>
        </div>
      </div>
    </div>
  );
}

export default App;
