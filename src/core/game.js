import { createGrid, isValidPosition, lockPiece, clearLines, isGameOver, COLS } from './grid.js';
import { PIECES, PIECE_NAMES, rotate } from './piece.js';
import { scoreForLines, levelForLines } from './scoring.js';

// Générateur aléatoire déterministe injectable (mulberry32) pour des parties reproductibles.
export function createRng(seed) {
  let state = seed >>> 0;
  return function rng() {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SPAWN_ROW = 0;

function spawnColumn(matrix) {
  return Math.floor((COLS - matrix[0].length) / 2);
}

// Une partie : grille, pièce courante, score, état.
export class GameInstance {
  constructor({ name = 'Solo', seed = 12345 } = {}) {
    this.name = name;
    this.seed = seed;
    this.rng = createRng(seed);
    this.reset();
  }

  reset() {
    this.grid = createGrid();
    this.score = 0;
    this.lines = 0;
    this.level = 1;
    this.state = 'idle'; // États possibles : attente | en cours | pause | terminée.
    this.current = null; // Position de la pièce courante : { matrix, row, col }.
    this.next = null; // Matrice de la pièce suivante.
    this.bag = [];
  }

  _nextFromBag() {
    if (this.bag.length === 0) {
      this.bag = [...PIECE_NAMES];
      for (let i = this.bag.length - 1; i > 0; i--) {
        const j = Math.floor(this.rng() * (i + 1));
        [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
      }
    }

    return PIECES[this.bag.pop()].map((row) => row.slice());
  }

  spawn() {
    const matrix = this.next ?? this._nextFromBag();
    this.next = this._nextFromBag();
    this.current = { matrix, row: SPAWN_ROW, col: spawnColumn(matrix) };

    if (!isValidPosition(this.grid, matrix, this.current.row, this.current.col)) {
      this.state = 'over';
    }
  }

  start() {
    if (this.state === 'over') return;
    this.state = 'running';
    if (!this.current) this.spawn();
  }

  pause() {
    if (this.state === 'running') this.state = 'paused';
  }

  resume() {
    if (this.state === 'paused') this.state = 'running';
  }

  restart() {
    this.reset();
    this.start();
  }

  move(dx) {
    if (this.state !== 'running' || !this.current) return false;

    if (isValidPosition(this.grid, this.current.matrix, this.current.row, this.current.col + dx)) {
      this.current.col += dx;
      return true;
    }

    return false;
  }

  rotatePiece() {
    if (this.state !== 'running' || !this.current) return false;
    const rotated = rotate(this.current.matrix);

    if (isValidPosition(this.grid, rotated, this.current.row, this.current.col)) {
      this.current.matrix = rotated;
      return true;
    }

    return false;
  }

  getGhostRow() {
    if (!this.current) return SPAWN_ROW;
    let row = this.current.row;
    while (isValidPosition(this.grid, this.current.matrix, row + 1, this.current.col)) {
      row++;
    }
    return row;
  }

  softDrop() {
    if (this.state !== 'running' || !this.current) return false;

    if (isValidPosition(this.grid, this.current.matrix, this.current.row + 1, this.current.col)) {
      this.current.row += 1;
      return true;
    }

    this._lock();
    return false;
  }

  hardDrop() {
    if (this.state !== 'running' || !this.current) return;
    this.current.row = this.getGhostRow();
    this._lock();
  }

  tick() {
    if (this.state === 'running') this.softDrop();
  }

  // Joue un coup IA avec les fonctions publiques (comme un joueur).
  playAiMove({ rotation, column }) {
    if (this.state !== 'running' || !this.current) return;

    for (let i = 0; i < rotation; i++) this.rotatePiece();

    const dx = column - this.current.col;
    const step = dx < 0 ? -1 : 1;
    for (let i = 0; i < Math.abs(dx); i++) this.move(step);

    this.hardDrop();
  }

  _lock() {
    this.grid = lockPiece(this.grid, this.current.matrix, this.current.row, this.current.col);
    const { grid, cleared } = clearLines(this.grid);
    this.grid = grid;

    if (cleared > 0) {
      this.score += scoreForLines(cleared);
      this.lines += cleared;
      this.level = levelForLines(this.lines);
    }

    if (isGameOver(this.grid)) {
      this.state = 'over';
      this.current = null;
    } else {
      this.spawn();
    }
  }
}

// Plusieurs instances: tour de jeu, fin de partie, gagnant (dernier en vie).
export class GameManager {
  constructor({ mode = 'solo', names = ['Joueur 1'] } = {}) {
    this.mode = mode;
    this.instances = names.map((name, index) => new GameInstance({ name, seed: 1000 + index }));
    this.activeIndex = 0;
    this.winner = null;
  }

  get active() {
    return this.instances[this.activeIndex];
  }

  get alive() {
    return this.instances.filter((instance) => instance.state !== 'over');
  }

  get podium() {
    return [...this.instances].sort((a, b) => b.score - a.score);
  }

  start() {
    this.instances.forEach((instance) => instance.start());
  }

  getWinner() {
    if (this.instances.length <= 1) return null;
    const alive = this.alive;
    return alive.length === 1 ? alive[0] : null;
  }

  tick() {
    if (this.winner) return;
    if (this.active.state === 'over') {
      this._nextAlive();
      return;
    }

    this.active.tick();

    if (this.active.state === 'over') {
      const alive = this.alive;
      if (alive.length <= 1) this.winner = alive[0] ?? null;
      else this._nextAlive();
    }
  }

  _nextAlive() {
    const total = this.instances.length;

    for (let k = 1; k <= total; k++) {
      const idx = (this.activeIndex + k) % total;
      if (this.instances[idx].state !== 'over') {
        this.activeIndex = idx;
        return;
      }
    }
  }
}
