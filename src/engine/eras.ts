import type { EraId, EraInfo, Grid, TetrominoType, Piece } from './types';
import { BOARD_WIDTH, BOARD_HEIGHT, TETROMINOS } from './tetris';

export const ERAS: Record<EraId, EraInfo> = {
  1: {
    id: 1,
    nameKey: 'era1Name',
    descKey: 'era1Desc',
    minLevel: 1,
    maxLevel: 200,
    bannerBg: 'from-amber-900 to-yellow-800 border-amber-600',
  },
  2: {
    id: 2,
    nameKey: 'era2Name',
    descKey: 'era2Desc',
    minLevel: 201,
    maxLevel: 400,
    bannerBg: 'from-stone-800 to-yellow-950 border-stone-600',
  },
  3: {
    id: 3,
    nameKey: 'era3Name',
    descKey: 'era3Desc',
    minLevel: 401,
    maxLevel: 600,
    bannerBg: 'from-slate-800 to-gray-900 border-slate-500',
  },
  4: {
    id: 4,
    nameKey: 'era4Name',
    descKey: 'era4Desc',
    minLevel: 601,
    maxLevel: 800,
    bannerBg: 'from-purple-950 to-indigo-950 border-purple-600',
  },
  5: {
    id: 5,
    nameKey: 'era5Name',
    descKey: 'era5Desc',
    minLevel: 801,
    maxLevel: 1000,
    bannerBg: 'from-red-950 to-slate-950 border-red-600',
  },
};

export function getEraForLevel(level: number): EraId {
  if (level <= 200) return 1;
  if (level <= 400) return 2;
  if (level <= 600) return 3;
  if (level <= 800) return 4;
  return 5;
}

export function getDropSpeed(level: number): number {
  if (level >= 801) {
    return 0;
  }
  const speed = 800 * Math.pow(0.995, level - 1);
  return Math.max(16, Math.floor(speed));
}

export function applyKingsTax(grid: Grid): { newGrid: Grid; taxApplied: boolean } {
  const occupiedRowIndices: number[] = [];
  for (let r = 0; r < BOARD_HEIGHT; r++) {
    if (grid[r].some(cell => cell !== null)) {
      occupiedRowIndices.push(r);
    }
  }

  if (occupiedRowIndices.length === 0) {
    return { newGrid: grid, taxApplied: false };
  }

  const targetIndex = occupiedRowIndices[Math.floor(Math.random() * occupiedRowIndices.length)];
  const newGrid = grid.filter((_, idx) => idx !== targetIndex);
  newGrid.unshift(Array(BOARD_WIDTH).fill(null));

  return { newGrid, taxApplied: true };
}

export function applyWoodenDebris(grid: Grid): Grid {
  const newGrid = grid.map(row => [...row]);
  const bottomRow = BOARD_HEIGHT - 1;

  const emptyCols: number[] = [];
  for (let c = 0; c < BOARD_WIDTH; c++) {
    if (newGrid[bottomRow][c] === null) {
      emptyCols.push(c);
    }
  }

  if (emptyCols.length > 0) {
    const randomCol = emptyCols[Math.floor(Math.random() * emptyCols.length)];
    newGrid[bottomRow][randomCol] = 'debris';
  }

  return newGrid;
}

export function applyCatapultSiege(grid: Grid): { newGrid: Grid; hit: boolean } {
  const newGrid = grid.map(row => [...row]);

  let topOccupiedRow = -1;
  for (let r = 0; r < BOARD_HEIGHT; r++) {
    if (newGrid[r].some(cell => cell !== null)) {
      topOccupiedRow = r;
      break;
    }
  }

  if (topOccupiedRow === -1) {
    return { newGrid: grid, hit: false };
  }

  const targetCol = Math.floor(Math.random() * (BOARD_WIDTH - 1));
  const targetRow = topOccupiedRow;

  for (let dr = 0; dr < 2; dr++) {
    for (let dc = 0; dc < 2; dc++) {
      const r = targetRow + dr;
      const c = targetCol + dc;
      if (r >= 0 && r < BOARD_HEIGHT && c >= 0 && c < BOARD_WIDTH) {
        newGrid[r][c] = null;
      }
    }
  }

  return { newGrid, hit: true };
}

export function applyAlchemyTransmute(piece: Piece): Piece {
  const types: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
  const otherTypes = types.filter(t => t !== piece.type);
  const newType = otherTypes[Math.floor(Math.random() * otherTypes.length)];
  const template = TETROMINOS[newType];

  return {
    ...piece,
    type: newType,
    shape: template.shape.map(r => [...r]),
    color: template.color,
  };
}
