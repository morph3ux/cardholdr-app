import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';

import en from './locales/en';
import ro from './locales/ro';

export const i18n = new I18n({
  en,
  ro,
});

// Set the locale based on device settings
i18n.locale = Localization.getLocales()[0]?.languageCode ?? 'en';

// Enable fallback to default language (English)
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export type TranslationKeys = typeof en;
export type SupportedLocale = 'en' | 'ro';

export const SUPPORTED_LOCALES: { code: SupportedLocale; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'ro', name: 'Română' },
];

