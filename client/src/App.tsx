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
    isGenerating,
    isPuzzleComplete,
    error
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
          "Start New Puzzle"
        )}
      </button>

      {isGenerating && (
        <p className="generating-message">
          Please be patient, this may take a moment...
        </p>
      )}

      {error && <p className="error-message">{error}</p>}

      {puzzle && (
        <div className="game-layout">
          <div>
            {isPuzzleComplete && (
              <div className="puzzle-complete-badge">✓ Puzzle Complete!</div>
            )}
            <CrosswordGrid
              puzzle={puzzle}
              cellStates={cellStates}
              onGuess={submitGuess}
            />
          </div>
          <CluesList slots={puzzle.slots} completedSlots={completedSlots} />
        </div>
      )}
    </div>
  );
}

export default App;