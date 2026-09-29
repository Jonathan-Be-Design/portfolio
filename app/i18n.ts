export type Locale = 'pt' | 'en';

export const isLocale = (value: string): value is Locale => value === 'pt' || value === 'en';

export const tr = (locale: Locale, pt: string, en: string) => locale === 'en' ? en : pt;
