import React from 'react';
import type { Grid, Piece } from '../engine/types';
import { COLOR_MAP, BOARD_WIDTH, BOARD_HEIGHT } from '../engine/tetris';

interface BoardProps {
  grid: Grid;
  currentPiece: Piece | null;
  ghostY: number;
  isInvisible: boolean;
}

export const Board: React.FC<BoardProps> = ({ grid, currentPiece, ghostY, isInvisible }) => {
  const displayGrid = grid.map(row => [...row]);

  return (
    <div className="relative p-3 bg-stone-900 border-4 border-amber-800 rounded-xl shadow-2xl ring-4 ring-amber-950">
      <div className="absolute -top-2 -left-2 w-4 h-4 bg-amber-700 border border-amber-500 rounded-xs"></div>
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-amber-700 border border-amber-500 rounded-xs"></div>
      <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-amber-700 border border-amber-500 rounded-xs"></div>
      <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-amber-700 border border-amber-500 rounded-xs"></div>

      <div
        className="grid gap-[1px] bg-stone-950 p-1 rounded border border-amber-900/60"
        style={{
          gridTemplateColumns: `repeat(${BOARD_WIDTH}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${BOARD_HEIGHT}, minmax(0, 1fr))`,
          width: 'min(75vw, 300px)',
          height: 'min(150vw, 600px)',
        }}
      >
        {displayGrid.map((row, r) =>
          row.map((cell, c) => {
            let isCurrentPiece = false;
            let isGhost = false;
            let pieceType = cell;

            if (currentPiece) {
              const pr = r - currentPiece.position.y;
              const pc = c - currentPiece.position.x;
              if (
                pr >= 0 &&
                pr < currentPiece.shape.length &&
                pc >= 0 &&
                pc < currentPiece.shape[pr].length &&
                currentPiece.shape[pr][pc] !== 0
              ) {
                if (!isInvisible) {
                  isCurrentPiece = true;
                  pieceType = currentPiece.type;
                }
              }

              const gr = r - ghostY;
              if (
                !isCurrentPiece &&
                gr >= 0 &&
                gr < currentPiece.shape.length &&
                pc >= 0 &&
                pc < currentPiece.shape[gr].length &&
                currentPiece.shape[gr][pc] !== 0
              ) {
                isGhost = true;
                pieceType = currentPiece.type;
              }
            }

            const bgColor = pieceType ? COLOR_MAP[pieceType] || '#a1a1aa' : '#1c1917';

            return (
              <div
                key={`${r}-${c}`}
                className="w-full h-full rounded-xs transition-colors duration-75 relative"
                style={{
                  backgroundColor: isGhost ? 'transparent' : bgColor,
                  border: isGhost
                    ? `1px dashed ${COLOR_MAP[pieceType || 'I']}`
                    : pieceType
                    ? '1px solid rgba(255,255,255,0.3)'
                    : '1px solid rgba(255,255,255,0.03)',
                  boxShadow: pieceType && !isGhost ? 'inset 0 0 4px rgba(255,255,255,0.5)' : 'none',
                }}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
