import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Shield, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Space, RefreshCw } from 'lucide-react';

interface ControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onRotate: () => void;
  onSoftDrop: () => void;
  onHardDrop: () => void;
  onHold: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  onMoveLeft,
  onMoveRight,
  onRotate,
  onSoftDrop,
  onHardDrop,
  onHold,
}) => {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-sm mx-auto mt-3 bg-stone-900/80 border border-amber-800/80 rounded-xl p-3 shadow-xl">
      <div className="flex items-center space-x-1.5 mb-2 text-amber-400">
        <Shield className="w-4 h-4" />
        <h3 className="text-xs font-serif font-bold uppercase tracking-wider">{t('controlsTitle')}</h3>
      </div>

      {/* On-Screen Touch / Button Controls */}
      <div className="grid grid-cols-3 gap-1.5 text-amber-100">
        <button
          onClick={onRotate}
          className="col-start-2 bg-amber-900/80 hover:bg-amber-800 border border-amber-600 rounded py-2 flex items-center justify-center active:scale-95 transition cursor-pointer"
        >
          <ArrowUp className="w-5 h-5 text-amber-300" />
        </button>

        <button
          onClick={onMoveLeft}
          className="col-start-1 bg-amber-900/80 hover:bg-amber-800 border border-amber-600 rounded py-2 flex items-center justify-center active:scale-95 transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-amber-300" />
        </button>

        <button
          onClick={onSoftDrop}
          className="col-start-2 bg-amber-900/80 hover:bg-amber-800 border border-amber-600 rounded py-2 flex items-center justify-center active:scale-95 transition cursor-pointer"
        >
          <ArrowDown className="w-5 h-5 text-amber-300" />
        </button>

        <button
          onClick={onMoveRight}
          className="col-start-3 bg-amber-900/80 hover:bg-amber-800 border border-amber-600 rounded py-2 flex items-center justify-center active:scale-95 transition cursor-pointer"
        >
          <ArrowRight className="w-5 h-5 text-amber-300" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2">
        <button
          onClick={onHardDrop}
          className="bg-red-900/80 hover:bg-red-800 border border-red-600 text-amber-200 text-xs font-bold py-2 rounded flex items-center justify-center space-x-1 active:scale-95 transition cursor-pointer font-serif"
        >
          <Space className="w-4 h-4" />
          <span>TREBUCHET</span>
        </button>

        <button
          onClick={onHold}
          className="bg-amber-950 hover:bg-amber-900 border border-amber-700 text-amber-300 text-xs font-bold py-2 rounded flex items-center justify-center space-x-1 active:scale-95 transition cursor-pointer font-serif"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{t('hold')}</span>
        </button>
      </div>
    </div>
  );
};
