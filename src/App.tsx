import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from './i18n/LanguageContext';
import {
  createEmptyGrid,
  createPiece,
  shuffleBag,
  checkCollision,
  rotatePiece,
  calculateGhostY,
  placePiece,
  clearLines,
  calculateScore,
} from './engine/tetris';
import {
  getEraForLevel,
  getDropSpeed,
  applyKingsTax,
  applyWoodenDebris,
  applyCatapultSiege,
  applyAlchemyTransmute,
} from './engine/eras';
import type { GameState, TetrominoType } from './engine/types';
import { soundEngine } from './audio/soundEngine';

import { Header } from './components/Header';
import { EraBanner } from './components/EraBanner';
import { Board } from './components/Board';
import { PreviewBox } from './components/HoldNext';
import { Controls } from './components/Controls';
import { Shield, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const { t } = useLanguage();

  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('medieval_tetris_highscore') || '0', 10);
  });

  const [gameState, setGameState] = useState<GameState>(() => {
    const initialBag = shuffleBag();
    const firstPieceType = initialBag[0];
    const nextQueue = initialBag.slice(1);

    return {
      grid: createEmptyGrid(),
      currentPiece: createPiece(firstPieceType),
      nextQueue,
      heldPiece: null,
      canHold: true,
      score: 0,
      gold: 0,
      lines: 0,
      level: 1,
      era: 1,
      isGameOver: false,
      isPaused: false,
      ghostY: 0,
      alertMessage: null,
      isInvisible: false,
    };
  });

  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);

  const drawNextPiece = useCallback((currentQueue: TetrominoType[]) => {
    let queue = [...currentQueue];
    if (queue.length < 5) {
      queue = [...queue, ...shuffleBag()];
    }
    const nextType = queue[0];
    const remainingQueue = queue.slice(1);
    return {
      nextPiece: createPiece(nextType),
      remainingQueue,
    };
  }, []);

  useEffect(() => {
    if (gameState.currentPiece) {
      const gy = calculateGhostY(gameState.currentPiece, gameState.grid);
      setGameState(prev => ({ ...prev, ghostY: gy }));
    }
  }, [gameState.currentPiece, gameState.grid]);

  const lockPiece = useCallback(() => {
    if (!gameState.currentPiece) return;

    soundEngine.playDrop();

    let newGrid = placePiece(gameState.currentPiece, gameState.grid);
    const { newGrid: clearedGrid, linesCleared } = clearLines(newGrid);

    if (linesCleared > 0) {
      soundEngine.playClearLine();
    }

    const addedScore = calculateScore(linesCleared, gameState.level);
    const addedGold = linesCleared * 10;
    const newLines = gameState.lines + linesCleared;
    const newLevel = Math.min(1000, Math.floor(newLines / 10) + 1);
    const newEra = getEraForLevel(newLevel);

    let alertMsg: string | null = null;
    let finalGrid = clearedGrid;

    if (newEra === 1 && Math.random() < 0.08) {
      const taxResult = applyKingsTax(finalGrid);
      if (taxResult.taxApplied) {
        finalGrid = taxResult.newGrid;
        alertMsg = t('taxAlert');
        soundEngine.playSpecialEvent();
      }
    } else if (newEra === 2 && Math.random() < 0.12) {
      finalGrid = applyWoodenDebris(finalGrid);
      alertMsg = t('debrisAlert');
      soundEngine.playSpecialEvent();
    } else if (newEra === 3 && Math.random() < 0.1) {
      const siegeResult = applyCatapultSiege(finalGrid);
      if (siegeResult.hit) {
        finalGrid = siegeResult.newGrid;
        alertMsg = t('siegeAlert');
        soundEngine.playSpecialEvent();
      }
    }

    const { nextPiece, remainingQueue } = drawNextPiece(gameState.nextQueue);
    const isInvis = newEra === 5;
    const isGameOver = checkCollision(nextPiece, finalGrid);
    const updatedScore = gameState.score + addedScore;

    if (updatedScore > highScore) {
      setHighScore(updatedScore);
      localStorage.setItem('medieval_tetris_highscore', updatedScore.toString());
    }

    setGameState(prev => ({
      ...prev,
      grid: finalGrid,
      currentPiece: isGameOver ? null : nextPiece,
      nextQueue: remainingQueue,
      canHold: true,
      score: updatedScore,
      gold: prev.gold + addedGold,
      lines: newLines,
      level: newLevel,
      era: newEra,
      isGameOver,
      alertMessage: alertMsg,
      isInvisible: isInvis,
    }));
  }, [gameState, drawNextPiece, highScore, t]);

  const moveDown = useCallback(() => {
    if (gameState.isGameOver || gameState.isPaused || !gameState.currentPiece) return;

    if (!checkCollision(gameState.currentPiece, gameState.grid, { x: 0, y: 1 })) {
      setGameState(prev => ({
        ...prev,
        currentPiece: prev.currentPiece
          ? {
              ...prev.currentPiece,
              position: { ...prev.currentPiece.position, y: prev.currentPiece.position.y + 1 },
            }
          : null,
      }));

      if (gameState.era === 4 && Math.random() < 0.05 && gameState.currentPiece) {
        const transmuted = applyAlchemyTransmute(gameState.currentPiece);
        if (!checkCollision(transmuted, gameState.grid)) {
          setGameState(prev => ({
            ...prev,
            currentPiece: transmuted,
            alertMessage: t('alchemyAlert'),
          }));
          soundEngine.playSpecialEvent();
        }
      }
    } else {
      lockPiece();
    }
  }, [gameState, lockPiece, t]);

  useEffect(() => {
    if (gameState.isGameOver || gameState.isPaused) return;

    const speed = getDropSpeed(gameState.level);
    if (speed === 0) {
      lockPiece();
      return;
    }

    const timer = setInterval(() => {
      moveDown();
    }, speed);

    return () => clearInterval(timer);
  }, [gameState.level, gameState.isGameOver, gameState.isPaused, moveDown, lockPiece]);

  const moveLeft = () => {
    if (gameState.isGameOver || gameState.isPaused || !gameState.currentPiece) return;
    if (!checkCollision(gameState.currentPiece, gameState.grid, { x: -1, y: 0 })) {
      soundEngine.playMove();
      setGameState(prev => ({
        ...prev,
        currentPiece: prev.currentPiece
          ? {
              ...prev.currentPiece,
              position: { ...prev.currentPiece.position, x: prev.currentPiece.position.x - 1 },
            }
          : null,
      }));
    }
  };

  const moveRight = () => {
    if (gameState.isGameOver || gameState.isPaused || !gameState.currentPiece) return;
    if (!checkCollision(gameState.currentPiece, gameState.grid, { x: 1, y: 0 })) {
      soundEngine.playMove();
      setGameState(prev => ({
        ...prev,
        currentPiece: prev.currentPiece
          ? {
              ...prev.currentPiece,
              position: { ...prev.currentPiece.position, x: prev.currentPiece.position.x + 1 },
            }
          : null,
      }));
    }
  };

  const rotate = () => {
    if (gameState.isGameOver || gameState.isPaused || !gameState.currentPiece) return;
    const rotated = rotatePiece(gameState.currentPiece, gameState.grid);
    if (rotated) {
      soundEngine.playRotate();
      setGameState(prev => ({ ...prev, currentPiece: rotated }));
    }
  };

  const softDrop = () => {
    if (gameState.isGameOver || gameState.isPaused || !gameState.currentPiece) return;
    if (!checkCollision(gameState.currentPiece, gameState.grid, { x: 0, y: 1 })) {
      setGameState(prev => ({
        ...prev,
        gold: prev.gold + 1,
        currentPiece: prev.currentPiece
          ? {
              ...prev.currentPiece,
              position: { ...prev.currentPiece.position, y: prev.currentPiece.position.y + 1 },
            }
          : null,
      }));
    }
  };

  const hardDrop = () => {
    if (gameState.isGameOver || gameState.isPaused || !gameState.currentPiece) return;

    let dropDistance = 0;
    while (!checkCollision(gameState.currentPiece, gameState.grid, { x: 0, y: dropDistance + 1 })) {
      dropDistance++;
    }

    setGameState(prev => ({
      ...prev,
      gold: prev.gold + dropDistance * 2,
      currentPiece: prev.currentPiece
        ? {
            ...prev.currentPiece,
            position: { ...prev.currentPiece.position, y: prev.currentPiece.position.y + dropDistance },
          }
        : null,
    }));

    setTimeout(() => {
      lockPiece();
    }, 10);
  };

  const holdPiece = () => {
    if (gameState.isGameOver || gameState.isPaused || !gameState.currentPiece || !gameState.canHold) return;

    soundEngine.playRotate();
    const currentType = gameState.currentPiece.type;

    if (gameState.heldPiece === null) {
      const { nextPiece, remainingQueue } = drawNextPiece(gameState.nextQueue);
      setGameState(prev => ({
        ...prev,
        heldPiece: currentType,
        currentPiece: nextPiece,
        nextQueue: remainingQueue,
        canHold: false,
      }));
    } else {
      const swappedPiece = createPiece(gameState.heldPiece);
      setGameState(prev => ({
        ...prev,
        heldPiece: currentType,
        currentPiece: swappedPiece,
        canHold: false,
      }));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === 'ArrowLeft') moveLeft();
      if (e.key === 'ArrowRight') moveRight();
      if (e.key === 'ArrowUp') rotate();
      if (e.key === 'ArrowDown') softDrop();
      if (e.key === ' ') hardDrop();
      if (e.key === 'c' || e.key === 'C' || e.key === 'Shift') holdPiece();
      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveLeft, moveRight, rotate, softDrop, hardDrop, holdPiece]);

  const restartGame = () => {
    const newBag = shuffleBag();
    const firstType = newBag[0];
    const remainingQueue = newBag.slice(1);

    setGameState({
      grid: createEmptyGrid(),
      currentPiece: createPiece(firstType),
      nextQueue: remainingQueue,
      heldPiece: null,
      canHold: true,
      score: 0,
      gold: 0,
      lines: 0,
      level: 1,
      era: 1,
      isGameOver: false,
      isPaused: false,
      ghostY: 0,
      alertMessage: null,
      isInvisible: false,
    });
  };

  const setStartLevel = (lvl: number) => {
    const validLevel = Math.min(1000, Math.max(1, lvl));
    const era = getEraForLevel(validLevel);
    setGameState(prev => ({
      ...prev,
      level: validLevel,
      era,
    }));
  };

  return (
    <div className="min-h-screen bg-stone-950 text-amber-100 p-2 sm:p-4 flex flex-col items-center justify-center font-sans select-none">
      <Header
        score={gameState.score}
        level={gameState.level}
        lines={gameState.lines}
        gold={gameState.gold}
        highScore={highScore}
        isPaused={gameState.isPaused}
        isGameOver={gameState.isGameOver}
        audioEnabled={audioEnabled}
        onToggleAudio={() => {
          const enabled = soundEngine.toggleAudio();
          setAudioEnabled(enabled);
        }}
        onTogglePause={() => setGameState(p => ({ ...p, isPaused: !p.isPaused }))}
        onRestart={restartGame}
        onLevelChange={setStartLevel}
      />

      <EraBanner eraId={gameState.era} alertMessage={gameState.alertMessage} />

      <main className="flex flex-col sm:flex-row items-center justify-center gap-4 my-2">
        <div className="hidden sm:flex flex-col gap-2">
          <PreviewBox title={t('hold')} pieceType={gameState.heldPiece} />
        </div>

        <div className="relative">
          <Board
            grid={gameState.grid}
            currentPiece={gameState.currentPiece}
            ghostY={gameState.ghostY}
            isInvisible={gameState.isInvisible}
          />

          {gameState.isGameOver && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center p-4 border-2 border-red-700 animate-fade-in text-center">
              <Shield className="w-12 h-12 text-red-500 mb-2 animate-bounce" />
              <h2 className="text-xl font-bold font-serif text-red-400 uppercase tracking-widest">
                {t('gameOver')}
              </h2>
              <p className="text-xs text-amber-200 font-serif my-2">
                {t('score')}: <span className="font-mono font-bold text-amber-400">{gameState.score}</span>
              </p>
              <button
                onClick={restartGame}
                className="mt-3 bg-red-900 hover:bg-red-800 border border-red-500 text-amber-100 font-serif text-xs font-bold px-4 py-2 rounded-lg shadow-lg cursor-pointer transition active:scale-95"
              >
                {t('restart')}
              </button>
            </div>
          )}

          {gameState.isPaused && !gameState.isGameOver && (
            <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-xs rounded-xl flex flex-col items-center justify-center p-4 border-2 border-amber-600 text-center">
              <Sparkles className="w-10 h-10 text-amber-400 mb-2" />
              <h2 className="text-lg font-bold font-serif text-amber-300 uppercase tracking-wider">
                {t('pause')}
              </h2>
              <button
                onClick={() => setGameState(p => ({ ...p, isPaused: false }))}
                className="mt-3 bg-amber-900 hover:bg-amber-800 border border-amber-500 text-amber-100 font-serif text-xs font-bold px-4 py-2 rounded-lg shadow-lg cursor-pointer transition active:scale-95"
              >
                {t('resume')}
              </button>
            </div>
          )}
        </div>

        <div className="flex sm:flex-col gap-2">
          <div className="sm:hidden">
            <PreviewBox title={t('hold')} pieceType={gameState.heldPiece} />
          </div>
          <PreviewBox title={t('next')} pieceType={gameState.nextQueue[0] || null} />
        </div>
      </main>

      <Controls
        onMoveLeft={moveLeft}
        onMoveRight={moveRight}
        onRotate={rotate}
        onSoftDrop={softDrop}
        onHardDrop={hardDrop}
        onHold={holdPiece}
      />
    </div>
  );
};
