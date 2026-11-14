"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav, site } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Ferme les menus à chaque changement de page.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
    setOpenMenu(null);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setOpenMenu(null);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const solid = scrolled || open || pathname !== "/";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? "bg-navy-950/95 shadow-lg shadow-black/10 backdrop-blur" : "bg-transparent"
      }`}
    >
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-full focus:bg-gold-400 focus:px-4 focus:py-2 focus:text-navy-950"
      >
        Aller au contenu
      </a>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-5 md:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label={`${site.name} — accueil`}>
          <Image
            src="/emblem-afvn.png"
            alt=""
            width={44}
            height={44}
            priority
            className="size-11 rounded-full ring-1 ring-gold-400/60"
          />
          <span className="leading-tight text-white">
            <span className="block font-display text-xl font-semibold tracking-wide text-gold-300">AFVN</span>
            <span className="block text-[0.7rem] uppercase tracking-[0.22em] text-white/70">Église de Nantes</span>
          </span>
        </Link>

        <nav ref={navRef} aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) =>
              item.children ? (
                <li key={item.label} className="relative">
                  <button
                    type="button"
                    aria-expanded={openMenu === item.label}
                    aria-controls={`menu-${item.label}`}
                    onClick={() => setOpenMenu(openMenu === item.label ? null : item.label)}
                    onMouseEnter={() => setOpenMenu(item.label)}
                    className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-white/90 transition-colors hover:text-gold-300"
                  >
                    {item.label}
                    <Chevron open={openMenu === item.label} />
                  </button>
                  <div
                    id={`menu-${item.label}`}
                    onMouseLeave={() => setOpenMenu(null)}
                    className={`absolute left-0 top-full w-64 pt-3 transition duration-200 ${
                      openMenu === item.label
                        ? "visible translate-y-0 opacity-100"
                        : "invisible -translate-y-1 opacity-0"
                    }`}
                  >
                    <ul className="rounded-2xl border border-white/10 bg-navy-900 p-2 shadow-2xl">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="block rounded-xl px-4 py-2.5 text-sm text-white/85 transition-colors hover:bg-white/5 hover:text-gold-300"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ) : (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="rounded-full px-4 py-2 text-sm font-medium text-white/90 transition-colors hover:text-gold-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/#visite"
            className="hidden rounded-full bg-gold-400 px-5 py-2.5 text-sm font-semibold text-navy-950 transition hover:bg-gold-300 active:scale-[0.97] sm:inline-block"
          >
            Préparer ma visite
          </Link>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full text-white lg:hidden"
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

      <div
        id="menu-mobile"
        hidden={!open}
        className="h-[calc(100dvh-5rem)] overflow-y-auto border-t border-white/10 bg-navy-950 px-5 pb-10 lg:hidden"
      >
        <nav aria-label="Navigation mobile">
          <ul className="divide-y divide-white/10">
            {nav.map((item) => (
              <li key={item.label} className="py-4">
                {item.children ? (
                  <>
                    <p className="eyebrow mb-2 text-gold-400">{item.label}</p>
                    <ul>
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link href={child.href} className="block py-2 text-lg text-white">
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link href={item.href} className="block text-lg text-white">
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <Link
          href="/#visite"
          className="mt-6 block rounded-full bg-gold-400 px-6 py-4 text-center font-semibold text-navy-950"
        >
          Préparer ma visite
        </Link>
        <a href={site.phone.href} className="mt-3 block rounded-full border border-white/20 px-6 py-4 text-center font-semibold text-white">
          Appeler l&apos;église
        </a>
      </div>
    </header>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="m4 6 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
