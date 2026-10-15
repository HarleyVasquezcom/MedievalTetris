export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export type CellValue = TetrominoType | 'debris' | 'rock' | null;

export type Grid = CellValue[][];

export interface Position {
  x: number;
  y: number;
}

export interface Piece {
  type: TetrominoType;
  shape: number[][];
  color: string;
  rotation: number;
  position: Position;
}

export type EraId = 1 | 2 | 3 | 4 | 5;

export interface EraInfo {
  id: EraId;
  nameKey: 'era1Name' | 'era2Name' | 'era3Name' | 'era4Name' | 'era5Name';
  descKey: 'era1Desc' | 'era2Desc' | 'era3Desc' | 'era4Desc' | 'era5Desc';
  minLevel: number;
  maxLevel: number;
  bannerBg: string;
}

export interface GameState {
  grid: Grid;
  currentPiece: Piece | null;
  nextQueue: TetrominoType[];
  heldPiece: TetrominoType | null;
  canHold: boolean;
  score: number;
  gold: number;
  lines: number;
  level: number;
  era: EraId;
  isGameOver: boolean;
  isPaused: boolean;
  ghostY: number;
  alertMessage: string | null;
  isInvisible: boolean;
}
