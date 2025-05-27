import "./App.css";
import RaceConditionExample from "./examples/race-condition";
import RaceConditionExampleSolution from "./examples/race-condition-solution";

function App() {
  return (
    <>
      <h1>Race Condition Example:</h1>
      <RaceConditionExample />
      <h1>Solution:</h1>
      <RaceConditionExampleSolution />
    </>
  );
}

export default App;
