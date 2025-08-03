import { useState, Suspense, lazy, type JSX } from "react";

// Code-split demos by lazy loading
// React Concepts
const RaceConditionProblem = lazy(
  () => import("./examples/learn-react/RaceConditionProblem")
);
const RaceConditionSolution = lazy(
  () => import("./examples/learn-react/RaceConditionSolution")
);
const StaleClosureDemo = lazy(
  () => import("./examples/learn-react/StaleClosureProblem")
);
const StaleClosureDemoSolution = lazy(
  () => import("./examples/learn-react/StaleClosureDemo")
);
const CapturedPropsChange = lazy(
  () => import("./examples/learn-react/CapturedPropsProblem")
);
const CapturedPropsChangeSolution = lazy(
  () => import("./examples/learn-react/CapturedPropsSolution")
);
const ListView = lazy(() => import("./examples/learn-react/ListViewProblem"));
const ListViewSolution = lazy(
  () => import("./examples/learn-react/ListViewSolution")
);
const ShoppingCartReact = lazy(
  () => import("./examples/learn-react/ShoppingCartReact")
);
const ShoppingCartDOM = lazy(
  () => import("./examples/learn-react/ShoppingCartDOM")
);
const PositionBasedIdentityDemo = lazy(
  () => import("./examples/learn-react/PositionBasedIdentity")
);

// React Internals
const ReactElementExperiment = lazy(
  () => import("./examples/ReactElementExperiment")
);
const ReactPhaseExperiment = lazy(
  () => import("./examples/ReactPhaseExperiment")
);
const InspectReactElementDemo = lazy(
  () => import("./examples/InspectReactElementObject")
);
const JSONSymbolExperiment = lazy(
  () => import("./examples/ReactSymbolExperiment")
);
const DOMConstructionDemo = lazy(
  () => import("./examples/DOMConstructionDemo")
);

// Security
const SOPCSRFDemo = lazy(() => import("./examples/fe-security/SOPCSRFDemo"));
const XSSDemo = lazy(() => import("./examples/fe-security/XSSDemo"));
const HTTPSDemo = lazy(() => import("./examples/fe-security/HTTPSDemo"));
const RealisticXSSScenario = lazy(() => import("./examples/ReactXSS"));

// Authentication & Tokens
const RefreshTokenDemo = lazy(
  () => import("./examples/refresh-token/refresh-token-demo")
);
const RefreshTokenChallenge = lazy(
  () => import("./examples/refresh-token-challenge/refresh-token-challenge")
);

// Algorithms & Visualizers
const DFSWordSearch = lazy(
  () => import("./algo-visualizers/WordSearchVisualizer")
);
const MoveZeroes = lazy(() => import("./algo-visualizers/MoveZeroes"));

// JavaScript Concepts
const ClosureDemo = lazy(() => import("./examples/learn-react/JSClosureDemo"));

// Performance & Optimization
const DebouncedSearchDemo = lazy(
  () => import("./examples/DebouncedSearchDemo")
);

// UI Components
const Calendar = lazy(() =>
  import("./examples/calendar").then((module) => ({ default: module.Calendar }))
);
const BookingGridDemo = lazy(
  () => import("./examples/bookig-grid/BookingGridDemo")
);

// Define demo categories with their respective demos
interface DemoCategory {
  name: string;
  icon: string;
  description: string;
  color: string;
  demos: Record<string, React.LazyExoticComponent<() => JSX.Element>>;
}

const demoCategories: Record<string, DemoCategory> = {
  "React Concepts": {
    name: "React Concepts",
    icon: "⚛️",
    description: "Core React patterns and state management",
    color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
    demos: {
      "Race Condition Problem": RaceConditionProblem,
      "Race Condition Solution": RaceConditionSolution,
      "Stale Closure Problem": StaleClosureDemo,
      "Stale Closure Solution": StaleClosureDemoSolution,
      "Captured Props Problem": CapturedPropsChange,
      "Captured Props Solution": CapturedPropsChangeSolution,
      "List View Problem": ListView,
      "List View Solution": ListViewSolution,
      "Position Based Identity": PositionBasedIdentityDemo,
      "Shopping Cart (React)": ShoppingCartReact,
      "Shopping Cart (DOM)": ShoppingCartDOM,
    },
  },
  "React Internals": {
    name: "React Internals",
    icon: "🔍",
    description: "Deep dive into how React works under the hood",
    color: "from-purple-500/20 to-violet-500/20 border-purple-500/30",
    demos: {
      "React Element Experiment": ReactElementExperiment,
      "React Phase Experiment": ReactPhaseExperiment,
      "Inspect React Element": InspectReactElementDemo,
      "React Symbol Experiment": JSONSymbolExperiment,
      "DOM Construction Demo": DOMConstructionDemo,
    },
  },
  "Frontend Security": {
    name: "Frontend Security",
    icon: "🔒",
    description: "Security vulnerabilities and protection techniques",
    color: "from-red-500/20 to-orange-500/20 border-red-500/30",
    demos: {
      "SOP/CSRF Demo": SOPCSRFDemo,
      "XSS Demo": XSSDemo,
      "HTTPS Demo": HTTPSDemo,
      "Realistic XSS Scenario": RealisticXSSScenario,
    },
  },
  Authentication: {
    name: "Authentication",
    icon: "🔐",
    description: "Token management and authentication flows",
    color: "from-green-500/20 to-emerald-500/20 border-green-500/30",
    demos: {
      "Refresh Token Demo": RefreshTokenDemo,
      "Refresh Token Challenge": RefreshTokenChallenge,
    },
  },
  Algorithms: {
    name: "Algorithms",
    icon: "🧮",
    description: "Algorithm visualizations and problem solving",
    color: "from-yellow-500/20 to-amber-500/20 border-yellow-500/30",
    demos: {
      "DFS Word Search": DFSWordSearch,
      "Move Zeroes": MoveZeroes,
    },
  },
  "JavaScript Core": {
    name: "JavaScript Core",
    icon: "📚",
    description: "Fundamental JavaScript concepts and patterns",
    color: "from-indigo-500/20 to-blue-500/20 border-indigo-500/30",
    demos: {
      "JS Closure Demo": ClosureDemo,
    },
  },
  Performance: {
    name: "Performance",
    icon: "⚡",
    description: "Optimization techniques and performance patterns",
    color: "from-pink-500/20 to-rose-500/20 border-pink-500/30",
    demos: {
      "Debounced Search": DebouncedSearchDemo,
    },
  },
  "UI Components": {
    name: "UI Components",
    icon: "🎨",
    description: "Reusable UI components and interfaces",
    color: "from-teal-500/20 to-cyan-500/20 border-teal-500/30",
    demos: {
      "Calendar View": Calendar,
      "Booking Grid Demo": BookingGridDemo,
    },
  },
};

// Loading component for Suspense
const DemoLoader = () => (
  <div className="flex items-center justify-center py-12">
    <div className="relative">
      <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
      <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-pink-500 rounded-full animate-spin animation-delay-75"></div>
    </div>
    <span className="ml-4 text-white text-lg">Loading demo...</span>
  </div>
);

// Error boundary for failed demo loads
const DemoErrorBoundary = ({
  children,
  demoName,
}: {
  children: React.ReactNode;
  demoName: string;
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-6xl mb-4">😵</div>
        <h3 className="text-xl font-semibold text-red-400 mb-2">
          Demo Failed to Load
        </h3>
        <p className="text-gray-400 mb-4">
          There was an error loading "{demoName}"
        </p>
        <button
          onClick={() => setHasError(false)}
          className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 rounded-lg transition-colors duration-200 border border-purple-500/30"
        >
          Try Again
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedDemo, setSelectedDemo] = useState<string>("");

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedDemo(""); // Reset demo selection when changing category
  };

  const handleDemoSelect = (demo: string) => {
    setSelectedDemo(demo);
  };

  const handleBack = () => {
    if (selectedDemo) {
      setSelectedDemo("");
    } else {
      setSelectedCategory("");
    }
  };

  const currentCategory = selectedCategory
    ? demoCategories[selectedCategory]
    : null;
  const CurrentDemoComponent =
    selectedDemo && currentCategory
      ? currentCategory.demos[selectedDemo]
      : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            React Demo Playground
          </h1>
          <div className="h-8 flex items-center justify-center">
            <p className="text-xl text-gray-300">
              Explore React concepts, patterns, and best practices 🚀
            </p>
          </div>
        </div>

        {/* Navigation Breadcrumb */}
        {(selectedCategory || selectedDemo) && (
          <div className="max-w-4xl mx-auto mb-8">
            <nav className="flex items-center space-x-2 text-sm">
              <button
                onClick={() => {
                  setSelectedCategory("");
                  setSelectedDemo("");
                }}
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                Home
              </button>
              {selectedCategory && (
                <>
                  <span className="text-gray-500">/</span>
                  <button
                    onClick={() => setSelectedDemo("")}
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    {selectedCategory}
                  </button>
                </>
              )}
              {selectedDemo && (
                <>
                  <span className="text-gray-500">/</span>
                  <span className="text-gray-300">{selectedDemo}</span>
                </>
              )}
            </nav>
          </div>
        )}

        {/* Back button */}
        {(selectedCategory || selectedDemo) && (
          <div className="max-w-4xl mx-auto mb-6">
            <button
              onClick={handleBack}
              className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-200 border border-white/20"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>
          </div>
        )}

        {/* Category Selection */}
        {!selectedCategory && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Choose a Category
              </h2>
              <p className="text-gray-300">
                Select a category to explore related demos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(demoCategories).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => handleCategorySelect(key)}
                  className={`bg-gradient-to-r ${category.color} rounded-xl p-6 border hover:scale-105 transition-all duration-300 text-left group`}
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {Object.keys(category.demos).length} demos
                    </span>
                    <svg
                      className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Demo Selection within Category */}
        {selectedCategory && !selectedDemo && currentCategory && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">{currentCategory.icon}</div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {currentCategory.name}
              </h2>
              <p className="text-gray-300">{currentCategory.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(currentCategory.demos).map((demoName) => (
                <button
                  key={demoName}
                  onClick={() => handleDemoSelect(demoName)}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/20 text-left transition-all duration-300 hover:scale-105 group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {demoName}
                      </h3>
                      <p className="text-sm text-gray-400">Click to explore</p>
                    </div>
                    <svg
                      className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Demo Content */}
        {selectedDemo && CurrentDemoComponent && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white flex items-center">
                  <span className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></span>
                  {selectedDemo}
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400 px-3 py-1 bg-white/10 rounded-full">
                    {selectedCategory}
                  </span>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <DemoErrorBoundary demoName={selectedDemo}>
                  <Suspense fallback={<DemoLoader />}>
                    <CurrentDemoComponent />
                  </Suspense>
                </DemoErrorBoundary>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 text-gray-400">
          <p>Built with React, TypeScript & Tailwind CSS ✨</p>
          {selectedCategory && (
            <p className="text-sm mt-2">
              Demos are lazy-loaded for optimal performance 🚀
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
