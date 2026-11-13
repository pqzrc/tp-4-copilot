// Logique de grille pure : aucune dépendance au DOM ni au canvas.

export const ROWS = 20;
export const COLS = 10;

export function createGrid(rows = ROWS, cols = COLS) {
  return Array.from({ length: rows }, () => Array(cols).fill(0));
}

// Vérifie qu'une pièce (matrice) à la position (ligne, colonne) ne sort pas de la
// grille et ne chevauche aucune cellule occupée.
export function isValidPosition(grid, matrix, row, col) {
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (matrix[r][c] === 0) continue;
      const gr = row + r;
      const gc = col + c;
      if (gc < 0 || gc >= grid[0].length || gr >= grid.length) return false;
      if (gr < 0) continue; // Autorise les cases au-dessus de la grille.
      if (grid[gr][gc] !== 0) return false;
    }
  }
  return true;
}

// Fige une pièce dans la grille (retourne une nouvelle grille).
export function lockPiece(grid, matrix, row, col) {
  const copy = grid.map((line) => line.slice());
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (matrix[r][c] === 0) continue;
      const gr = row + r;
      const gc = col + c;
      if (gr >= 0 && gr < copy.length && gc >= 0 && gc < copy[0].length) {
        copy[gr][gc] = matrix[r][c];
      }
    }
  }
  return copy;
}

// Supprime les lignes complètes, retourne la nouvelle grille et le nombre de
// lignes supprimées.
export function clearLines(grid) {
  const remaining = grid.filter((line) => line.some((cell) => cell === 0));
  const cleared = grid.length - remaining.length;
  const empty = Array.from({ length: cleared }, () => Array(grid[0].length).fill(0));
  return { grid: [...empty, ...remaining], cleared };
}

// Partie perdue dès qu'une cellule de la première ligne est occupée.
export function isGameOver(grid) {
  return grid[0].some((cell) => cell !== 0);
}
