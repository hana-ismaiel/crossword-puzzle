import { Router } from "express";
import { createPuzzle } from "../services/puzzleService.js";

export function createCrosswordRouter(words: string[]): Router {
  const router = Router();

  router.get("/generate", async (_req, res) => {
    try {
      const grid = await createPuzzle(words);
      res.json(grid);
    } catch (err) {
      console.error("Failed to generate puzzle:", err);
      res.status(500).json({ error: "Failed to generate puzzle" });
    }
  });

  return router;
}