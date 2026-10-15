import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { Crown, Volume2, VolumeX, Play, Pause, RotateCcw } from 'lucide-react';

interface HeaderProps {
  score: number;
  level: number;
  lines: number;
  gold: number;
  highScore: number;
  isPaused: boolean;
  isGameOver: boolean;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  onTogglePause: () => void;
  onRestart: () => void;
  onLevelChange: (lvl: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  score,
  level,
  lines,
  gold,
  highScore,
  isPaused,
  audioEnabled,
  onToggleAudio,
  onTogglePause,
  onRestart,
  onLevelChange,
}) => {
  const { t } = useLanguage();

  return (
    <header className="w-full max-w-2xl mx-auto p-3 bg-stone-900/95 border-2 border-amber-800/90 rounded-2xl shadow-2xl mb-2 text-amber-100">
      <div className="flex items-center justify-between border-b border-amber-800/60 pb-2 mb-2">
        <div className="flex items-center space-x-2">
          <Crown className="w-6 h-6 text-amber-400 drop-shadow" />
          <div>
            <h1 className="text-base sm:text-xl font-bold font-serif tracking-wide text-amber-300 drop-shadow">
              {t('gameTitle')}
            </h1>
            <p className="text-[10px] text-amber-200/70 hidden sm:block italic font-serif">
              {t('subtitle')}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleAudio}
            className="p-1.5 bg-amber-950 hover:bg-amber-900 border border-amber-700/80 rounded-lg text-amber-300 transition cursor-pointer"
            title={audioEnabled ? t('soundOn') : t('soundOff')}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={onTogglePause}
            className="p-1.5 bg-amber-950 hover:bg-amber-900 border border-amber-700/80 rounded-lg text-amber-300 transition cursor-pointer"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>

          <button
            onClick={onRestart}
            className="p-1.5 bg-red-950 hover:bg-red-900 border border-red-700/80 rounded-lg text-red-300 transition cursor-pointer"
            title={t('restart')}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <LanguageSelector />
        </div>
      </div>

      <div className="grid grid-cols-5 gap-1 text-center bg-stone-950/80 p-2 rounded-xl border border-amber-900/50">
        <div>
          <span className="text-[10px] uppercase font-serif text-amber-400/80 block">{t('score')}</span>
          <span className="text-xs sm:text-sm font-bold font-mono text-amber-200">{score}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-serif text-amber-400/80 block">{t('level')}</span>
          <input
            type="number"
            min={1}
            max={1000}
            value={level}
            onChange={(e) => onLevelChange(Math.min(1000, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-12 bg-stone-900 text-center font-bold font-mono text-xs text-amber-300 rounded border border-amber-700 focus:outline-none"
          />
        </div>
        <div>
          <span className="text-[10px] uppercase font-serif text-amber-400/80 block">{t('lines')}</span>
          <span className="text-xs sm:text-sm font-bold font-mono text-amber-200">{lines}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-serif text-amber-400/80 block">{t('gold')}</span>
          <span className="text-xs sm:text-sm font-bold font-mono text-yellow-400">🪙 {gold}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-serif text-amber-400/80 block">{t('highScore')}</span>
          <span className="text-xs sm:text-sm font-bold font-mono text-amber-300">{highScore}</span>
        </div>
      </div>
    </header>
  );
};
