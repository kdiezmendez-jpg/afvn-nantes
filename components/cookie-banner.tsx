"use client";

import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { useEffect, useRef, useState } from "react";
import { OPEN_EVENT, openConsentPanel, saveConsent, useConsent } from "@/lib/consent";

// Bandeau de consentement + chargement de la mesure d'audience après accord.
export function CookieBanner() {
  const consent = useConsent();
  const [forced, setForced] = useState(false);
  const [custom, setCustom] = useState(false);
  const [external, setExternal] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const open = () => {
      setForced(true);
      setCustom(true);
    };
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, []);

  const visible = consent.ready && (!consent.decided || forced);

  useEffect(() => {
    if (visible && forced) titleRef.current?.focus();
  }, [visible, forced]);

  const decide = (choice: { external: boolean; analytics: boolean }) => {
    saveConsent(choice);
    setForced(false);
    setCustom(false);
  };

  const startCustom = () => {
    setExternal(consent.external);
    setAnalytics(consent.analytics);
    setCustom(true);
  };

  return (
    <>
      {consent.analytics ? <Analytics /> : null}
      {visible ? (
        <section
          role="dialog"
          aria-modal="false"
          aria-labelledby="cookies-titre"
          className="fixed inset-x-3 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-[60] mx-auto max-w-2xl rounded-2xl border border-white/15 bg-night-950 p-4 text-white shadow-2xl shadow-black/40 sm:p-6 lg:bottom-6"
        >
          <h2 id="cookies-titre" ref={titleRef} tabIndex={-1} className="font-display text-lg font-semibold outline-none sm:text-xl">
            Vos choix sur les cookies
          </h2>
          <p className="mt-1.5 text-sm leading-6 text-white/75">
            Aucun cookie publicitaire. Avec votre accord : vidéos YouTube, carte Google Maps et mesure d&apos;audience
            anonyme. Modifiable à tout moment.{" "}
            <Link href="/confidentialite" className="text-gold-300 underline underline-offset-2">
              En savoir plus
            </Link>
          </p>

          {custom ? (
            <fieldset className="mt-4 space-y-3">
              <legend className="sr-only">Choisir les catégories</legend>
              <Toggle
                id="c-external"
                label="Contenus externes"
                hint="Vidéos YouTube et carte Google Maps"
                checked={external}
                onChange={setExternal}
              />
              <Toggle
                id="c-analytics"
                label="Mesure d'audience"
                hint="Statistiques anonymes de visite (sans cookie)"
                checked={analytics}
                onChange={setAnalytics}
              />
            </fieldset>
          ) : null}

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => decide({ external: false, analytics: false })}
              className="min-h-11 rounded-full border border-white/40 px-5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Tout refuser
            </button>
            <button
              type="button"
              onClick={() => decide({ external: true, analytics: true })}
              className="min-h-11 rounded-full border border-white/40 px-5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Tout accepter
            </button>
          </div>
          {custom ? (
            <button
              type="button"
              onClick={() => decide({ external, analytics })}
              className="mt-2 min-h-11 w-full rounded-full bg-gold-400 px-5 text-sm font-semibold text-night-950 hover:bg-gold-300"
            >
              Enregistrer mes choix
            </button>
          ) : (
            <button type="button" onClick={startCustom} className="mt-2 inline-flex min-h-11 items-center text-sm text-white/75 underline underline-offset-2 hover:text-white">
              Personnaliser
            </button>
          )}
        </section>
      ) : null}
    </>
  );
}

function Toggle({ id, label, hint, checked, onChange }: { id: string; label: string; hint: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center justify-between gap-4 rounded-xl bg-white/5 px-4 py-3">
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        <span className="text-xs text-white/65">{hint}</span>
      </span>
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="size-5 accent-[#efb54a]" />
    </label>
  );
}

export function ManageCookiesButton({ className = "" }: { className?: string }) {
  return (
    <button type="button" onClick={openConsentPanel} className={`underline-offset-2 hover:text-gold-300 hover:underline ${className}`}>
      Gérer les cookies
    </button>
  );
}
