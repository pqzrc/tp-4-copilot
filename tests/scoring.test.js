import { describe, it, expect } from 'vitest';
import { scoreForLines, levelForLines, speedForLevel, LINE_SCORES } from '../src/core/scoring.js';

describe('scoring', () => {
  it('attribue les bons points pour 1 a 4 lignes', () => {
    expect(scoreForLines(1)).toBe(100);
    expect(scoreForLines(2)).toBe(300);
    expect(scoreForLines(3)).toBe(500);
    expect(scoreForLines(4)).toBe(800);
  });

  it('renvoie 0 pour un nombre de lignes hors bareme', () => {
    expect(scoreForLines(0)).toBe(0);
    expect(scoreForLines(5)).toBe(0);
  });

  it('augmente le niveau toutes les 10 lignes', () => {
    expect(levelForLines(0)).toBe(1);
    expect(levelForLines(9)).toBe(1);
    expect(levelForLines(10)).toBe(2);
    expect(levelForLines(25)).toBe(3);
  });

  it('accelere la chute quand le niveau augmente', () => {
    expect(speedForLevel(2)).toBeLessThan(speedForLevel(1));
    expect(speedForLevel(10)).toBeLessThan(speedForLevel(2));
  });

  it('respecte le bareme complet', () => {
    expect(LINE_SCORES).toEqual({ 1: 100, 2: 300, 3: 500, 4: 800 });
  });
});
