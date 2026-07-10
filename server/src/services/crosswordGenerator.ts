import type { Cell, Grid, WordSlot, Direction } from "../types/crossword.js";

const GRID_SIZE = 13;

export class CrosswordGenerator {
  private words: string[];

  constructor(words: string[]) {
    this.words = words;
  }

  generate(): Grid {
    const grid = this.createEmptyGrid();
    const availableWords = this.shuffle([...this.words]);

    this.placeFirstWord(grid, availableWords);

    let placedAnyThisPass = true;
    while (placedAnyThisPass) {
      placedAnyThisPass = false;
      const shuffled = this.shuffle([...availableWords]);

      for (const word of shuffled) {
        if (this.tryPlaceWord(grid, word)) {
          const index = availableWords.indexOf(word);
          availableWords.splice(index, 1);
          placedAnyThisPass = true;
          break;
        }
      }
    }

    this.blockUnusedCells(grid);
    this.assignNumbers(grid);

    return grid;
  }

  private createEmptyGrid(): Grid {
    const cells: Cell[][] = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < GRID_SIZE; c++) {
        row.push({ solutionLetter: null, isBlocked: false, number: null });
      }
      cells.push(row);
    }

    return { size: GRID_SIZE, cells, slots: [] };
  }

  private shuffle(arr: string[]): string[] {
    const shuffled = [...arr];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }

  private placeFirstWord(grid: Grid, availableWords: string[]): void {
    const word = availableWords.shift();
    if (!word) return;

    const direction: Direction = Math.random() < 0.5 ? "across" : "down";

    let row: number;
    let col: number;
    // Randomly pick a starting cell for the first word
    if (direction === "across") {
      row = Math.floor(Math.random() * GRID_SIZE);
      col = Math.floor(Math.random() * (GRID_SIZE - word.length + 1));
    } else {
      row = Math.floor(Math.random() * (GRID_SIZE - word.length + 1));
      col = Math.floor(Math.random() * GRID_SIZE);
    }

    this.placeWord(grid, word, row, col, direction);
  }

  private tryPlaceWord(grid: Grid, word: string): boolean {
    for (const slot of grid.slots) {
      for (let i = 0; i < slot.answer.length; i++) {
        const sharedLetter = slot.answer[i];

        for (let j = 0; j < word.length; j++) {
          if (word[j] !== sharedLetter) continue;

          const newDirection: Direction =
            slot.direction === "across" ? "down" : "across";

          const crossRow = slot.direction === "across" ? slot.row : slot.row + i;
          const crossCol = slot.direction === "across" ? slot.col + i : slot.col;

          const startRow = newDirection === "down" ? crossRow - j : crossRow;
          const startCol = newDirection === "across" ? crossCol - j : crossCol;

          if (this.isValidPlacement(grid, word, startRow, startCol, newDirection)) {
            this.placeWord(grid, word, startRow, startCol, newDirection);
            return true;
          }
        }
      }
    }

    return false;
  }

  private isValidPlacement(
    grid: Grid,
    word: string,
    startRow: number,
    startCol: number,
    direction: Direction
  ): boolean {
    if (startRow < 0 || startCol < 0) return false;

    const endRow = direction === "down" ? startRow + word.length - 1 : startRow;
    const endCol = direction === "across" ? startCol + word.length - 1 : startCol;

    if (endRow >= GRID_SIZE || endCol >= GRID_SIZE) return false;

    if (direction === "across") {
      if (startCol - 1 >= 0 && grid.cells[startRow][startCol - 1].solutionLetter !== null) return false;
      if (endCol + 1 < GRID_SIZE && grid.cells[startRow][endCol + 1].solutionLetter !== null) return false;
    } else {
      if (startRow - 1 >= 0 && grid.cells[startRow - 1][startCol].solutionLetter !== null) return false;
      if (endRow + 1 < GRID_SIZE && grid.cells[endRow + 1][startCol].solutionLetter !== null) return false;
    }

    for (let i = 0; i < word.length; i++) {
      const row = direction === "down" ? startRow + i : startRow;
      const col = direction === "across" ? startCol + i : startCol;

      const cell = grid.cells[row][col];
      const isCrossingCell = cell.solutionLetter !== null;

      if (isCrossingCell) {
        if (cell.solutionLetter !== word[i]) return false;
      } else {
        if (direction === "across") {
          if (row - 1 >= 0 && grid.cells[row - 1][col].solutionLetter !== null) return false;
          if (row + 1 < GRID_SIZE && grid.cells[row + 1][col].solutionLetter !== null) return false;
        } else {
          if (col - 1 >= 0 && grid.cells[row][col - 1].solutionLetter !== null) return false;
          if (col + 1 < GRID_SIZE && grid.cells[row][col + 1].solutionLetter !== null) return false;
        }
      }
    }

    return true;
  }

  private placeWord(
    grid: Grid,
    word: string,
    row: number,
    col: number,
    direction: Direction
  ): void {
    for (let i = 0; i < word.length; i++) {
      const r = direction === "down" ? row + i : row;
      const c = direction === "across" ? col + i : col;
      grid.cells[r][c].solutionLetter = word[i];
    }

    const slot: WordSlot = {
      number: 0,
      row,
      col,
      direction,
      length: word.length,
      answer: word,
      clue: "",
    };

    grid.slots.push(slot);
  }

  private blockUnusedCells(grid: Grid): void {
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (grid.cells[r][c].solutionLetter === null) {
          grid.cells[r][c].isBlocked = true;
        }
      }
    }
  }

  private assignNumbers(grid: Grid): void {
    let nextNumber = 1;

    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const cell = grid.cells[r][c];
        if (cell.isBlocked) continue;

        const startsAcross =
          (c === 0 || grid.cells[r][c - 1].isBlocked) &&
          c + 1 < GRID_SIZE &&
          !grid.cells[r][c + 1].isBlocked;

        const startsDown =
          (r === 0 || grid.cells[r - 1][c].isBlocked) &&
          r + 1 < GRID_SIZE &&
          !grid.cells[r + 1][c].isBlocked;

        if (startsAcross || startsDown) {
          cell.number = nextNumber;

          const acrossSlot = grid.slots.find(
            (s) => s.row === r && s.col === c && s.direction === "across"
          );
          if (acrossSlot) acrossSlot.number = nextNumber;

          const downSlot = grid.slots.find(
            (s) => s.row === r && s.col === c && s.direction === "down"
          );
          if (downSlot) downSlot.number = nextNumber;

          nextNumber++;
        }
      }
    }
  }
}