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
import DFSWordSearch from "./examples/dfs-word-search";

// ABCCED
const board = [
  ["A", "D", "E", "E"],
  ["S", "F", "C", "S"],
  ["A", "B", "C", "E"],
];

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
  "DFS Word Search": <DFSWordSearch board={board} word="ABCCED" />,
};

function App() {
  const [selectedDemo, setSelectedDemo] = useState("");

  return (
    <div style={styles.container}>
      <h1>React Demo</h1>
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

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default App;
