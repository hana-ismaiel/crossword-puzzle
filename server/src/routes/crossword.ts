import { Router } from "express";
import { createPuzzle } from "../services/puzzleService.js";
import type { Cell } from "../types/crossword.js";

export function createCrosswordRouter(words: string[]): Router {
  const router = Router();

  router.get("/generate", async (req, res) => {
    try {
      const grid = await createPuzzle(words);

      req.session.currentPuzzle = grid;

      const publicCells: Omit<Cell, "solutionLetter">[][] = grid.cells.map(
        (row) =>
          row.map((cell) => ({
            isBlocked: cell.isBlocked,
            number: cell.number,
          }))
      );

      res.json({
        size: grid.size,
        cells: publicCells,
        slots: grid.slots.map((slot) => ({
          number: slot.number,
          row: slot.row,
          col: slot.col,
          direction: slot.direction,
          length: slot.length,
          clue: slot.clue,
        })),
      });
    } catch (err) {
      console.error("Failed to generate puzzle:", err);
      res.status(500).json({ error: "Failed to generate puzzle" });
    }
  });

  router.post("/check", (req, res) => {
    const puzzle = req.session.currentPuzzle;
    if (!puzzle) {
      res.status(400).json({ error: "No active puzzle for this session" });
      return;
    }

    const { row, col, letter } = req.body;

    if (typeof row !== "number" || typeof col !== "number" || typeof letter !== "string") {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }

    const cellRow = puzzle.cells[row];
    const cell = cellRow ? cellRow[col] : undefined;

    if (!cell || cell.isBlocked) {
      res.status(400).json({ error: "Invalid cell position" });
      return;
    }

    const isCorrect = cell.solutionLetter?.toLowerCase() === letter.toLowerCase();

    res.json({
      row,
      col,
      status: isCorrect ? "correct" : "incorrect",
    });
  });

  return router;
}