"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

/** Routes that open with a full-bleed dark hero behind a transparent header */
const HERO_ROUTES = new Set(["/", "/about", "/prices"]);

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openedOn, setOpenedOn] = useState(pathname);
  const menuButton = useRef<HTMLButtonElement>(null);

  // close the mobile menu when the route changes
  if (open && openedOn !== pathname) setOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const overHero = HERO_ROUTES.has(pathname) && !scrolled && !open;
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color,backdrop-filter] duration-500 ease-(--ease-out-expo)",
        overHero
          ? "border-b border-transparent bg-transparent"
          : "border-b border-forest-900/8 bg-cream-50/80 shadow-[0_8px_30px_-12px_rgb(13_52_35/0.18)] backdrop-blur-xl backdrop-saturate-150",
      )}
    >
      <div className="container-x flex h-16 items-center justify-between gap-6 lg:h-[4.5rem]">
        <Logo tone={overHero ? "light" : "dark"} />

        <nav aria-label="Primary" className="hidden md:block">
          <ul
            className={cn(
              "flex items-center gap-1 rounded-full p-1 transition-colors duration-500",
              overHero ? "bg-white/8 ring-1 ring-white/15 backdrop-blur-md" : "bg-forest-900/4",
            )}
          >
            {siteConfig.nav.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href} className="relative">
                  {active && (
                    <m.span
                      layoutId="nav-pill"
                      className={cn(
                        "absolute inset-0 rounded-full",
                        overHero ? "bg-white/18" : "bg-white shadow-soft",
                      )}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative block rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300",
                      overHero
                        ? active
                          ? "text-white"
                          : "text-white/75 hover:text-white"
                        : active
                          ? "text-forest-950"
                          : "text-ink-soft hover:text-forest-950",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink
            href={siteConfig.cta.href}
            variant={overHero ? "gold" : "primary"}
            size="sm"
            className="hidden h-10 px-5 sm:inline-flex"
          >
            {siteConfig.cta.short}
            <ArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-0.5" />
          </ButtonLink>

          <button
            ref={menuButton}
            type="button"
            onClick={() => {
              setOpenedOn(pathname);
              setOpen((v) => !v);
            }}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className={cn(
              "grid size-11 place-items-center rounded-full transition-colors md:hidden",
              overHero
                ? "bg-white/10 text-white ring-1 ring-white/20 backdrop-blur-md"
                : "bg-forest-900/5 text-forest-950",
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              <m.span
                key={open ? "x" : "menu"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </m.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-nav"
            key="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "calc(100dvh - 4rem)" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-forest-900/8 bg-cream-50 md:hidden"
          >
            <nav aria-label="Mobile" className="container-x flex h-full flex-col pt-6 pb-8">
              <ul className="flex flex-col">
                {siteConfig.nav.map((item, i) => {
                  const active = isActive(item.href);
                  return (
                    <m.li
                      key={item.href}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + i * 0.06, duration: 0.5 }}
                      className="border-b border-forest-900/8"
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className="flex items-center justify-between py-5"
                      >
                        <span
                          className={cn(
                            "font-display text-[2rem] leading-none",
                            active ? "text-forest-700" : "text-forest-950",
                          )}
                        >
                          {item.label}
                        </span>
                        <ArrowRight
                          className={cn("size-5", active ? "text-forest-600" : "text-muted")}
                        />
                      </Link>
                    </m.li>
                  );
                })}
              </ul>
              <m.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-auto"
              >
                <ButtonLink
                  href={siteConfig.cta.href}
                  size="lg"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  {siteConfig.cta.label}
                  <ArrowRight />
                </ButtonLink>
                <p className="mt-5 text-center text-sm text-muted">{siteConfig.tagline}</p>
              </m.div>
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
