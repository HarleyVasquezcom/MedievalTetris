import React from 'react';
import type { TetrominoType } from '../engine/types';
import { TETROMINOS, COLOR_MAP } from '../engine/tetris';

interface PreviewBoxProps {
  title: string;
  pieceType: TetrominoType | null;
}

export const PreviewBox: React.FC<PreviewBoxProps> = ({ title, pieceType }) => {
  const shape = pieceType ? TETROMINOS[pieceType].shape : [];

  return (
    <div className="bg-stone-900/90 border-2 border-amber-800/80 rounded-lg p-2 flex flex-col items-center justify-center min-w-[80px] min-h-[90px] shadow-lg">
      <span className="text-[10px] uppercase font-serif font-bold text-amber-400 tracking-wider mb-1">
        {title}
      </span>
      <div className="w-12 h-12 flex items-center justify-center">
        {pieceType && shape.length > 0 ? (
          <div
            className="grid gap-0.5"
            style={{
              gridTemplateColumns: `repeat(${shape[0].length}, minmax(0, 1fr))`,
            }}
          >
            {shape.map((row, r) =>
              row.map((cell, c) => (
                <div
                  key={`${r}-${c}`}
                  className="w-2.5 h-2.5 rounded-xs"
                  style={{
                    backgroundColor: cell ? COLOR_MAP[pieceType] : 'transparent',
                    boxShadow: cell ? 'inset 0 0 2px rgba(255,255,255,0.6)' : 'none',
                  }}
                />
              ))
            )}
          </div>
        ) : (
          <span className="text-xs text-amber-700/60 font-serif italic">-</span>
        )}
      </div>
    </div>
  );
};
