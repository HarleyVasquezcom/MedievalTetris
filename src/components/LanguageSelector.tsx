import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import type { Language } from '../i18n/LanguageContext';
import { Globe } from 'lucide-react';

const languages: { code: Language; flag: string; name: string }[] = [
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'es', flag: '🇪🇸', name: 'Español' },
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
  { code: 'pt', flag: '🇵🇹', name: 'Português' },
  { code: 'it', flag: '🇮🇹', name: 'Italiano' },
];

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center space-x-2 bg-amber-950/80 border border-amber-700/60 rounded-lg px-3 py-1.5 shadow-md">
      <Globe className="w-4 h-4 text-amber-400" />
      <span className="text-xs text-amber-200/80 font-medium hidden sm:inline">{t('language')}:</span>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="bg-stone-900 border border-amber-800 text-amber-100 text-xs rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer font-serif"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-stone-900 text-amber-100">
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};
