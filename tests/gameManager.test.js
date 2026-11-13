import { describe, it, expect } from 'vitest';
import { GameManager, GameInstance } from '../src/core/game.js';

describe('GameManager', () => {
  it('cree une partie solo', () => {
    const manager = new GameManager({ mode: 'solo', names: ['Solo'] });
    expect(manager.instances.length).toBe(1);
    expect(manager.getWinner()).toBe(null);
  });

  it('cree une partie a quatre', () => {
    const manager = new GameManager({ names: ['P1', 'P2', 'P3', 'P4'] });
    expect(manager.instances.length).toBe(4);
    expect(manager.alive.length).toBe(4);
  });

  it('designe le dernier en vie comme gagnant', () => {
    const manager = new GameManager({ names: ['P1', 'P2', 'P3'] });
    manager.instances[0].state = 'over';
    manager.instances[1].state = 'over';
    expect(manager.getWinner()).toBe(manager.instances[2]);
  });

  it('reinitialise proprement une instance', () => {
    const instance = new GameInstance({ name: 'X' });
    instance.start();
    instance.score = 1500;
    instance.restart();
    expect(instance.score).toBe(0);
    expect(instance.state).toBe('running');
  });
});
