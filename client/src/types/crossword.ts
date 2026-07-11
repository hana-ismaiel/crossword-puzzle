export type Direction = "across" | "down";

export type CellStatus = "empty" | "correct" | "incorrect";

export interface UserCell {
  isBlocked: boolean;
  number: number | null;
}

export interface UserWordSlot {
  number: number;
  row: number;
  col: number;
  direction: Direction;
  length: number;
  clue: string;
}

export interface PuzzleShape {
  size: number;
  cells: UserCell[][];
  slots: UserWordSlot[];
}

export interface CellState {
  value: string;
  status: CellStatus;
}

export interface CellSlotMap {
  [key: string]: {
    across?: UserWordSlot;
    down?: UserWordSlot;
  };
}