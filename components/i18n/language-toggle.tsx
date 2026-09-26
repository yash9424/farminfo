"use client";

import * as m from "motion/react-m";
import { LOCALES, type Locale } from "@/locales";
import { cn } from "@/lib/utils";
import { useLanguage } from "./language-provider";

const LABELS: Record<Locale, { short: string; full: string; lang: string }> = {
  en: { short: "EN", full: "EN", lang: "en" },
  gu: { short: "ગુ", full: "ગુજરાતી", lang: "gu" },
};

/**
 * EN | ગુજરાતી segmented control. Visually matches the header nav pill:
 * glass on the hero, soft tint once the header turns solid.
 */
export function LanguageToggle({
  overHero,
  variant = "header",
  className,
}: {
  overHero: boolean;
  /** "header": compact pill in the bar · "menu": full-width control in the mobile menu */
  variant?: "header" | "menu";
  className?: string;
}) {
  const { pendingLocale, setLocale, t } = useLanguage();
  const menu = variant === "menu";

  return (
    <div
      role="group"
      aria-label={t.language.label}
      className={cn(
        "relative flex items-center rounded-full p-1 transition-colors duration-500",
        overHero ? "bg-white/8 ring-1 ring-white/15 backdrop-blur-md" : "bg-forest-900/4",
        menu && "w-full",
        className,
      )}
    >
      {LOCALES.map((code) => {
        const active = pendingLocale === code;
        const label = LABELS[code];
        return (
          <button
            key={code}
            type="button"
            lang={label.lang}
            aria-pressed={active}
            aria-label={code === "en" ? t.language.english : t.language.gujarati}
            onClick={() => setLocale(code)}
            className={cn(
              "relative rounded-full font-semibold transition-colors duration-300",
              menu ? "h-11 flex-1 text-[0.9375rem]" : "h-8 px-3 text-[0.8125rem] leading-none",
              overHero
                ? active
                  ? "text-white"
                  : "text-white/70 hover:text-white"
                : active
                  ? "text-forest-950"
                  : "text-ink-soft hover:text-forest-950",
            )}
          >
            {active && (
              <m.span
                layoutId={menu ? "lang-pill-menu" : "lang-pill"}
                className={cn(
                  "absolute inset-0 rounded-full",
                  overHero ? "bg-white/18" : "bg-white shadow-soft",
                )}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative">
              {menu ? (
                code === "en" ? t.language.english : t.language.gujarati
              ) : (
                <>
                  <span className="lg:hidden">{label.short}</span>
                  <span className="hidden lg:inline">{label.full}</span>
                </>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
