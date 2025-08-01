import { useState, useTransition } from "react";

// Simulate heavy computation
const generateItems = (filter: string) => {
  const items = [];
  for (let i = 0; i < 90000; i++) {
    if (
      filter === "" ||
      `Item ${i}`.toLowerCase().includes(filter.toLowerCase())
    ) {
      items.push(`Item ${i}`);
    }
  }
  return items.slice(0, 100); // Show first 100 matches
};

function WithoutTransition() {
  const [filter, setFilter] = useState("");
  const [items, setItems] = useState(() => generateItems(""));

  const handleChange = (e: { target: { value: string; }; }) => {
    const value = e.target.value;
    setFilter(value); // This update is urgent
    setItems(generateItems(value)); // This update is also treated as urgent!
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">
        ❌ Without useTransition (Try typing quickly!)
      </h3>
      <input
        value={filter}
        onChange={handleChange}
        placeholder="Type to filter..."
        className="w-full p-2 border rounded mb-4"
      />
      <div className="text-sm text-gray-600 mb-2">
        Showing {items.length} items
      </div>
      <div className="h-32 overflow-y-auto bg-gray-50 p-2">
        {items.map((item, i) => (
          <div key={i} className="py-1">
            {item}
          </div>
        ))}
      </div>
      <p className="text-xs text-red-600 mt-2">
        Notice how typing feels laggy? Both input and list updates compete for
        priority.
      </p>
    </div>
  );
}

function WithTransition() {
  const [filter, setFilter] = useState("");
  const [items, setItems] = useState(() => generateItems(""));
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: { target: { value: string; }; }) => {
    const value = e.target.value;
    setFilter(value); // This stays urgent - updates immediately

    // This is marked as non-urgent - can be interrupted
    startTransition(() => {
      setItems(generateItems(value));
    });
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">✅ With useTransition (Much smoother!)</h3>
      <input
        value={filter}
        onChange={handleChange}
        placeholder="Type to filter..."
        className="w-full p-2 border rounded mb-4"
      />
      <div className="text-sm text-gray-600 mb-2">
        Showing {items.length} items
        {isPending && <span className="text-blue-600 ml-2">(Updating...)</span>}
      </div>
      <div className="h-32 overflow-y-auto bg-gray-50 p-2">
        {items.map((item, i) => (
          <div key={i} className="py-1">
            {item}
          </div>
        ))}
      </div>
      <p className="text-xs text-green-600 mt-2">
        Typing feels responsive! The list update is deprioritized.
      </p>
    </div>
  );
}

export default function TransitionDemo() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">useTransition Comparison</h1>
        <p className="text-gray-600">
          Type quickly in both inputs to feel the difference
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <WithoutTransition />
        <WithTransition />
      </div>

      <div className="bg-blue-50 p-4 rounded">
        <h3 className="font-bold mb-2">🔍 What's happening?</h3>
        <p className="text-sm">
          <strong>Without useTransition:</strong> Every keystroke triggers both
          urgent (input) and expensive (filtering) updates simultaneously,
          blocking the main thread.
        </p>
        <p className="text-sm mt-2">
          <strong>With useTransition:</strong> Input updates stay urgent while
          filtering becomes "interruptible" - React can pause it to handle new
          keystrokes.
        </p>
      </div>
    </div>
  );
}
