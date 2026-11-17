"use client";

import { useSyncExternalStore } from "react";

// Consentement aux cookies et traceurs (règles CNIL) :
// - rien de non nécessaire n'est chargé avant le choix du visiteur ;
// - « Accepter » et « Refuser » ont le même poids ;
// - le choix est conservé 6 mois, puis redemandé ;
// - il peut être modifié à tout moment (lien « Gérer les cookies » du pied de page).

export type Consent = {
  external: boolean; // contenus externes : vidéos YouTube, carte Google Maps
  analytics: boolean; // mesure d'audience (Vercel Web Analytics)
  decided: boolean;
  date?: number;
};

const KEY = "afvn-consent";
const EVENT = "afvn-consent";
export const OPEN_EVENT = "afvn-consent-open";
const MAX_AGE = 1000 * 60 * 60 * 24 * 182; // 6 mois

const EMPTY: Consent = { external: false, analytics: false, decided: false };
let cache: Consent | null = null;

function read(): Consent {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const v = JSON.parse(raw) as Consent;
      if (v.date && Date.now() - v.date < MAX_AGE) {
        cache = { external: !!v.external, analytics: !!v.analytics, decided: true, date: v.date };
        return cache;
      }
    }
  } catch {}
  cache = EMPTY;
  return cache;
}

export function saveConsent(choice: { external: boolean; analytics: boolean }) {
  cache = { ...choice, decided: true, date: Date.now() };
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

export function openConsentPanel() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

const subscribe = (cb: () => void) => {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
};

// Côté serveur (et au tout premier rendu), on considère qu'aucun consentement n'est donné.
export function useConsent(): Consent & { ready: boolean } {
  const c = useSyncExternalStore(subscribe, read, () => null);
  return c ? { ...c, ready: true } : { ...EMPTY, ready: false };
}
