import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";
import { DEFAULT_LOCALE, LOCALE_COOKIE, dictionaries, isLocale, type Locale } from "@/locales";

/** Current visitor's language, from the `farminfo-lang` cookie (server components only). */
export const getLocale = cache(async (): Promise<Locale> => {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
});

/** `{ locale, t }` for server components. Client components use `useLanguage()`. */
export const getI18n = cache(async () => {
  const locale = await getLocale();
  return { locale, t: dictionaries[locale] };
});
