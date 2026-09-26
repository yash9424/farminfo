"use client";

import { useRouter } from "next/navigation";
import { createContext, use, useCallback, useOptimistic, useTransition } from "react";
import { LOCALE_COOKIE, dictionaries, type Dictionary, type Locale } from "@/locales";

interface LanguageState {
  /** Language the page is currently rendered in */
  locale: Locale;
  t: Dictionary;
  /** Language the user just picked — updates instantly, before the new content arrives */
  pendingLocale: Locale;
  isSwitching: boolean;
  setLocale: (locale: Locale) => void;
}

const Ctx = createContext<LanguageState | null>(null);

/**
 * Holds the active language for client components. The server reads the same
 * cookie, so switching = write cookie + soft refresh (no full page reload):
 * server components re-render in the new language while the UI stays mounted.
 */
export function LanguageProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const router = useRouter();
  const [isSwitching, startTransition] = useTransition();
  const [pendingLocale, setPendingLocale] = useOptimistic(locale);

  const setLocale = useCallback(
    (next: Locale) => {
      if (next === pendingLocale) return;
      document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
      startTransition(() => {
        setPendingLocale(next);
        router.refresh();
      });
    },
    [pendingLocale, router, setPendingLocale],
  );

  return (
    <Ctx value={{ locale, t: dictionaries[locale], pendingLocale, isSwitching, setLocale }}>
      {children}
    </Ctx>
  );
}

export function useLanguage() {
  const ctx = use(Ctx);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
}

/** Softly fades page content while a language switch is in flight. */
export function LocaleFade({ children }: { children: React.ReactNode }) {
  const { isSwitching } = useLanguage();
  return (
    <div
      className={
        "flex flex-1 flex-col transition-opacity duration-300 ease-(--ease-out-expo) " +
        (isSwitching ? "opacity-40" : "opacity-100")
      }
    >
      {children}
    </div>
  );
}
