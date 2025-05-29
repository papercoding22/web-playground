import { useEffect, useRef, useState } from "react";

export default function StaleClosureDemoSolution() {
  const [count, setCount] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const countRef = useRef(count);

  useEffect(() => {
    // Update the ref whenever `count` changes
    countRef.current = count;
  }, [count]);

  function announceCount() {
    setLogs((prev) => [...prev, `⏳ Will announce count in 2s...`]);
    setTimeout(() => {
      // Captures `count` from THIS render
      setLogs((prev) => [
        ...prev,
        `📣 Count is: ${countRef.current}`, // Use the ref to get the latest count
      ]);
    }, 2000);
  }

  return (
    <div style={{ fontFamily: "sans-serif", padding: 20 }}>
      <h2>🧠 Stale Closure Demo</h2>
      <p style={{ fontSize: 24 }}>🔢 Count: {count}</p>
      <button
        onClick={() => setCount((c) => c + 1)}
        style={{ fontSize: 18, marginRight: 10 }}
      >
        ➕ Increment
      </button>
      <button onClick={announceCount} style={{ fontSize: 18 }}>
        📣 Announce Count in 2s
      </button>

      <div style={{ marginTop: 20 }}>
        <h3>🧾 Logs:</h3>
        <ul>
          {logs.map((log, i) => (
            <li key={i} style={{ fontFamily: "monospace" }}>
              {log}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
