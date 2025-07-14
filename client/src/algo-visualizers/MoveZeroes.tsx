import React, { useState, useEffect } from "react";

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
  variant?:
    | "default"
    | "success"
    | "warning"
    | "error"
    | "info"
    | "slow"
    | "fast";
  className?: string;
}

interface AlertProps {
  children: React.ReactNode;
  variant?: "error" | "warning" | "success" | "info";
  className?: string;
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
    slow: "bg-orange-100 text-orange-800",
    fast: "bg-purple-100 text-purple-800",
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

interface Step {
  array: number[];
  slowPointer: number;
  fastPointer: number;
  action: string;
  description: string;
}

const MoveZeroesVisualizer: React.FC = () => {
  const [originalArray, setOriginalArray] = useState<number[]>([
    0, 1, 0, 3, 12,
  ]);
  const [currentArray, setCurrentArray] = useState<number[]>([0, 1, 0, 3, 12]);
  const [slowPointer, setSlowPointer] = useState<number>(-1);
  const [fastPointer, setFastPointer] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const [stats, setStats] = useState({ swaps: 0, comparisons: 0 });

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const generateSteps = (arr: number[]): Step[] => {
    const steps: Step[] = [];
    const workingArray = [...arr];
    let slow = 0;
    let swaps = 0;
    let comparisons = 0;

    // Initial state
    steps.push({
      array: [...workingArray],
      slowPointer: -1,
      fastPointer: -1,
      action: "Initialize",
      description:
        "Starting with the original array. Slow pointer will track position for next non-zero element.",
    });

    for (let fast = 0; fast < workingArray.length; fast++) {
      comparisons++;

      // Show current pointers
      steps.push({
        array: [...workingArray],
        slowPointer: slow,
        fastPointer: fast,
        action: `Check arr[${fast}] = ${workingArray[fast]}`,
        description: `Fast pointer checks if current element (${workingArray[fast]}) is non-zero.`,
      });

      if (workingArray[fast] !== 0) {
        if (slow !== fast) {
          // Swap elements
          [workingArray[slow], workingArray[fast]] = [
            workingArray[fast],
            workingArray[slow],
          ];
          swaps++;

          steps.push({
            array: [...workingArray],
            slowPointer: slow,
            fastPointer: fast,
            action: `Swap arr[${slow}] ↔ arr[${fast}]`,
            description: `Found non-zero element ${workingArray[slow]}. Swapped with position ${slow}.`,
          });
        } else {
          steps.push({
            array: [...workingArray],
            slowPointer: slow,
            fastPointer: fast,
            action: `No swap needed`,
            description: `Element is already in correct position. Both pointers at same location.`,
          });
        }
        slow++;
      }
    }

    // Final state
    steps.push({
      array: [...workingArray],
      slowPointer: -1,
      fastPointer: -1,
      action: "Complete!",
      description: `Algorithm finished! All zeros moved to the end. Total swaps: ${swaps}, comparisons: ${comparisons}.`,
    });

    return steps;
  };

  const runAlgorithm = async () => {
    setIsRunning(true);
    setIsComplete(false);
    setCurrentStep(0);

    const algorithmSteps = generateSteps(originalArray);
    setSteps(algorithmSteps);

    for (let i = 0; i < algorithmSteps.length; i++) {
      const step = algorithmSteps[i];
      setCurrentArray([...step.array]);
      setSlowPointer(step.slowPointer);
      setFastPointer(step.fastPointer);
      setCurrentStep(i);

      // Update stats
      const swaps = algorithmSteps
        .slice(0, i + 1)
        .filter((s) => s.action.includes("Swap")).length;
      const comparisons = algorithmSteps
        .slice(0, i + 1)
        .filter((s) => s.action.includes("Check")).length;
      setStats({ swaps, comparisons });

      await sleep(1500);
    }

    setIsComplete(true);
    setIsRunning(false);
    setSlowPointer(-1);
    setFastPointer(-1);
  };

  const reset = () => {
    setCurrentArray([...originalArray]);
    setSlowPointer(-1);
    setFastPointer(-1);
    setIsRunning(false);
    setIsComplete(false);
    setCurrentStep(0);
    setSteps([]);
    setStats({ swaps: 0, comparisons: 0 });
  };

  const setNewArray = (newArray: number[]) => {
    setOriginalArray(newArray);
    setCurrentArray([...newArray]);
    reset();
  };

  const getCellStyle = (index: number, value: number) => {
    const isSlowPointer = slowPointer === index;
    const isFastPointer = fastPointer === index;
    const isZero = value === 0;

    let baseStyle =
      "w-16 h-16 border-2 rounded-lg flex items-center justify-center text-xl font-bold transition-all duration-500 transform";

    if (isSlowPointer && isFastPointer) {
      return `${baseStyle} bg-gradient-to-r from-orange-200 to-purple-200 border-orange-400 text-gray-800 scale-110 shadow-lg`;
    } else if (isSlowPointer) {
      return `${baseStyle} bg-orange-200 border-orange-400 text-orange-800 scale-110 shadow-lg`;
    } else if (isFastPointer) {
      return `${baseStyle} bg-purple-200 border-purple-400 text-purple-800 scale-110 shadow-lg`;
    } else if (isZero) {
      return `${baseStyle} bg-red-100 border-red-300 text-red-600`;
    } else {
      return `${baseStyle} bg-green-100 border-green-300 text-green-700`;
    }
  };

  const presetArrays = [
    [0, 1, 0, 3, 12],
    [0, 0, 1],
    [1, 0, 2, 0, 0, 3],
    [0, 0, 0, 1, 2],
    [1, 2, 3, 0, 0],
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🎯 Move Zeroes - Two Pointers
          </h1>
          <p className="text-gray-600">
            Visualize the two-pointer technique to move all zeros to the end
          </p>
        </div>

        {/* Algorithm Badge */}
        <div className="text-center">
          <Badge variant="info" className="text-base px-4 py-2">
            🔄 Two Pointers Algorithm - O(n) Time, O(1) Space
          </Badge>
        </div>

        {/* Statistics Dashboard */}
        <Card>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-blue-600">
                {originalArray.length}
              </p>
              <p className="text-sm text-gray-600">Array Length</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-red-600">
                {originalArray.filter((x) => x === 0).length}
              </p>
              <p className="text-sm text-gray-600">Zero Count</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-orange-600">
                {stats.swaps}
              </p>
              <p className="text-sm text-gray-600">Swaps Made</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-purple-600">
                {stats.comparisons}
              </p>
              <p className="text-sm text-gray-600">Comparisons</p>
            </div>
          </div>
        </Card>

        {/* Array Input */}
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Choose Array
            </h3>
            <div className="flex flex-wrap gap-2">
              {presetArrays.map((preset, index) => (
                <Button
                  key={index}
                  onClick={() => setNewArray(preset)}
                  variant="secondary"
                  size="sm"
                  disabled={isRunning}
                  className="text-xs"
                >
                  [{preset.join(", ")}]
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Controls */}
        <Card>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={runAlgorithm}
              variant="primary"
              disabled={isRunning}
              className="flex items-center space-x-2"
            >
              {isRunning ? (
                <>
                  <span className="animate-spin">🔄</span>
                  <span>Running Algorithm...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Start Algorithm</span>
                </>
              )}
            </Button>
            <Button onClick={reset} variant="secondary" disabled={isRunning}>
              🔄 Reset
            </Button>
          </div>
        </Card>

        {/* Current Step Information */}
        {steps.length > 0 && (
          <Alert variant="info">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold">
                  Step {currentStep + 1} of {steps.length}:{" "}
                  {steps[currentStep]?.action}
                </span>
                <Badge variant="info">
                  Progress:{" "}
                  {Math.round(((currentStep + 1) / steps.length) * 100)}%
                </Badge>
              </div>
              <p className="text-sm">{steps[currentStep]?.description}</p>
            </div>
          </Alert>
        )}

        {/* Success Alert */}
        {isComplete && (
          <Alert variant="success">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🎉</span>
              <span className="font-semibold">Algorithm Complete!</span>
            </div>
            <p className="mt-1 text-sm">
              Successfully moved all zeros to the end in {stats.swaps} swaps and{" "}
              {stats.comparisons} comparisons.
            </p>
          </Alert>
        )}

        {/* Array Visualization */}
        <Card>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Array Visualization
              </h3>
              <div className="flex space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-orange-200 border border-orange-400 rounded"></div>
                  <span>Slow Pointer</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-purple-200 border border-purple-400 rounded"></div>
                  <span>Fast Pointer</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                  <span>Zero</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                  <span>Non-Zero</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="flex gap-2 p-4 bg-gray-50 rounded-lg">
                {currentArray.map((value, index) => (
                  <div key={index} className="relative">
                    <div className={getCellStyle(index, value)}>{value}</div>
                    <div className="text-xs text-gray-500 text-center mt-1">
                      {index}
                    </div>
                    {slowPointer === index && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                        <Badge variant="slow" className="text-xs">
                          Slow
                        </Badge>
                      </div>
                    )}
                    {fastPointer === index && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                        <Badge variant="fast" className="text-xs">
                          Fast
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Algorithm Explanation */}
        <Card className="bg-indigo-50 border-indigo-200">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🧠</span>
              <h3 className="text-lg font-semibold text-indigo-800">
                Two Pointers Algorithm
              </h3>
            </div>
            <div className="text-sm text-indigo-700 space-y-2">
              <p>
                <strong>🐌 Slow Pointer:</strong> Points to the position where
                the next non-zero element should be placed
              </p>
              <p>
                <strong>🏃‍♂️ Fast Pointer:</strong> Scans through the array
                looking for non-zero elements
              </p>
              <p>
                <strong>🔄 Strategy:</strong> When fast pointer finds a non-zero
                element, swap it with the slow pointer position
              </p>
              <p>
                <strong>⚡ Efficiency:</strong> Single pass through array (O(n)
                time) with in-place swapping (O(1) space)
              </p>
            </div>
          </div>
        </Card>

        {/* Code Implementation */}
        <Card className="bg-gray-50 border-gray-200">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-xl">💻</span>
              <h3 className="text-lg font-semibold text-gray-800">
                Algorithm Implementation
              </h3>
            </div>
            <div className="bg-gray-800 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
              <pre>{`function moveZeroes(nums) {
    let slow = 0;  // Points to next position for non-zero
    
    for (let fast = 0; fast < nums.length; fast++) {
        if (nums[fast] !== 0) {
            // Swap non-zero element to slow position
            [nums[slow], nums[fast]] = [nums[fast], nums[slow]];
            slow++;  // Move slow pointer forward
        }
    }
    return nums;
}`}</pre>
            </div>
          </div>
        </Card>

        {/* Status Footer */}
        <div className="text-center">
          <div className="flex justify-center space-x-4">
            <Badge
              variant={
                isComplete ? "success" : isRunning ? "warning" : "default"
              }
            >
              {isComplete
                ? "✅ Complete"
                : isRunning
                ? "🔄 Running"
                : "⏸️ Ready"}
            </Badge>
            <Badge variant="info">Time: O(n) | Space: O(1)</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoveZeroesVisualizer;
