import React, { useState, useEffect } from "react";

const directions = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

// Type definitions
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary" | "warning" | "success" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info";
  className?: string;
}

interface AlertProps {
  children: React.ReactNode;
  variant?: "error" | "warning" | "success" | "info";
  className?: string;
}

interface WordSearchVisualizerProps {
  board: string[][];
  word: string;
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
  size = "md",
  className = "",
  disabled = false,
}) => {
  const variants = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white",
    warning: "bg-orange-500 hover:bg-orange-600 text-white",
    success: "bg-green-500 hover:bg-green-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-6 py-4 text-lg",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
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
    info: "bg-blue-100 text-blue-800",
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

const WordSearchVisualizer: React.FC<WordSearchVisualizerProps> = ({
  board,
  word,
}) => {
  const [visited, setVisited] = useState<boolean[][]>([]);
  const [visiting, setVisiting] = useState<[number, number][]>([]);
  const [found, setFound] = useState(false);
  const [searching, setSearching] = useState(false);
  const [stats, setStats] = useState({ steps: 0, backtracks: 0 });

  useEffect(() => {
    setVisited(
      Array(board.length)
        .fill(null)
        .map(() => Array(board[0].length).fill(false))
    );
    setVisiting([]);
    setFound(false);
    setStats({ steps: 0, backtracks: 0 });
  }, [board, word]);

  const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const isValid = (i: number, j: number, visited: boolean[][]) => {
    return (
      i >= 0 &&
      i < board.length &&
      j >= 0 &&
      j < board[0].length &&
      !visited[i][j]
    );
  };

  const dfs = async (
    i: number,
    j: number,
    wordIndex: number,
    visitedCopy: boolean[][]
  ): Promise<boolean> => {
    if (wordIndex === word.length) return true;

    if (i >= 0 && i < board.length && j >= 0 && j < board[0].length) {
      setVisiting([[i, j]]);
      setStats((prev) => ({ ...prev, steps: prev.steps + 1 }));
      await sleep(500);
    }

    if (!isValid(i, j, visitedCopy) || board[i][j] !== word[wordIndex]) {
      setVisiting([]);
      await sleep(300);
      return false;
    }

    visitedCopy[i][j] = true;
    setVisited((prev) => {
      const newV = prev.map((row) => [...row]);
      newV[i][j] = true;
      return newV;
    });

    for (const [di, dj] of directions) {
      const ni = i + di;
      const nj = j + dj;
      if (await dfs(ni, nj, wordIndex + 1, visitedCopy)) {
        setVisiting([]);
        return true;
      }
    }

    visitedCopy[i][j] = false;
    setVisiting([]);
    setVisited((prev) => {
      const newV = prev.map((row) => [...row]);
      newV[i][j] = false;
      return newV;
    });
    setStats((prev) => ({ ...prev, backtracks: prev.backtracks + 1 }));
    await sleep(300);
    return false;
  };

  const startSearch = async () => {
    setSearching(true);
    setFound(false);
    setStats({ steps: 0, backtracks: 0 });

    const visited = Array(board.length)
      .fill(null)
      .map(() => Array(board[0].length).fill(false));

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        if (await dfs(i, j, 0, visited)) {
          setFound(true);
          setSearching(false);
          return;
        }
      }
    }
    setSearching(false);
  };

  const onReset = () => {
    setVisited(
      Array(board.length)
        .fill(null)
        .map(() => Array(board[0].length).fill(false))
    );
    setVisiting([]);
    setFound(false);
    setSearching(false);
    setStats({ steps: 0, backtracks: 0 });
  };

  const getCellStyle = (i: number, j: number) => {
    const isVisiting = visiting.some(([vi, vj]) => vi === i && vj === j);
    const isVisited = visited[i]?.[j];

    if (isVisiting) {
      return "bg-green-300 border-green-400 text-green-800 scale-110 shadow-lg";
    } else if (isVisited) {
      return "bg-yellow-200 border-yellow-300 text-yellow-800";
    } else {
      return "bg-white border-gray-300 text-gray-800 hover:bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🔍 DFS Word Search Visualizer
          </h1>
          <p className="text-gray-600">
            Watch the Depth-First Search algorithm find words in a grid
          </p>
        </div>

        {/* Algorithm Badge */}
        <div className="text-center">
          <Badge variant="info" className="text-base px-4 py-2">
            🧠 Depth-First Search Algorithm
          </Badge>
        </div>

        {/* Target Word & Stats */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-blue-600">
                {word.toUpperCase()}
              </p>
              <p className="text-sm text-gray-600">Target Word</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-purple-600">
                {stats.steps}
              </p>
              <p className="text-sm text-gray-600">Search Steps</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-orange-600">
                {stats.backtracks}
              </p>
              <p className="text-sm text-gray-600">Backtracks</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-green-600">{word.length}</p>
              <p className="text-sm text-gray-600">Word Length</p>
            </div>
          </div>
        </Card>

        {/* Control Buttons */}
        <Card>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={startSearch}
              variant="primary"
              disabled={searching}
              className="flex items-center space-x-2"
            >
              {searching ? (
                <>
                  <span className="animate-spin">🔄</span>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Start DFS Search</span>
                </>
              )}
            </Button>
            <Button onClick={onReset} variant="secondary" disabled={searching}>
              🔄 Reset
            </Button>
          </div>
        </Card>

        {/* Search Status */}
        {searching && (
          <Alert variant="info">
            <div className="flex items-center space-x-2">
              <span className="text-lg animate-pulse">🔍</span>
              <span className="font-semibold">Searching in progress...</span>
            </div>
            <p className="mt-1 text-sm">
              The algorithm is exploring the grid using depth-first search.
              Green cells are currently being explored.
            </p>
          </Alert>
        )}

        {found && (
          <Alert variant="success">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🎉</span>
              <span className="font-semibold">Word Found!</span>
            </div>
            <p className="mt-1 text-sm">
              Successfully found "{word.toUpperCase()}" in {stats.steps} steps
              with {stats.backtracks} backtracks.
            </p>
          </Alert>
        )}

        {/* Game Board */}
        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Search Grid
              </h3>
              <div className="flex space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-300 border border-green-400 rounded"></div>
                  <span>Currently Exploring</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-200 border border-yellow-300 rounded"></div>
                  <span>Visited</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
                  <span>Unvisited</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div
                className="grid gap-1 p-4 bg-gray-50 rounded-lg"
                style={{
                  gridTemplateColumns: `repeat(${board[0]?.length || 0}, 1fr)`,
                }}
              >
                {board.map((row, i) =>
                  row.map((char, j) => (
                    <div
                      key={`${i}-${j}`}
                      className={`
                        w-12 h-12 border-2 rounded-lg flex items-center justify-center
                        text-lg font-bold transition-all duration-300 transform
                        ${getCellStyle(i, j)}
                      `}
                    >
                      {char.toUpperCase()}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Algorithm Explanation */}
        <Card className="bg-blue-50 border-blue-200">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🧠</span>
              <h3 className="text-lg font-semibold text-blue-800">
                How DFS Works
              </h3>
            </div>
            <div className="text-sm text-blue-700 space-y-2">
              <p>
                <strong>Depth-First Search:</strong> Explores as far as possible
                along each branch before backtracking
              </p>
              <p>
                <strong>Word Search Strategy:</strong> For each cell, try to
                match the first character, then recursively search adjacent
                cells
              </p>
              <p>
                <strong>Backtracking:</strong> When a path doesn't lead to the
                complete word, the algorithm backtracks and tries other
                directions
              </p>
              <p>
                <strong>Directions:</strong> Searches in 4 directions: right,
                down, left, up
              </p>
            </div>
          </div>
        </Card>

        {/* Performance Stats */}
        {(stats.steps > 0 || found) && (
          <Card className="bg-purple-50 border-purple-200">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl">📊</span>
                <h3 className="text-lg font-semibold text-purple-800">
                  Algorithm Performance
                </h3>
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="bg-white p-3 rounded border border-purple-200">
                  <p className="text-lg font-bold text-purple-600">
                    {stats.steps}
                  </p>
                  <p className="text-sm text-gray-600">Total Steps Taken</p>
                </div>
                <div className="bg-white p-3 rounded border border-purple-200">
                  <p className="text-lg font-bold text-orange-600">
                    {stats.backtracks}
                  </p>
                  <p className="text-sm text-gray-600">Backtrack Operations</p>
                </div>
                <div className="bg-white p-3 rounded border border-purple-200">
                  <p className="text-lg font-bold text-green-600">
                    {stats.steps > 0
                      ? Math.round((stats.backtracks / stats.steps) * 100)
                      : 0}
                    %
                  </p>
                  <p className="text-sm text-gray-600">Backtrack Ratio</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Status Footer */}
        <div className="text-center">
          <div className="flex justify-center space-x-4">
            <Badge
              variant={found ? "success" : searching ? "warning" : "default"}
            >
              {found
                ? "Word Found"
                : searching
                ? "Searching..."
                : "Ready to Search"}
            </Badge>
            <Badge variant="info">
              Grid Size: {board.length}×{board[0]?.length || 0}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

// Example usage with default props
const WordSearchVisualizerDemo: React.FC = () => {
  const defaultBoard = [
    ["A", "B", "C", "E"],
    ["S", "F", "C", "S"],
    ["A", "D", "E", "E"],
  ];

  const defaultWord = "SEE";

  return <WordSearchVisualizer board={defaultBoard} word={defaultWord} />;
};

export default WordSearchVisualizerDemo;
