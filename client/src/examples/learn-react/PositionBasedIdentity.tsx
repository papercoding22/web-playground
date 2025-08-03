import React, { useState } from "react";

// UserProfile component with internal state to demonstrate preservation
const UserProfile = ({ userId, role }: { userId: number; role: string }) => {
  // Internal state that we can track to see if component is preserved or remounted
  const [clickCount, setClickCount] = useState(0);
  const [inputValue, setInputValue] = useState("");

  // This will run every time the component mounts (not on re-renders)
  React.useEffect(() => {
    console.log(`UserProfile mounted for user ${userId} with role ${role}`);
    return () => {
      console.log(`UserProfile unmounted for user ${userId} with role ${role}`);
    };
  }, []); // Empty dependency array means this runs only on mount/unmount

  const isPrimary = role === "primary";

  return (
    <div
      className={`p-6 rounded-lg border-2 ${
        isPrimary
          ? "border-blue-500 bg-blue-50"
          : "border-green-500 bg-green-50"
      }`}
    >
      <div className="mb-4">
        <h3
          className={`text-xl font-bold ${
            isPrimary ? "text-blue-800" : "text-green-800"
          }`}
        >
          {isPrimary ? "👑 Primary User" : "👤 Secondary User"}
        </h3>
        <p className="text-gray-600">User ID: {userId}</p>
        <p className="text-gray-600">Role: {role}</p>
      </div>

      {/* Internal state that shows if component is preserved */}
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-700 mb-2">
            Click count (internal state):{" "}
            <span className="font-bold">{clickCount}</span>
          </p>
          <button
            onClick={() => setClickCount((c) => c + 1)}
            className={`px-4 py-2 rounded font-medium ${
              isPrimary
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-green-600 hover:bg-green-700"
            } text-white`}
          >
            Click me! ({clickCount})
          </button>
        </div>

        <div>
          <p className="text-sm text-gray-700 mb-2">
            Text input (internal state):
          </p>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type something..."
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

// Alternative component to show what happens when component type changes
const AdminProfile = ({ userId }: { userId: number }) => {
  const [clickCount, setClickCount] = useState(0);

  React.useEffect(() => {
    console.log(`AdminProfile mounted for user ${userId}`);
    return () => {
      console.log(`AdminProfile unmounted for user ${userId}`);
    };
  }, []);

  return (
    <div className="p-6 rounded-lg border-2 border-purple-500 bg-purple-50">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-purple-800">🔧 Admin User</h3>
        <p className="text-gray-600">User ID: {userId}</p>
      </div>

      <div>
        <p className="text-sm text-gray-700 mb-2">
          Admin clicks: <span className="font-bold">{clickCount}</span>
        </p>
        <button
          onClick={() => setClickCount((c) => c + 1)}
          className="px-4 py-2 rounded font-medium bg-purple-600 hover:bg-purple-700 text-white"
        >
          Admin Action ({clickCount})
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const [isPrimary, setIsPrimary] = useState(true);
  const [showDifferentComponent, setShowDifferentComponent] = useState(false);
  const [showConditionalExample, setShowConditionalExample] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          React Position-Based Identity Demo
        </h1>
        <p className="text-gray-600">
          Learn how React preserves component state based on position in the
          component tree
        </p>
      </div>

      {/* Example 1: Same component type, same position - STATE PRESERVED */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          🎯 Example 1: Same Component Type, Same Position
        </h2>
        <p className="text-gray-600 mb-4">
          The UserProfile component stays at the same position regardless of
          props. React preserves its internal state (click count and input
          text).
        </p>

        <div className="mb-4">
          <button
            onClick={() => setIsPrimary(!isPrimary)}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium"
          >
            Toggle Role ({isPrimary ? "Primary" : "Secondary"} →{" "}
            {isPrimary ? "Secondary" : "Primary"})
          </button>
        </div>

        <div className="border-2 border-dashed border-gray-300 p-4 rounded">
          <p className="text-sm text-gray-500 mb-2">Component at position 1:</p>
          {isPrimary ? (
            <UserProfile userId={123} role="primary" />
          ) : (
            <UserProfile userId={456} role="secondary" />
          )}
        </div>

        <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400">
          <p className="text-sm text-yellow-800">
            <strong>What's happening:</strong> Even though the userId and role
            props change, React sees the same component type (UserProfile) at
            the same position. The component instance is preserved and only
            props are updated.
          </p>
        </div>
      </div>

      {/* Example 2: Using key prop to force remount - STATE RESET */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          🔑 Example 2: Using Key Prop to Force Reset
        </h2>
        <p className="text-gray-600 mb-4">
          Same component type, same position, but with a key prop that changes
          with userId. React treats components with different keys as different
          instances.
        </p>

        <div className="mb-4">
          <button
            onClick={() => setIsPrimary(!isPrimary)}
            className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded font-medium"
          >
            Toggle with Key Reset ({isPrimary ? "Primary" : "Secondary"} →{" "}
            {isPrimary ? "Secondary" : "Primary"})
          </button>
        </div>

        <div className="border-2 border-dashed border-gray-300 p-4 rounded">
          <p className="text-sm text-gray-500 mb-2">
            Component at position 1 (with key prop):
          </p>
          {isPrimary ? (
            <UserProfile key={123} userId={123} role="primary" />
          ) : (
            <UserProfile key={456} userId={456} role="secondary" />
          )}
        </div>

        <div className="mt-4 p-4 bg-orange-50 border-l-4 border-orange-400">
          <p className="text-sm text-orange-800">
            <strong>What's happening:</strong> Even though it's the same
            component type (UserProfile) at the same position, the key prop
            changes from 123 to 456. React treats components with different keys
            as completely different instances, so it unmounts the old one and
            mounts a new one, resetting all state!
          </p>
        </div>
      </div>

      {/* Example 3: Different component types - STATE RESET */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          🔄 Example 3: Different Component Types
        </h2>
        <p className="text-gray-600 mb-4">
          When we render different component types at the same position, React
          unmounts the old component and mounts a new one, resetting all state.
        </p>

        <div className="mb-4">
          <button
            onClick={() => setShowDifferentComponent(!showDifferentComponent)}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium"
          >
            Switch Component Type ({showDifferentComponent ? "Admin" : "User"} →{" "}
            {showDifferentComponent ? "User" : "Admin"})
          </button>
        </div>

        <div className="border-2 border-dashed border-gray-300 p-4 rounded">
          <p className="text-sm text-gray-500 mb-2">Component at position 1:</p>
          {showDifferentComponent ? (
            <AdminProfile userId={789} />
          ) : (
            <UserProfile userId={123} role="primary" />
          )}
        </div>

        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400">
          <p className="text-sm text-red-800">
            <strong>What's happening:</strong> Different component types
            (UserProfile vs AdminProfile) at the same position cause React to
            unmount the old component and mount the new one. All internal state
            is lost! Check the console to see mount/unmount logs.
          </p>
        </div>
      </div>

      {/* Example 3: Conditional rendering with different positions */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          📍 Example 3: Same Component, Different Positions
        </h2>
        <p className="text-gray-600 mb-4">
          When the same component type appears at different positions in the
          tree, React treats them as different instances.
        </p>

        <div className="mb-4">
          <button
            onClick={() => setShowConditionalExample(!showConditionalExample)}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium"
          >
            Toggle Position ({showConditionalExample ? "Show Both" : "Show One"}
            )
          </button>
        </div>

        <div className="space-y-4">
          {showConditionalExample && (
            <div className="border-2 border-dashed border-gray-300 p-4 rounded">
              <p className="text-sm text-gray-500 mb-2">
                Component at position 1:
              </p>
              <UserProfile userId={111} role="primary" />
            </div>
          )}

          <div className="border-2 border-dashed border-gray-300 p-4 rounded">
            <p className="text-sm text-gray-500 mb-2">
              Component at position {showConditionalExample ? "2" : "1"}:
            </p>
            <UserProfile userId={222} role="secondary" />
          </div>
        </div>

        <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-400">
          <p className="text-sm text-green-800">
            <strong>What's happening:</strong> When you toggle, the second
            UserProfile component moves from position 1 to position 2 (or vice
            versa). React treats this as a different component instance, so its
            state gets reset. Try interacting with the second component before
            toggling to see the state reset.
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">
          🧪 Try This:
        </h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>
            Click the buttons and type in the input fields to create some
            internal state
          </li>
          <li>
            Toggle between different examples and observe what happens to the
            state
          </li>
          <li>
            Open your browser's console to see component mount/unmount logs
          </li>
          <li>
            Notice how Example 1 preserves state while Examples 2 and 3 reset it
          </li>
        </ol>

        <div className="mt-4 p-3 bg-blue-100 rounded">
          <p className="text-sm text-blue-800">
            <strong>Key Takeaway:</strong> React's reconciliation algorithm uses
            component position and type to determine whether to preserve or
            reset component state. Same type + same position = preserved state!
          </p>
        </div>
      </div>
    </div>
  );
}
