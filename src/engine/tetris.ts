import type { TetrominoType, Grid, Piece, Position } from './types';

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export const TETROMINOS: Record<TetrominoType, { shape: number[][]; color: string }> = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: '#00f0f0',
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#0000f0',
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#f0a000',
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: '#f0f000',
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: '#00f000',
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#a000f0',
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: '#f00000',
  },
};

export const COLOR_MAP: Record<string, string> = {
  I: '#00e5ff',
  J: '#29b6f6',
  L: '#ffa726',
  O: '#ffee58',
  S: '#66bb6a',
  T: '#ab47bc',
  Z: '#ef5350',
  debris: '#8d6e63',
  rock: '#78909c',
};

export function createEmptyGrid(): Grid {
  return Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null));
}

export function shuffleBag(): TetrominoType[] {
  const pieces: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
  }
  return pieces;
}

export function createPiece(type: TetrominoType): Piece {
  const template = TETROMINOS[type];
  return {
    type,
    shape: template.shape.map(row => [...row]),
    color: template.color,
    rotation: 0,
    position: {
      x: Math.floor((BOARD_WIDTH - template.shape[0].length) / 2),
      y: type === 'I' ? -1 : 0,
    },
  };
}

export function checkCollision(piece: Piece, grid: Grid, offset: Position = { x: 0, y: 0 }): boolean {
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (piece.shape[r][c] !== 0) {
        const newX = piece.position.x + c + offset.x;
        const newY = piece.position.y + r + offset.y;

        if (newX < 0 || newX >= BOARD_WIDTH) {
          return true;
        }
        if (newY >= BOARD_HEIGHT) {
          return true;
        }
        if (newY >= 0 && grid[newY][newX] !== null) {
          return true;
        }
      }
    }
  }
  return false;
}

export function rotateMatrix(matrix: number[][]): number[][] {
  const N = matrix.length;
  const result = Array.from({ length: N }, () => Array(N).fill(0));
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      result[c][N - 1 - r] = matrix[r][c];
    }
  }
  return result;
}

export function rotatePiece(piece: Piece, grid: Grid): Piece | null {
  const newShape = rotateMatrix(piece.shape);
  const rotatedPiece: Piece = {
    ...piece,
    shape: newShape,
    rotation: (piece.rotation + 1) % 4,
  };

  const kickOffsets = [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
    { x: -2, y: 0 },
    { x: 2, y: 0 },
  ];

  for (const offset of kickOffsets) {
    if (!checkCollision(rotatedPiece, grid, offset)) {
      return {
        ...rotatedPiece,
        position: {
          x: rotatedPiece.position.x + offset.x,
          y: rotatedPiece.position.y + offset.y,
        },
      };
    }
  }
  return null;
}

export function calculateGhostY(piece: Piece, grid: Grid): number {
  let offset = 0;
  while (!checkCollision(piece, grid, { x: 0, y: offset + 1 })) {
    offset++;
  }
  return piece.position.y + offset;
}

export function placePiece(piece: Piece, grid: Grid): Grid {
  const newGrid = grid.map(row => [...row]);
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (piece.shape[r][c] !== 0) {
        const x = piece.position.x + c;
        const y = piece.position.y + r;
        if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
          newGrid[y][x] = piece.type;
        }
      }
    }
  }
  return newGrid;
}

export interface LineClearResult {
  newGrid: Grid;
  linesCleared: number;
}

export function clearLines(grid: Grid): LineClearResult {
  const newGrid: Grid = [];
  let linesCleared = 0;

  for (let r = 0; r < BOARD_HEIGHT; r++) {
    const isFull = grid[r].every(cell => cell !== null);
    if (isFull) {
      linesCleared++;
    } else {
      newGrid.push([...grid[r]]);
    }
  }

  while (newGrid.length < BOARD_HEIGHT) {
    newGrid.unshift(Array(BOARD_WIDTH).fill(null));
  }

  return { newGrid, linesCleared };
}

export function calculateScore(linesCleared: number, level: number): number {
  const baseScores = [0, 100, 300, 500, 800];
  return (baseScores[linesCleared] || 0) * level;
}
