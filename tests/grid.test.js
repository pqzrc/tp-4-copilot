import { describe, it, expect } from 'vitest';
import { createGrid, isValidPosition, lockPiece, clearLines, isGameOver, COLS, ROWS } from '../src/core/grid.js';
import { PIECES } from '../src/core/piece.js';

describe('grille', () => {
  it('crée une grille vide 10x20', () => {
    const grid = createGrid();
    expect(grid.length).toBe(ROWS);
    expect(grid[0].length).toBe(COLS);
    expect(grid.flat().every((cell) => cell === 0)).toBe(true);
  });

  it('pose une pièce et vérifie les collisions', () => {
    const grid = createGrid();
    expect(isValidPosition(grid, PIECES.O, 0, 0)).toBe(true);

    const locked = lockPiece(grid, PIECES.O, 0, 0);
    expect(locked[0][0]).toBe(1);
    expect(isValidPosition(locked, PIECES.O, 0, 0)).toBe(false);
  });

  it('supprime une ligne complète', () => {
    const grid = createGrid();
    for (let c = 0; c < COLS; c++) {
      grid[ROWS - 1][c] = 1;
    }

    const { grid: updatedGrid, cleared } = clearLines(grid);
    expect(cleared).toBe(1);
    expect(updatedGrid[ROWS - 1].every((cell) => cell === 0)).toBe(true);
  });

  it('supprime plusieurs lignes à la fois', () => {
    const grid = createGrid();
    for (let c = 0; c < COLS; c++) {
      grid[ROWS - 1][c] = 1;
      grid[ROWS - 2][c] = 1;
    }

    const { grid: updatedGrid, cleared } = clearLines(grid);
    expect(cleared).toBe(2);
    expect(updatedGrid.length).toBe(ROWS);
  });

  it('détecte le game over (première ligne occupée)', () => {
    const grid = createGrid();
    grid[0][0] = 1;
    expect(isGameOver(grid)).toBe(true);
  });

  it('pas de game over sur une grille vide', () => {
    expect(isGameOver(createGrid())).toBe(false);
  });

  it('une pièce qui sort par le bas est invalide', () => {
    const grid = createGrid();
    expect(isValidPosition(grid, PIECES.I, ROWS - 1, 0)).toBe(false);
  });

  it('une pièce peut dépasser par le haut', () => {
    const grid = createGrid();
    expect(isValidPosition(grid, PIECES.I, -2, 0)).toBe(true);
  });
});
