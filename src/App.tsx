import { useState, type JSX } from "react";
import "./App.css";

import RaceConditionExample from "./examples/race-condition";
import RaceConditionExampleSolution from "./examples/race-condition-solution";
import CapturedPropsChange from "./examples/captured-props-demo";
import StaleClosureDemo from "./examples/stale-closure-demo";
import StaleClosureDemoSolution from "./examples/stale-clousre-demo-solution";
import CapturedPropsChangeSolution from "./examples/captured-props-demo-solution";
import ListView from "./examples/list-view";
import ListViewSolution from "./examples/list-view-solution";
import RefreshTokenDemo from "./examples/refresh-token/refresh-token-demo";
import RefreshTokenChallenge from "./examples/refresh-token-challenge/refresh-token-challenge";

const demos: Record<string, JSX.Element> = {
  "Race Condition": <RaceConditionExample />,
  "Race Condition Solution": <RaceConditionExampleSolution />,
  "Stale Closure": <StaleClosureDemo />,
  "Stale Closure Solution": <StaleClosureDemoSolution />,
  "Captured Props Change": <CapturedPropsChange />,
  "Captured Props Change Solution": <CapturedPropsChangeSolution />,
  "List View": <ListView />,
  "List View Solution": <ListViewSolution />,
  "Refresh Token Challenge": <RefreshTokenChallenge />,
  "Refresh Token Demo": <RefreshTokenDemo />,
};

function App() {
  const [selectedDemo, setSelectedDemo] = useState("");

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h1>React Demo Switcher</h1>

      <select
        value={selectedDemo}
        onChange={(e) => setSelectedDemo(e.target.value)}
        style={{ padding: "0.5rem", fontSize: "1rem", marginBottom: "1rem" }}
      >
        <option value="">-- Select a demo --</option>
        {Object.keys(demos).map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>

      {/* Welcome Message if first load  */}
      {selectedDemo === "" && (
        <div style={{ marginBottom: "1rem" }}>
          <p>Select a demo from the dropdown above to see how React handles</p>
        </div>
      )}

      {selectedDemo && (
        <>
          <h2>{selectedDemo}</h2>
          {demos[selectedDemo]}
        </>
      )}
    </div>
  );
}

export default App;
