import type { UserWordSlot, CellSlotMap, CellState } from "../types/crossword";

// Get every cell for a particular word (UserWordSlot)
export function getSlotCells(slot: UserWordSlot): { row: number; col: number }[] {
  const cells: { row: number; col: number }[] = [];

  for (let i = 0; i < slot.length; i++) {
    const row = slot.direction === "down" ? slot.row + i : slot.row;
    const col = slot.direction === "across" ? slot.col + i : slot.col;
    cells.push({ row, col });
  }

  return cells;
}

// Map each cell to its word slot
// Some cells have 2 word slots (down and across) - each 
export function buildCellSlotMap(slots: UserWordSlot[]): CellSlotMap {
  const map: CellSlotMap = {};

  for (const slot of slots) {
    for (const { row, col } of getSlotCells(slot)) {
      const key = `${row},${col}`;
      const entry = map[key] ?? {};
      entry[slot.direction] = slot;
      map[key] = entry;
    }
  }

  return map;
}

export function isSlotComplete(slot: UserWordSlot, cellStates: CellState[][]): boolean {
  const cells = getSlotCells(slot);

  return cells.every(({ row, col }) => {
    const rowStates = cellStates[row];
    const state = rowStates ? rowStates[col] : undefined;
    return state?.status === "correct";
  });
}