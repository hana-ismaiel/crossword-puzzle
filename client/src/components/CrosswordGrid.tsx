import { Cell } from "./Cell";
import type { PuzzleShape, CellState } from "../types/crossword";

interface CrosswordGridProps {
  puzzle: PuzzleShape;
  cellStates: CellState[][];
  onGuess: (row: number, col: number, letter: string) => void;
}

export function CrosswordGrid({ puzzle, cellStates, onGuess }: CrosswordGridProps) {
  return (
    <div className="crossword-grid">
      {puzzle.cells.map((rowCells, rowIndex) => (
        <div className="grid-row" key={rowIndex}>
          {rowCells.map((cell, colIndex) => {
            const cellState = cellStates[rowIndex]?.[colIndex];

            return (
              <Cell
                key={colIndex}
                isBlocked={cell.isBlocked}
                number={cell.number}
                value={cellState?.value ?? ""}
                status={cellState?.status ?? "empty"}
                onChange={(letter) => onGuess(rowIndex, colIndex, letter)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}