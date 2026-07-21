'use client';

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import ka from '@/lib/i18n/ka';
import en from '@/lib/i18n/en';
import type { Dictionary } from '@/lib/i18n/ka';

export type Locale = 'ka' | 'en';

const dictionaries: Record<Locale, Dictionary> = { ka, en };
const STORAGE_KEY = 'partz_locale';

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (path: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function resolve(dict: Dictionary, path: string): string {
  const parts = path.split('.');
  let value: unknown = dict;
  for (const part of parts) {
    if (value && typeof value === 'object' && part in (value as Record<string, unknown>)) {
      value = (value as Record<string, unknown>)[part];
    } else {
      return path;
    }
  }
  return typeof value === 'string' ? value : path;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ka');

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'ka' || stored === 'en') {
      setLocaleState(stored);
    }
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next;
  };

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const t = useMemo(() => {
    const dict = dictionaries[locale];
    return (path: string) => resolve(dict, path);
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
