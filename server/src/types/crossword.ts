export type Direction = "across" | "down";

export type CellStatus = "empty" | "correct" | "incorrect";

export interface Cell {
  solutionLetter: string | null;
  isBlocked: boolean;
  number: number | null;
}

export interface WordSlot {
  number: number;
  row: number;
  col: number;
  direction: Direction;
  length: number;
  answer: string;
  clue: string;
}

export interface Grid {
  size: number;
  cells: Cell[][];
  slots: WordSlot[];
}