"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { ChevronLeft, ChevronRight, Expand, X, ZoomIn, ZoomOut } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";

function Arrow({ dir, dark, onGo }: { dir: -1 | 1; dark?: boolean; onGo: (dir: number) => void }) {
  return (
    <button
      type="button"
      onClick={() => onGo(dir)}
      aria-label={dir < 0 ? "Previous image" : "Next image"}
      className={cn(
        "absolute top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full shadow-lg transition-[opacity,transform] hover:scale-105",
        dir < 0 ? "left-3" : "right-3",
        dark ? "bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20" : "bg-white/90 text-ink",
      )}
    >
      {dir < 0 ? <ChevronLeft className="size-5" /> : <ChevronRight className="size-5" />}
    </button>
  );
}

/** Part photo gallery: thumbnails, arrows, counter, keyboard + swipe, fullscreen with zoom. */
export function Gallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [full, setFull] = useState(false);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const touchX = useRef<number | null>(null);
  const count = images.length;

  const go = useCallback(
    (dir: number) => {
      setZoom(null);
      setIndex((i) => (i + dir + count) % count);
    },
    [count],
  );

  const swipe = {
    onTouchStart: (e: React.TouchEvent) => (touchX.current = e.touches[0].clientX),
    onTouchEnd: (e: React.TouchEvent) => {
      if (touchX.current === null) return;
      const dx = e.changedTouches[0].clientX - touchX.current;
      if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
      touchX.current = null;
    },
  };

  const keys = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };

  return (
    <div>
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={`${title} photos`}
        tabIndex={0}
        onKeyDown={keys}
        {...swipe}
        className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-graphite-100 outline-none"
      >
        <AnimatePresence initial={false} mode="popLayout">
          <m.div
            key={images[index]}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Image
              src={images[index]}
              alt={`${title} — photo ${index + 1} of ${count}`}
              fill
              priority={index === 0}
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover"
            />
          </m.div>
        </AnimatePresence>
        {count > 1 && (
          <>
            <Arrow dir={-1} onGo={go} />
            <Arrow dir={1} onGo={go} />
          </>
        )}
        <span className="absolute bottom-3 left-3 rounded-md bg-graphite-950/75 px-2 py-1 text-xs font-semibold text-white tabular backdrop-blur" aria-live="polite">
          {index + 1} / {count}
        </span>
        <button
          type="button"
          onClick={() => setFull(true)}
          className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-lg bg-white/90 px-2.5 py-1.5 text-xs font-semibold text-ink shadow-sm transition-colors hover:bg-white"
        >
          <Expand className="size-3.5" aria-hidden />
          Fullscreen
        </button>
      </div>

      {count > 1 && (
        <ul className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none" aria-label="Choose photo">
          {images.map((src, i) => (
            <li key={src} className="shrink-0">
              <button
                type="button"
                onClick={() => {
                  setZoom(null);
                  setIndex(i);
                }}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                className={cn(
                  "relative block h-16 w-22 overflow-hidden rounded-lg border-2 transition-[border-color,opacity] sm:h-18 sm:w-24",
                  i === index ? "border-accent-500" : "border-transparent opacity-70 hover:opacity-100",
                )}
              >
                <Image src={src} alt="" fill sizes="96px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* fullscreen viewer */}
      <Dialog.Root
        open={full}
        onOpenChange={(o) => {
          setFull(o);
          setZoom(null);
        }}
      >
        <AnimatePresence>
          {full && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild forceMount>
                <m.div className="fixed inset-0 z-[90] bg-graphite-950/95" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
              </Dialog.Overlay>
              <Dialog.Content asChild forceMount aria-describedby={undefined} onKeyDown={keys}>
                <m.div
                  className="fixed inset-0 z-[91] flex flex-col outline-none"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="flex items-center justify-between gap-3 px-4 py-3 text-white">
                    <Dialog.Title className="truncate text-sm font-semibold">
                      {title} <span className="ml-2 text-graphite-400 tabular">{index + 1} / {count}</span>
                    </Dialog.Title>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setZoom((z) => (z ? null : { x: 50, y: 50 }))}
                        aria-label={zoom ? "Zoom out" : "Zoom in"}
                        className="grid size-10 place-items-center rounded-lg hover:bg-white/10"
                      >
                        {zoom ? <ZoomOut className="size-5" /> : <ZoomIn className="size-5" />}
                      </button>
                      <Dialog.Close className="grid size-10 place-items-center rounded-lg hover:bg-white/10" aria-label="Close fullscreen">
                        <X className="size-5" />
                      </Dialog.Close>
                    </div>
                  </div>
                  <div className="relative flex-1 overflow-hidden" {...swipe}>
                    <div
                      className={cn("absolute inset-0 transition-transform duration-300", zoom ? "cursor-zoom-out" : "cursor-zoom-in")}
                      style={zoom ? { transform: "scale(2.2)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
                      onClick={(e) => {
                        if (zoom) return setZoom(null);
                        const r = e.currentTarget.getBoundingClientRect();
                        setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
                      }}
                      onMouseMove={(e) => {
                        if (!zoom) return;
                        const r = e.currentTarget.parentElement!.getBoundingClientRect();
                        setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
                      }}
                    >
                      <Image src={images[index]} alt={`${title} — photo ${index + 1} of ${count}`} fill sizes="100vw" className="object-contain" />
                    </div>
                    {count > 1 && !zoom && (
                      <>
                        <Arrow dir={-1} dark onGo={go} />
                        <Arrow dir={1} dark onGo={go} />
                      </>
                    )}
                  </div>
                  <p className="py-3 text-center text-xs text-graphite-500">← → to navigate · click to zoom · Esc to close</p>
                </m.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </div>
  );
}
