import { useCrosswordGame } from "./hooks/useCrosswordGame";
import { CrosswordGrid } from "./components/CrosswordGrid";
import "./App.css";

function App() {
  const { puzzle, cellStates, generateNewPuzzle, submitGuess } =
    useCrosswordGame();

  return (
    <div className="app">
      <h1>Crossword</h1>
      <button onClick={generateNewPuzzle}>Generate New Puzzle</button>

      {puzzle && (
        <CrosswordGrid
          puzzle={puzzle}
          cellStates={cellStates}
          onGuess={submitGuess}
        />
      )}
    </div>
  );
}

export default App;