import { describe, it, expect } from 'vitest';
import {
  getEraForLevel,
  getDropSpeed,
  applyKingsTax,
  applyWoodenDebris,
  applyCatapultSiege,
  applyAlchemyTransmute
} from '../eras';
import { createEmptyGrid, createPiece, BOARD_HEIGHT, BOARD_WIDTH } from '../tetris';

describe('Medieval Era Mechanics & 1000 Level Progression', () => {
  it('maps 1,000 levels to correct Eras', () => {
    expect(getEraForLevel(1)).toBe(1);
    expect(getEraForLevel(200)).toBe(1);
    expect(getEraForLevel(201)).toBe(2);
    expect(getEraForLevel(400)).toBe(2);
    expect(getEraForLevel(401)).toBe(3);
    expect(getEraForLevel(600)).toBe(3);
    expect(getEraForLevel(601)).toBe(4);
    expect(getEraForLevel(800)).toBe(4);
    expect(getEraForLevel(801)).toBe(5);
    expect(getEraForLevel(1000)).toBe(5);
  });

  it('calculates logarithmic drop speed curve', () => {
    expect(getDropSpeed(1)).toBe(800);
    expect(getDropSpeed(100)).toBeLessThan(800);
    expect(getDropSpeed(500)).toBeLessThan( getDropSpeed(100) );
    expect(getDropSpeed(801)).toBe(0); // 20G instant drop speed
  });

  it('applies Era I King Tax confiscation', () => {
    const grid = createEmptyGrid();
    grid[BOARD_HEIGHT - 1][0] = 'I'; // Put block on bottom row

    const { newGrid, taxApplied } = applyKingsTax(grid);
    expect(taxApplied).toBe(true);
    expect(newGrid[BOARD_HEIGHT - 1][0]).toBeNull();
  });

  it('applies Era II Wooden Debris at base', () => {
    const grid = createEmptyGrid();
    const newGrid = applyWoodenDebris(grid);
    const bottomHasDebris = newGrid[BOARD_HEIGHT - 1].some(cell => cell === 'debris');
    expect(bottomHasDebris).toBe(true);
  });

  it('applies Era III Catapult Siege strike', () => {
    const grid = createEmptyGrid();
    // Fill row 10 entirely so target area will be hit regardless of random column
    for (let c = 0; c < BOARD_WIDTH; c++) {
      grid[10][c] = 'T';
    }
    const { newGrid, hit } = applyCatapultSiege(grid);
    expect(hit).toBe(true);
    // At least 2 cells in row 10 should be destroyed/cleared to null
    const nullsInRow10 = newGrid[10].filter(cell => cell === null).length;
    expect(nullsInRow10).toBeGreaterThanOrEqual(2);
  });

  it('applies Era IV Alchemy Transmutation', () => {
    const piece = createPiece('I');
    const mutated = applyAlchemyTransmute(piece);
    expect(mutated.type).not.toBe('I');
  });
});
