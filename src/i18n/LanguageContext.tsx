import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from './locales/en';
import { es } from './locales/es';
import { fr } from './locales/fr';
import { de } from './locales/de';
import { pt } from './locales/pt';
import { it } from './locales/it';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'it';

const translations = { en, es, fr, de, pt, it };

type TranslationKeys = keyof typeof en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKeys) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('medieval_tetris_lang');
    if (saved && saved in translations) {
      return saved as Language;
    }
    const navLang = navigator.language.slice(0, 2).toLowerCase();
    if (navLang in translations) {
      return navLang as Language;
    }
    return 'es'; // default Spanish as per repo original context
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('medieval_tetris_lang', lang);
  };

  const t = (key: TranslationKeys): string => {
    const dict = translations[language] || translations.en;
    return dict[key] || translations.en[key] || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
