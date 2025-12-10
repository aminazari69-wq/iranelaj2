import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';

export const locales = ['ar', 'fa', 'en'] as const;
export const defaultLocale = 'ar' as const;

export type Locale = (typeof locales)[number];

export function isRTL(locale: Locale): boolean {
  return locale === 'ar' || locale === 'fa';
}

export function getDirection(locale: Locale): 'rtl' | 'ltr' {
  return isRTL(locale) ? 'rtl' : 'ltr';
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const headersList = await headers();
  
  // Try to get locale from cookie first
  let locale = cookieStore.get('locale')?.value as Locale | undefined;
  
  // If not in cookie, try Accept-Language header
  if (!locale) {
    const acceptLanguage = headersList.get('accept-language');
    if (acceptLanguage) {
      const preferred = acceptLanguage.split(',')[0].split('-')[0];
      if (locales.includes(preferred as Locale)) {
        locale = preferred as Locale;
      }
    }
  }
  
  // Default to Arabic
  if (!locale || !locales.includes(locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
