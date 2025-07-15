import React, { useState, useCallback } from "react";

// Type definitions
interface Counter {
  increment: () => number;
  decrement: () => number;
  getValue: () => number;
}

interface TimerFunction {
  start: () => void;
  stop: () => void;
  getElapsed: () => number;
}

const ClosureDemo: React.FC = () => {
  const [outputs, setOutputs] = useState<string[]>([]);
  const [counters, setCounters] = useState<Counter[]>([]);
  const [timers, setTimers] = useState<TimerFunction[]>([]);

  // Helper function to add output
  const addOutput = useCallback((message: string) => {
    setOutputs((prev) => [...prev, message]);
  }, []);

  // 1. Basic Closure Example
  const createMultiplier = (factor: number) => {
    return (num: number): number => {
      return num * factor; // 'factor' is captured from outer scope
    };
  };

  const demoBasicClosure = () => {
    const multiplyBy3 = createMultiplier(3);
    const multiplyBy5 = createMultiplier(5);

    addOutput(`multiplyBy3(4) = ${multiplyBy3(4)}`);
    addOutput(`multiplyBy5(4) = ${multiplyBy5(4)}`);
  };

  // 2. Counter with Private State
  const createCounter = (initialValue: number = 0): Counter => {
    let count = initialValue; // Private variable

    return {
      increment: (): number => ++count,
      decrement: (): number => --count,
      getValue: (): number => count,
    };
  };

  const demoCounterClosure = () => {
    const newCounter = createCounter(0);
    setCounters((prev) => [...prev, newCounter]);
    addOutput(`Counter ${counters.length + 1} created with initial value 0`);
  };

  // 3. Timer with Closure
  const createTimer = (): TimerFunction => {
    let startTime: number | null = null;
    let endTime: number | null = null;

    return {
      start: (): void => {
        startTime = Date.now();
        endTime = null;
      },
      stop: (): void => {
        if (startTime) {
          endTime = Date.now();
        }
      },
      getElapsed: (): number => {
        if (!startTime) return 0;
        const end = endTime || Date.now();
        return end - startTime;
      },
    };
  };

  const demoTimerClosure = () => {
    const newTimer = createTimer();
    setTimers((prev) => [...prev, newTimer]);
    addOutput(`Timer ${timers.length + 1} created`);
  };

  // 4. Function Factory with Configuration
  const createValidator = (minLength: number, maxLength: number) => {
    return (input: string): { isValid: boolean; message: string } => {
      if (input.length < minLength) {
        return {
          isValid: false,
          message: `Input must be at least ${minLength} characters`,
        };
      }
      if (input.length > maxLength) {
        return {
          isValid: false,
          message: `Input must be no more than ${maxLength} characters`,
        };
      }
      return { isValid: true, message: "Valid input" };
    };
  };

  const demoValidatorClosure = () => {
    const usernameValidator = createValidator(3, 20);
    const passwordValidator = createValidator(8, 100);

    const testUsername = "jo";
    const testPassword = "password123";

    const usernameResult = usernameValidator(testUsername);
    const passwordResult = passwordValidator(testPassword);

    addOutput(`Username "${testUsername}": ${usernameResult.message}`);
    addOutput(`Password "${testPassword}": ${passwordResult.message}`);
  };

  // 5. Event Handler with Closure
  const createClickHandler = (buttonId: string) => {
    let clickCount = 0;

    return (): void => {
      clickCount++;
      addOutput(`Button ${buttonId} clicked ${clickCount} times`);
    };
  };

  const button1Handler = createClickHandler("A");
  const button2Handler = createClickHandler("B");

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
        JavaScript Closure Demo in React TypeScript
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Demo Controls */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Closure Examples
          </h2>

          <div className="space-y-3">
            <button
              onClick={demoBasicClosure}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
            >
              1. Basic Closure (Multiplier)
            </button>

            <button
              onClick={demoCounterClosure}
              className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
            >
              2. Create Counter (Private State)
            </button>

            <button
              onClick={demoTimerClosure}
              className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition-colors"
            >
              3. Create Timer
            </button>

            <button
              onClick={demoValidatorClosure}
              className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition-colors"
            >
              4. Validator Factory
            </button>

            <div className="border-t pt-3">
              <p className="text-sm text-gray-600 mb-2">
                Event Handlers with Closure:
              </p>
              <div className="flex gap-2">
                <button
                  onClick={button1Handler}
                  className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
                >
                  Button A
                </button>
                <button
                  onClick={button2Handler}
                  className="flex-1 bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600 transition-colors"
                >
                  Button B
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Elements */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Interactive Elements
          </h2>

          {/* Counters */}
          {counters.length > 0 && (
            <div className="mb-4">
              <h3 className="font-medium mb-2">Counters:</h3>
              {counters.map((counter, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 mb-2 p-2 bg-gray-100 rounded"
                >
                  <span className="text-sm">Counter {index + 1}:</span>
                  <button
                    onClick={() =>
                      addOutput(`Counter ${index + 1}: ${counter.decrement()}`)
                    }
                    className="bg-red-400 text-white px-2 py-1 rounded text-xs hover:bg-red-500"
                  >
                    -
                  </button>
                  <span className="font-mono">{counter.getValue()}</span>
                  <button
                    onClick={() =>
                      addOutput(`Counter ${index + 1}: ${counter.increment()}`)
                    }
                    className="bg-green-400 text-white px-2 py-1 rounded text-xs hover:bg-green-500"
                  >
                    +
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Timers */}
          {timers.length > 0 && (
            <div className="mb-4">
              <h3 className="font-medium mb-2">Timers:</h3>
              {timers.map((timer, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 mb-2 p-2 bg-gray-100 rounded"
                >
                  <span className="text-sm">Timer {index + 1}:</span>
                  <button
                    onClick={() => {
                      timer.start();
                      addOutput(`Timer ${index + 1} started`);
                    }}
                    className="bg-blue-400 text-white px-2 py-1 rounded text-xs hover:bg-blue-500"
                  >
                    Start
                  </button>
                  <button
                    onClick={() => {
                      timer.stop();
                      addOutput(
                        `Timer ${index + 1} stopped at ${timer.getElapsed()}ms`
                      );
                    }}
                    className="bg-red-400 text-white px-2 py-1 rounded text-xs hover:bg-red-500"
                  >
                    Stop
                  </button>
                  <button
                    onClick={() =>
                      addOutput(
                        `Timer ${index + 1} elapsed: ${timer.getElapsed()}ms`
                      )
                    }
                    className="bg-gray-400 text-white px-2 py-1 rounded text-xs hover:bg-gray-500"
                  >
                    Check
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => setOutputs([])}
            className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
          >
            Clear Output
          </button>
        </div>

        {/* Output Console */}
        <div className="md:col-span-2 bg-black text-green-400 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Output Console</h2>
          <div className="h-64 overflow-y-auto font-mono text-sm">
            {outputs.length === 0 ? (
              <div className="text-gray-500">
                Click buttons above to see closure examples...
              </div>
            ) : (
              outputs.map((output, index) => (
                <div key={index} className="mb-1">
                  <span className="text-gray-400">{index + 1}:</span> {output}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Theory Section */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Key Closure Concepts Demonstrated
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-medium text-blue-600">1. Lexical Scoping</h3>
            <p className="text-gray-600">
              Inner functions access outer function variables
            </p>
          </div>
          <div>
            <h3 className="font-medium text-green-600">2. Private State</h3>
            <p className="text-gray-600">
              Variables are encapsulated and not directly accessible
            </p>
          </div>
          <div>
            <h3 className="font-medium text-purple-600">3. Function Factory</h3>
            <p className="text-gray-600">
              Creating specialized functions with preset configurations
            </p>
          </div>
          <div>
            <h3 className="font-medium text-orange-600">4. Event Handlers</h3>
            <p className="text-gray-600">
              Each handler maintains its own state via closure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClosureDemo;
