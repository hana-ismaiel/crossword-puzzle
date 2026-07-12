import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import type { PuzzleShape, CellState } from "../types/crossword";
import { buildCellSlotMap, isSlotComplete } from "../utils/crosswordUtils";

const API_BASE = import.meta.env.VITE_API_BASE;

function createEmptyCellStates(size: number): CellState[][] {
  const states: CellState[][] = [];
  for (let r = 0; r < size; r++) {
    const row: CellState[] = [];
    for (let c = 0; c < size; c++) {
      row.push({ value: "", status: "empty" });
    }
    states.push(row);
  }
  return states;
}

function applyProgress(
  size: number,
  progress: Record<string, { letter: string; status: "correct" | "incorrect" }>
): CellState[][] {
  const states = createEmptyCellStates(size);

  for (const key in progress) {
    const [rowStr, colStr] = key.split(",");
    const row = Number(rowStr);
    const col = Number(colStr);
    const entry = progress[key];

    const targetRow = states[row];
    if (targetRow && entry) {
      targetRow[col] = { value: entry.letter, status: entry.status };
    }
  }

  return states;
}

export function useCrosswordGame() {
  const [puzzle, setPuzzle] = useState<PuzzleShape | null>(null);
  const [cellStates, setCellStates] = useState<CellState[][]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function restoreSession() {
      try {
        const response = await axios.get(`${API_BASE}/puzzle`, {
          withCredentials: true,
        });

        setPuzzle(response.data);
        setCellStates(applyProgress(response.data.size, response.data.progress));
      } catch {
        // No active session puzzle
      }
    }

    restoreSession();
  }, []);

  const cellSlotMap = useMemo(() => {
    if (!puzzle) return {};
    return buildCellSlotMap(puzzle.slots);
  }, [puzzle]);

  const completedSlots = useMemo(() => {
    if (!puzzle) return new Set<string>();

    const completed = new Set<string>();
    for (const slot of puzzle.slots) {
      if (isSlotComplete(slot, cellStates)) {
        completed.add(`${slot.number}-${slot.direction}`);
      }
    }
    return completed;
  }, [puzzle, cellStates]);

  async function generateNewPuzzle() {
    setIsGenerating(true);
    setError(null);
    try {
      const response = await axios.get<PuzzleShape>(`${API_BASE}/generate`, {
        withCredentials: true,
      });

      setPuzzle(response.data);
      setCellStates(createEmptyCellStates(response.data.size));
    } catch (err) {
      console.log(err);
      setError("Couldn't generate a puzzle right now. Please try again later.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function submitGuess(row: number, col: number, letter: string) {
    if (letter === "") {
      setCellStates((prev) => {
        const next = prev.map((r) => [...r]);
        const targetRow = next[row];
        if (targetRow) {
          targetRow[col] = { value: "", status: "empty" };
        }
        return next;
      });
      return;
    }

    const response = await axios.post<{
      row: number;
      col: number;
      status: "correct" | "incorrect";
    }>(`${API_BASE}/check`, { row, col, letter }, { withCredentials: true });

    if (letter === "") return;
    
    const { status } = response.data;

    setCellStates((prev) => {
      const next = prev.map((r) => [...r]);
      const targetRow = next[row];
      if (targetRow) {
        targetRow[col] = { value: letter, status };
      }
      return next;
    });
  }

  const isPuzzleComplete = useMemo(() => {
    if (!puzzle) return false;

    for (let r = 0; r < puzzle.size; r++) {
      for (let c = 0; c < puzzle.size; c++) {
        const cell = puzzle.cells[r]?.[c];
        if (!cell || cell.isBlocked) continue;

        const state = cellStates[r]?.[c];
        if (state?.status !== "correct") return false;
      }
    }

    return true;
  }, [puzzle, cellStates]);

  return {
    puzzle,
    cellStates,
    cellSlotMap,
    completedSlots,
    generateNewPuzzle,
    submitGuess,
    isGenerating,
    isPuzzleComplete,
    error
  };
}