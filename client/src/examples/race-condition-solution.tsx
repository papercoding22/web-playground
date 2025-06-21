import React, { useEffect } from "react";
import { fakeGetName } from "../utils/fakeApis";

const RaceConditionExampleSolution = () => {
  const [input, setInput] = React.useState("");
  const [guest, setGuest] = React.useState("");
  const [log, setLog] = React.useState<string[]>([]);
  const [isRaceCondition, setIsRaceCondition] = React.useState(false);

  useEffect(() => {
    if (!input) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const delay = Math.random() * 2000 + 500; // Random delay
    const logMessage = `Fetching name for "${input}" with delay ${Math.round(
      delay
    )}ms`;
    setLog((prev) => [...prev, logMessage]);
    fakeGetName(input, delay).then((name) => {
      if (!signal.aborted) {
        setGuest(name);
      }
    });

    return () => {
      controller.abort(); // Clean up the effect by aborting the fetch
    };
  }, [input]);

  useEffect(() => {
    // Check for is race condition
    const lastLog = log[log.length - 1];
    if (lastLog && lastLog.includes("Fetching name for")) {
      const currentName = guest;
      const expectedName = lastLog.split('"')[1];
      if (currentName !== `Guest: ${expectedName}`) {
        setIsRaceCondition(true);
      } else {
        setIsRaceCondition(false);
      }
    }
  }, [guest, log]);

  return (
    <div style={{ fontFamily: "sans-serif", padding: 20 }}>
      <h2>🎉 Who’s Coming to the Party?</h2>
      <input
        placeholder="Type a name..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ fontSize: 20, padding: 10 }}
      />
      <p style={{ fontSize: 24 }}>🧑‍💼 {guest}</p>
      <p style={{ fontSize: 16, color: "gray" }}>
        (The guest name might change if you type quickly!)
      </p>
      <h3>📝 Log:</h3>
      <ul style={{ fontSize: 14, color: "darkgray" }}>
        {log.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
      {/* Red text "Race Condition" */}
      {isRaceCondition && (
        <p style={{ color: "red", fontWeight: "bold", fontSize: 18 }}>
          Race Condition Detected! 🚨
        </p>
      )}
    </div>
  );
};

export default RaceConditionExampleSolution;
