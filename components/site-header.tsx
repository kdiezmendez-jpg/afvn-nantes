"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/site";
import { TextSizeToggle } from "./text-size";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open ? "border-b border-white/10 bg-night-950/90 backdrop-blur-lg" : "bg-transparent"
      }`}
    >
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-full focus:bg-gold-400 focus:px-4 focus:py-2 focus:text-night-950"
      >
        Aller au contenu
      </a>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <span className="grid size-12 place-items-center rounded-xl bg-white p-1 shadow-md">
            <Image src="/emblem-afvn.png" alt="" width={44} height={44} priority className="size-10 rounded-full" />
          </span>
          <span className="leading-tight text-white">
            <span className="font-display block text-[1.05rem] font-semibold">Assemblées Fleuve de Vie</span>
            <span className="block text-[0.7rem] uppercase tracking-[0.2em] text-white/60">pour les Nations · Nantes</span>
          </span>
        </Link>

        <nav aria-label="Navigation principale" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`rounded-full px-3.5 py-2 text-sm transition-colors ${
                    isActive(item.href) ? "text-gold-300" : "text-white/80 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={site.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white/30 sm:inline-flex"
          >
            <span className="size-2 rounded-full bg-red-500" aria-hidden />
            Live
            <span className="sr-only"> (YouTube, nouvel onglet)</span>
          </a>
          <Link
            href="/nous-rejoindre"
            className="hidden rounded-full bg-gold-400 px-5 py-2.5 text-sm font-semibold text-night-950 transition hover:bg-gold-300 active:scale-[0.97] md:inline-flex"
          >
            Je suis nouveau ↗
          </Link>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full text-white xl:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen(!open)}
          >
            <span className="relative block h-3.5 w-5" aria-hidden>
              <span className={`absolute left-0 h-0.5 w-5 rounded bg-current transition ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 top-1.5 h-0.5 w-5 rounded bg-current transition ${open ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 h-0.5 w-5 rounded bg-current transition ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </div>

      <div id="menu-mobile" hidden={!open} className="h-[calc(100dvh-5rem)] overflow-y-auto bg-night-950 px-5 pb-10 xl:hidden">
        <nav aria-label="Navigation mobile">
          <ul className="divide-y divide-white/10">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="font-display flex items-center justify-between py-4 text-2xl text-white aria-[current=page]:text-gold-300"
                >
                  {item.label}
                  <span aria-hidden className="text-base text-white/30">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-8 grid gap-3">
          <Link href="/nous-rejoindre" className="rounded-full bg-gold-400 px-6 py-4 text-center font-semibold text-night-950">
            Je suis nouveau
          </Link>
          <a
            href={site.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-4 font-semibold text-white"
          >
            <span className="size-2 rounded-full bg-red-500" aria-hidden /> Suivre le live
          </a>
          <TextSizeToggle inline />
        </div>
      </div>
    </header>
  );
}
