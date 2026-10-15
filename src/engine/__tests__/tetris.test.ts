import { describe, it, expect } from 'vitest';
import {
  createEmptyGrid,
  createPiece,
  checkCollision,
  rotatePiece,
  calculateGhostY,
  clearLines,
  calculateScore,
  BOARD_WIDTH,
  BOARD_HEIGHT
} from '../tetris';

describe('Tetris Core Engine', () => {
  it('creates empty grid with 10 columns and 20 rows', () => {
    const grid = createEmptyGrid();
    expect(grid.length).toBe(BOARD_HEIGHT);
    expect(grid[0].length).toBe(BOARD_WIDTH);
    expect(grid.every(row => row.every(cell => cell === null))).toBe(true);
  });

  it('creates piece correctly', () => {
    const piece = createPiece('T');
    expect(piece.type).toBe('T');
    expect(piece.rotation).toBe(0);
    expect(piece.position.x).toBe(3);
  });

  it('detects boundary collisions', () => {
    const grid = createEmptyGrid();
    const piece = createPiece('I');

    piece.position.x = -2;
    expect(checkCollision(piece, grid)).toBe(true);

    piece.position.x = BOARD_WIDTH;
    expect(checkCollision(piece, grid)).toBe(true);

    piece.position.x = 3;
    piece.position.y = BOARD_HEIGHT - 1;
    expect(checkCollision(piece, grid)).toBe(true);
  });

  it('rotates piece with wall kicks', () => {
    const grid = createEmptyGrid();
    const piece = createPiece('T');
    const rotated = rotatePiece(piece, grid);
    expect(rotated).not.toBeNull();
    expect(rotated?.rotation).toBe(1);
  });

  it('calculates ghost Y position accurately', () => {
    const grid = createEmptyGrid();
    const piece = createPiece('O');
    piece.position = { x: 4, y: 0 };
    const ghostY = calculateGhostY(piece, grid);
    expect(ghostY).toBe(BOARD_HEIGHT - 2);
  });

  it('places piece on grid and clears full lines', () => {
    let grid = createEmptyGrid();
    for (let c = 0; c < BOARD_WIDTH; c++) {
      grid[BOARD_HEIGHT - 1][c] = 'I';
    }

    const { newGrid, linesCleared } = clearLines(grid);
    expect(linesCleared).toBe(1);
    expect(newGrid[BOARD_HEIGHT - 1].every(cell => cell === null)).toBe(true);
  });

  it('calculates scores based on level and lines', () => {
    expect(calculateScore(1, 1)).toBe(100);
    expect(calculateScore(4, 5)).toBe(4000);
  });
});
