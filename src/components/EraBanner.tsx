import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { ERAS } from '../engine/eras';
import type { EraId } from '../engine/types';
import { ShieldAlert } from 'lucide-react';

interface EraBannerProps {
  eraId: EraId;
  alertMessage: string | null;
}

export const EraBanner: React.FC<EraBannerProps> = ({ eraId, alertMessage }) => {
  const { t } = useLanguage();
  const eraInfo = ERAS[eraId];

  return (
    <div className="w-full max-w-xl mx-auto my-2">
      <div className={`bg-gradient-to-r ${eraInfo.bannerBg} border-2 rounded-xl p-3 shadow-2xl relative overflow-hidden text-amber-100`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-wider text-amber-300 font-serif uppercase drop-shadow">
              {t(eraInfo.nameKey)}
            </h2>
            <p className="text-xs text-amber-100/90 font-serif italic mt-0.5">
              {t(eraInfo.descKey)}
            </p>
          </div>
          <span className="bg-amber-900/80 border border-amber-500/50 text-amber-300 text-xs font-bold px-2.5 py-1 rounded-full shadow font-mono">
            Lv. {eraInfo.minLevel}-{eraInfo.maxLevel}
          </span>
        </div>

        {alertMessage && (
          <div className="mt-2 bg-red-950/90 border border-red-500/80 text-red-200 text-xs px-3 py-1.5 rounded-md flex items-center space-x-2 animate-bounce">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            <span className="font-semibold">{alertMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
