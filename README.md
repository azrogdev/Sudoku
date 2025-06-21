# Robust Sudoku Engine

A powerful and flexible Sudoku module written in both **TypeScript** and **JavaScript**, capable of:

- Generating Sudoku puzzles of varying difficulty (Easy, Medium, Hard)
- Ensuring each puzzle has a **unique** solution
- Solving any valid Sudoku grid using backtracking
- Verifying move validity according to Sudoku rules

> Built with clarity, performance, and developer-friendliness in mind.

---

## 🚀 Features

- 🧩 **Puzzle Generator**: Create Sudoku puzzles with guaranteed unique solutions
- 🧠 **Solver**: Efficient backtracking algorithm that solves any valid grid
- ✅ **Move Validator**: Check if a number can be placed at a given position
- 📦 **TypeScript & JavaScript**: Use it in any frontend or backend project

---

## 📚 Usage
**Generate a new puzzle**
```ts
import Sudoku from './Sudoku';

const puzzle = Sudoku.create(2); // 1=Easy, 2=Medium, 3=Hard
console.log(puzzle.grid);
```
**Solve an existing puzzle**
```ts
const sudoku = new Sudoku(existingGrid);
const solved = sudoku.solve();

if (solved) {
  console.log("Solved grid:", sudoku.grid);
} else {
  console.log("No solution exists.");
}
```
**Validate a move**
```ts
const valid = sudoku.isValid(0, 4, 9); // Row 0, Column 4, Number 9
```

---

## 🧪 Example Output
```csharp
Generated Medium Puzzle:
[
  [5, 0, 0, 8, 0, 0, 0, 0, 1],
  [0, 0, 3, 0, 0, 7, 0, 0, 0],
  ...
]
```

---

## 📁 Project Structure
```bash
src/
├── Sudoku.ts     # Core engine (TypeScript)
├── Sudoku.js     # Transpiled version (JavaScript)
├── index.test.ts # Unit tests (optional)
```
