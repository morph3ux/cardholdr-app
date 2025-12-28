import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import { i18n, SupportedLocale, SUPPORTED_LOCALES } from '@/i18n';

const LANGUAGE_KEY = '@cardholdr/language';

type LanguageContextType = {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: typeof i18n.t;
  supportedLocales: typeof SUPPORTED_LOCALES;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>(() => {
    // Initial locale from device
    const deviceLocale = Localization.getLocales()[0]?.languageCode ?? 'en';
    return SUPPORTED_LOCALES.some((l) => l.code === deviceLocale)
      ? (deviceLocale as SupportedLocale)
      : 'en';
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved language preference on mount
  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_KEY).then((saved) => {
      if (saved && SUPPORTED_LOCALES.some((l) => l.code === saved)) {
        setLocaleState(saved as SupportedLocale);
        i18n.locale = saved;
      }
      setIsLoaded(true);
    });
  }, []);

  const setLocale = useCallback((newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    i18n.locale = newLocale;
    AsyncStorage.setItem(LANGUAGE_KEY, newLocale);
  }, []);

  // Bind t function to current locale
  const t = useCallback(
    (scope: Parameters<typeof i18n.t>[0], options?: Parameters<typeof i18n.t>[1]) => {
      return i18n.t(scope, options);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale]
  );

  // Update i18n locale when state changes
  useEffect(() => {
    i18n.locale = locale;
  }, [locale]);

  const value: LanguageContextType = {
    locale,
    setLocale,
    t,
    supportedLocales: SUPPORTED_LOCALES,
  };

  // Don't render until we've loaded the saved preference
  if (!isLoaded) {
    return null;
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

