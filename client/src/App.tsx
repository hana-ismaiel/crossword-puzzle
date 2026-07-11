import { useCrosswordGame } from "./hooks/useCrosswordGame";
import { CrosswordGrid } from "./components/CrosswordGrid";
import { CluesList } from "./components/CluesList";
import "./App.css"

function App() {
  const {
    puzzle,
    cellStates,
    completedSlots,
    generateNewPuzzle,
    submitGuess,
    isGenerating
  } = useCrosswordGame();

  return (
    <div className="app">
      <h1>Crossword</h1>
      <button className="generate-button" onClick={generateNewPuzzle} disabled={isGenerating}>
        {isGenerating ? (
          <>
            <span className="spinner" /> Generating...
          </>
        ) : (
          "Generate New Puzzle"
        )}
      </button>

      {puzzle && (
        <div className="game-layout">
          <CrosswordGrid
            puzzle={puzzle}
            cellStates={cellStates}
            onGuess={submitGuess}
          />
          <CluesList slots={puzzle.slots} completedSlots={completedSlots} />
        </div>
      )}
    </div>
  );
}

export default App;