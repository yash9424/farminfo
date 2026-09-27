"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { ArrowRight, Menu, Plus, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SearchDialog } from "@/components/search/search-dialog";
import { ButtonLink } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

/** Only the home page opens on a full-bleed dark hero behind a transparent header. */
const TRANSPARENT_ROUTES = new Set(["/"]);

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  // close the mobile menu after navigating
  if (menuOpen && menuPath !== pathname) setMenuOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // "/" or Ctrl/⌘+K opens search anywhere
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest("input, textarea, select, [contenteditable]");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const transparent = TRANSPARENT_ROUTES.has(pathname) && !scrolled && !menuOpen;
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-500 ease-(--ease-out-expo)",
          transparent
            ? "border-transparent bg-transparent"
            : "border-white/8 bg-graphite-950/92 shadow-[0_10px_30px_-18px_rgb(0_0_0/0.7)] backdrop-blur-xl",
        )}
      >
        <div className="container-x flex h-16 items-center justify-between gap-4 lg:h-[4.25rem]">
          <Logo tone="light" />

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {siteConfig.nav.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href} className="relative">
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative block rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors duration-300",
                        active ? "text-white" : "text-graphite-300 hover:text-white",
                      )}
                    >
                      {item.label}
                      {active && (
                        <m.span
                          layoutId="nav-underline"
                          className="absolute inset-x-3.5 -bottom-[0.95rem] h-0.5 rounded-full bg-accent-500"
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="group hidden h-10 items-center gap-2.5 rounded-xl border border-white/12 bg-white/6 pr-2 pl-3 text-sm text-graphite-300 transition-colors hover:border-white/25 hover:bg-white/10 hover:text-white md:flex"
            >
              <Search className="size-4" aria-hidden />
              <span className="hidden xl:inline">Search parts</span>
              <span className="sr-only xl:hidden">Search parts</span>
              <kbd className="ml-1 hidden rounded-md border border-white/15 px-1.5 py-0.5 font-sans text-[0.6875rem] text-graphite-400 xl:inline">
                /
              </kbd>
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search parts"
              className="grid size-10 place-items-center rounded-xl text-white transition-colors hover:bg-white/10 md:hidden"
            >
              <Search className="size-5" />
            </button>

            <ButtonLink href={siteConfig.listCta.href} variant="accent" size="sm" className="hidden h-10 px-4 sm:inline-flex">
              <Plus aria-hidden />
              {siteConfig.listCta.label}
            </ButtonLink>

            <button
              ref={menuButton}
              type="button"
              onClick={() => {
                setMenuPath(pathname);
                setMenuOpen((v) => !v);
              }}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="grid size-10 place-items-center rounded-xl text-white transition-colors hover:bg-white/10 lg:hidden"
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <m.div
              id="mobile-nav"
              key="mobile-nav"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "calc(100dvh - 4rem)" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-t border-white/8 bg-graphite-950 lg:hidden"
            >
              <nav aria-label="Mobile" className="container-x flex h-full flex-col pt-4 pb-8">
                <ul>
                  {siteConfig.nav.map((item, i) => {
                    const active = isActive(item.href);
                    return (
                      <m.li
                        key={item.href}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 + i * 0.05, duration: 0.4 }}
                        className="border-b border-white/8"
                      >
                        <Link
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className="flex items-center justify-between py-4"
                        >
                          <span className={cn("text-2xl font-bold", active ? "text-accent-400" : "text-white")}>
                            {item.label}
                          </span>
                          <ArrowRight className="size-5 text-graphite-500" aria-hidden />
                        </Link>
                      </m.li>
                    );
                  })}
                </ul>
                <div className="mt-auto space-y-3">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      setSearchOpen(true);
                    }}
                    className="flex h-12 w-full items-center gap-3 rounded-xl border border-white/12 bg-white/6 px-4 text-left text-graphite-300"
                  >
                    <Search className="size-5" aria-hidden />
                    Search parts…
                  </button>
                  <ButtonLink
                    href={siteConfig.listCta.href}
                    variant="accent"
                    size="lg"
                    className="w-full"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Plus aria-hidden />
                    {siteConfig.listCta.label}
                  </ButtonLink>
                  <p className="pt-2 text-center text-sm text-graphite-400">{siteConfig.positioning}</p>
                </div>
              </nav>
            </m.div>
          )}
        </AnimatePresence>
      </header>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
