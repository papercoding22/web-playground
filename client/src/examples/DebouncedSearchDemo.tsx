import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import {
  Search,
  Clock,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

// Types
interface SearchResult {
  id: number;
  title: string;
  description: string;
  category: string;
}

interface SearchStats {
  totalSearches: number;
  cancelledSearches: number;
  completedSearches: number;
  averageResponseTime: number;
}

// Mock data for demonstration
const MOCK_DATA: SearchResult[] = [
  {
    id: 1,
    title: "React Hooks Guide",
    description: "Complete guide to React hooks and their usage",
    category: "Frontend",
  },
  {
    id: 2,
    title: "TypeScript Basics",
    description: "Getting started with TypeScript in modern web development",
    category: "Programming",
  },
  {
    id: 3,
    title: "Node.js Performance",
    description: "Optimizing Node.js applications for better performance",
    category: "Backend",
  },
  {
    id: 4,
    title: "CSS Grid Layout",
    description: "Master CSS Grid for modern web layouts",
    category: "CSS",
  },
  {
    id: 5,
    title: "JavaScript Closures",
    description: "Understanding closures and their practical applications",
    category: "JavaScript",
  },
  {
    id: 6,
    title: "API Design Patterns",
    description: "Best practices for designing RESTful APIs",
    category: "Backend",
  },
  {
    id: 7,
    title: "React Testing",
    description: "Testing React components with Jest and React Testing Library",
    category: "Testing",
  },
  {
    id: 8,
    title: "Web Performance",
    description: "Techniques for improving web application performance",
    category: "Performance",
  },
  {
    id: 9,
    title: "Database Optimization",
    description: "SQL query optimization and indexing strategies",
    category: "Database",
  },
  {
    id: 10,
    title: "GraphQL Introduction",
    description: "Getting started with GraphQL for modern APIs",
    category: "API",
  },
];

// Debounced Search with Cancellation Closure
const createDebouncedSearch = (delay: number = 300) => {
  let timeoutId: NodeJS.Timeout;
  let currentController: AbortController | null = null;
  let searchCounter = 0;

  return {
    search: (
      searchTerm: string,
      searchFn: (term: string, signal: AbortSignal) => Promise<any>,
      onCancel?: () => void
    ) => {
      // Cancel previous timeout
      clearTimeout(timeoutId);

      // Cancel previous request
      if (currentController) {
        currentController.abort();
        onCancel?.();
      }

      const searchId = ++searchCounter;

      return new Promise((resolve, reject) => {
        timeoutId = setTimeout(async () => {
          try {
            currentController = new AbortController();
            const startTime = Date.now();

            const result = await searchFn(searchTerm, currentController.signal);
            const responseTime = Date.now() - startTime;

            // Only resolve if this is still the latest search
            if (searchId === searchCounter) {
              resolve({ results: result, responseTime, searchId });
            }
          } catch (error: any) {
            if (error.name === "AbortError") {
              // Search was cancelled
              resolve({ cancelled: true, searchId });
            } else {
              reject(error);
            }
          }
        }, delay);
      });
    },

    cancel: () => {
      clearTimeout(timeoutId);
      if (currentController) {
        currentController.abort();
        currentController = null;
      }
    },

    getCurrentSearchId: () => searchCounter,
  };
};

// Mock API function that simulates network delay
const mockSearchAPI = (
  searchTerm: string,
  signal: AbortSignal
): Promise<SearchResult[]> => {
  return new Promise((resolve, reject) => {
    // Simulate variable network delay (300-1500ms)
    const delay = Math.random() * 1200 + 300;

    const timeoutId = setTimeout(() => {
      if (signal.aborted) {
        reject(new Error("AbortError"));
        return;
      }

      // Filter mock data based on search term
      const results = MOCK_DATA.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );

      resolve(results);
    }, delay);

    // Handle abort signal
    signal.addEventListener("abort", () => {
      clearTimeout(timeoutId);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
};

const DebouncedSearchDemo: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchStats, setSearchStats] = useState<SearchStats>({
    totalSearches: 0,
    cancelledSearches: 0,
    completedSearches: 0,
    averageResponseTime: 0,
  });
  const [logs, setLogs] = useState<string[]>([]);
  const [currentSearchId, setCurrentSearchId] = useState<number | null>(null);

  const responseTimesRef = useRef<number[]>([]);

  // Create debounced search instance
  const debouncedSearch = useMemo(() => createDebouncedSearch(500), []);

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 19)]); // Keep last 20 logs
  }, []);

  const updateStats = useCallback(
    (responseTime?: number, cancelled = false) => {
      setSearchStats((prev) => {
        const newStats = {
          totalSearches: prev.totalSearches + 1,
          cancelledSearches: prev.cancelledSearches + (cancelled ? 1 : 0),
          completedSearches: prev.completedSearches + (cancelled ? 0 : 1),
          averageResponseTime: prev.averageResponseTime,
        };

        if (responseTime && !cancelled) {
          responseTimesRef.current.push(responseTime);
          newStats.averageResponseTime =
            responseTimesRef.current.reduce((a, b) => a + b, 0) /
            responseTimesRef.current.length;
        }

        return newStats;
      });
    },
    []
  );

  const handleSearch = useCallback(
    async (term: string) => {
      if (!term.trim()) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const searchId = debouncedSearch.getCurrentSearchId() + 1;
      setCurrentSearchId(searchId);
      addLog(`🔍 Starting search for "${term}" (ID: ${searchId})`);

      try {
        const result: any = await debouncedSearch.search(
          term,
          mockSearchAPI,
          () => {
            addLog(`❌ Search cancelled for "${term}" (ID: ${searchId})`);
            updateStats(undefined, true);
          }
        );

        if (result.cancelled) {
          addLog(`⚠️ Search "${term}" was cancelled (ID: ${result.searchId})`);
          updateStats(undefined, true);
          setIsLoading(false);
          setCurrentSearchId(null);
        } else {
          // Extract the actual search results array from the result
          const searchResults = Array.isArray(result)
            ? result
            : result.results || [];
          setResults(searchResults);
          setIsLoading(false);
          setCurrentSearchId(null);
          addLog(
            `✅ Search completed for "${term}" in ${result.responseTime}ms (ID: ${result.searchId})`
          );
          updateStats(result.responseTime);
        }
      } catch (error) {
        setIsLoading(false);
        setCurrentSearchId(null);
        addLog(`💥 Search failed for "${term}": ${error.message}`);
      }
    },
    [debouncedSearch, addLog, updateStats]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearch(value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setResults([]);
    setIsLoading(false);
    debouncedSearch.cancel();
    addLog("🧹 Search cleared");
  };

  const clearLogs = () => {
    setLogs([]);
  };

  // Simulate fast typing
  const simulateFastTyping = () => {
    const queries = [
      "rea",
      "reac",
      "react",
      "react h",
      "react ho",
      "react hooks",
    ];
    let index = 0;

    const typeNext = () => {
      if (index < queries.length) {
        setSearchTerm(queries[index]);
        handleSearch(queries[index]);
        index++;
        setTimeout(typeNext, 200); // Type every 200ms
      }
    };

    typeNext();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
        Debounced Search with Cancellation Demo
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search Interface */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search Input */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Search for tutorials, guides, or topics..."
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Search Status */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {isLoading && (
                  <div className="flex items-center text-blue-600">
                    <Loader2 className="animate-spin mr-2" size={16} />
                    <span className="text-sm">
                      Searching... (ID: {currentSearchId})
                    </span>
                  </div>
                )}
                {!isLoading && results.length > 0 && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="mr-2" size={16} />
                    <span className="text-sm">
                      {results.length} results found
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={simulateFastTyping}
                className="bg-purple-500 text-white px-4 py-2 rounded text-sm hover:bg-purple-600 transition-colors"
              >
                Simulate Fast Typing
              </button>
            </div>
          </div>

          {/* Search Results */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Search Results</h2>
            </div>
            <div className="p-4">
              {!isLoading && results.length === 0 && searchTerm && (
                <div className="text-center text-gray-500 py-8">
                  <AlertCircle className="mx-auto mb-2" size={24} />
                  <p>No results found for "{searchTerm}"</p>
                </div>
              )}

              {!searchTerm && (
                <div className="text-center text-gray-500 py-8">
                  <Search className="mx-auto mb-2" size={24} />
                  <p>Start typing to search...</p>
                </div>
              )}

              <div className="space-y-3">
                {results.map((result) => (
                  <div
                    key={result.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-blue-600">
                        {result.title}
                      </h3>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {result.category}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {result.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats and Logs */}
        <div className="space-y-6">
          {/* Search Statistics */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Search Statistics</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Searches:</span>
                <span className="font-semibold">
                  {searchStats.totalSearches}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completed:</span>
                <span className="font-semibold text-green-600">
                  {searchStats.completedSearches}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cancelled:</span>
                <span className="font-semibold text-red-600">
                  {searchStats.cancelledSearches}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Response:</span>
                <span className="font-semibold">
                  {Math.round(searchStats.averageResponseTime)}ms
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Success Rate:</span>
                <span className="font-semibold">
                  {searchStats.totalSearches > 0
                    ? Math.round(
                        (searchStats.completedSearches /
                          searchStats.totalSearches) *
                          100
                      )
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>

          {/* Search Logs */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Search Logs</h2>
              <button
                onClick={clearLogs}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Clear
              </button>
            </div>
            <div className="p-4">
              <div className="h-64 overflow-y-auto bg-gray-900 text-green-400 p-3 rounded font-mono text-xs">
                {logs.length === 0 ? (
                  <div className="text-gray-500">No logs yet...</div>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="mb-1">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* How it Works */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-3">
              How Debouncing Works
            </h3>
            <div className="text-sm text-blue-700 space-y-2">
              <p>
                • <strong>500ms delay:</strong> Waits before searching
              </p>
              <p>
                • <strong>Cancellation:</strong> Aborts previous requests
              </p>
              <p>
                • <strong>Closure:</strong> Remembers timeout & controller
              </p>
              <p>
                • <strong>Performance:</strong> Reduces API calls by ~80%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebouncedSearchDemo;
