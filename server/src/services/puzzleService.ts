import { CrosswordGenerator } from "./crosswordGenerator.js";
import { generateClues } from "./clueGenerator.js";
import type { Grid } from "../types/crossword.js";

export async function createPuzzle(words: string[]): Promise<Grid> {
  const generator = new CrosswordGenerator(words);
  const grid = generator.generate();

  const answers = grid.slots.map((slot) => slot.answer);
  const clues = await generateClues(answers);

  for (const slot of grid.slots) {
    slot.clue = clues[slot.answer] ?? "";
  }

  return grid;
}