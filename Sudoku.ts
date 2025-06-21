/*
 * Sudoku generator and solver in TypeScript
 * Features:
 * - create: generate a Sudoku puzzle of given difficulty (1=Easy,2=Medium,3=Hard) with unique solution
 * - solve: solve a given Sudoku grid
 * - isValid: check if placing a number at a position is valid according to Sudoku rules
 * 
 * Uses backtracking for both generation and solving.
 */

export default class Sudoku {
  /** 9x9 grid represented as a 2D array */
  public grid: number[][];

  constructor(initialGrid?: number[][]) {
    // Initialize with provided grid or an empty grid
    this.grid = initialGrid
      ? initialGrid.map(row => [...row])
      : Array.from({ length: 9 }, () => Array(9).fill(0));
  }

  /**
   * Generate a new Sudoku puzzle with a unique solution.
   * @param difficulty - 1 (Easy), 2 (Medium), 3 (Hard)
   * @returns Sudoku instance with puzzle in `grid` property
   */
  public static create(difficulty: 1 | 2 | 3): Sudoku {
    const sudoku = new Sudoku();
    // Step 1: Generate a fully solved grid
    sudoku.fillGrid();

    // Step 2: Remove numbers to create puzzle
    const attempts = [30, 40, 50]; // approximate removals per difficulty
    let removed = 0;
    const targetRemovals = attempts[difficulty - 1];

    // List of all cell positions
    const cells = Array.from({ length: 81 }, (_, i) => ({
      row: Math.floor(i / 9),
      col: i % 9
    }));
    // Shuffle cells randomly
    Sudoku.shuffle(cells);

    for (const { row, col } of cells) {
      if (removed >= targetRemovals) break;
      const backup = sudoku.grid[row][col];
      sudoku.grid[row][col] = 0;

      // Check uniqueness: if more than one solution, revert removal
      const gridCopy = sudoku.copyGrid();
      const count = Sudoku.countSolutions(gridCopy, 2);
      if (count !== 1) {
        // Not unique, restore
        sudoku.grid[row][col] = backup;
      } else {
        removed++;
      }
    }

    return sudoku;
  }

  /**
   * Solve the current Sudoku grid in-place.
   * @returns true if solved, false if no solution exists
   */
  public solve(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (this.grid[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (this.isValid(row, col, num)) {
              this.grid[row][col] = num;
              if (this.solve()) {
                return true;
              }
              this.grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true; // no empty cells
  }

  /**
   * Check if placing `num` at (row, col) is valid.
   * @param row - row index (0-8)
   * @param col - column index (0-8)
   * @param num - number to place (1-9)
   * @returns true if valid, false otherwise
   */
  public isValid(row: number, col: number, num: number): boolean {
    // Check row and column
    for (let i = 0; i < 9; i++) {
      if (this.grid[row][i] === num || this.grid[i][col] === num) return false;
    }
    // Check 3x3 block
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if (this.grid[r][c] === num) return false;
      }
    }
    return true;
  }

  /**
   * Fill the grid completely to produce a valid, solved Sudoku.
   * Uses backtracking and random number order.
   */
  public fillGrid(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (this.grid[row][col] === 0) {
          const numbers = Sudoku.range(1, 9);
          Sudoku.shuffle(numbers);
          for (const num of numbers) {
            if (this.isValid(row, col, num)) {
              this.grid[row][col] = num;
              if (this.fillGrid()) {
                return true;
              }
              this.grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Count number of solutions for a grid up to a maximum.
   * @param grid - 2D array of numbers
   * @param limit - max solutions to search for
   * @returns number of solutions found (<= limit)
   */
  public static countSolutions(grid: number[][], limit: number): number {
    let count = 0;
    const solver = (g: number[][]): boolean => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (g[row][col] === 0) {
            for (let num = 1; num <= 9; num++) {
              if (Sudoku.isValidStatic(g, row, col, num)) {
                g[row][col] = num;
                if (solver(g)) return true;
                g[row][col] = 0;
              }
            }
            return false;
          }
        }
      }
      count++;
      return count >= limit;
    };
    solver(grid);
    return count;
  }

  /**
   * Static validity check for a standalone grid.
   */
  public static isValidStatic(grid: number[][], row: number, col: number, num: number): boolean {
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === num || grid[i][col] === num) return false;
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if (grid[r][c] === num) return false;
      }
    }
    return true;
  }

  /**
   * Utility: create a deep copy of the current grid.
   */
  public copyGrid(): number[][] {
    return this.grid.map(row => [...row]);
  }

  /**
   * Utility: generate an array of numbers from low to high inclusive.
   */
  public static range(low: number, high: number): number[] {
    const arr: number[] = [];
    for (let i = low; i <= high; i++) arr.push(i);
    return arr;
  }

  /**
   * Utility: Fisher–Yates shuffle.
   */
  public static shuffle<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}
