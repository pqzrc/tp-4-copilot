import { describe, it, expect } from 'vitest';
import { rotate } from '../src/core/piece.js';

describe('rotate', () => {
  it('fait pivoter une matrice 2x2 d un quart de tour horaire', () => {
    const matrix = [
      [1, 2],
      [3, 4],
    ];

    expect(rotate(matrix)).toEqual([
      [3, 1],
      [4, 2],
    ]);
  });

  it('fait pivoter une matrice 3x3 d un quart de tour horaire', () => {
    const matrix = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];

    expect(rotate(matrix)).toEqual([
      [7, 4, 1],
      [8, 5, 2],
      [9, 6, 3],
    ]);
  });

  it('leve une erreur pour une matrice non carree', () => {
    const matrix = [
      [1, 2, 3],
      [4, 5, 6],
    ];

    expect(() => rotate(matrix)).toThrow('La matrice doit être carrée.');
  });
});
