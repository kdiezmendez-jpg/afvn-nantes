"use client";

import { useState } from "react";
import { saveConsent, useConsent } from "@/lib/consent";
import { site } from "@/lib/site";

// Carte Google Maps chargée uniquement avec l'accord du visiteur.
export function MapEmbed({ className = "h-64" }: { className?: string }) {
  const consent = useConsent();
  const [once, setOnce] = useState(false);

  if (consent.external || once) {
    return (
      <iframe
        src={site.mapsEmbed}
        title="Plan d'accès à l'AFVN Nantes"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className={`w-full ${className}`}
      />
    );
  }

  return (
    <div className={`flex w-full flex-col items-center justify-center gap-3 bg-night-800 p-6 text-center text-white ${className}`}>
      <p className="text-sm leading-6 text-white/80">La carte est fournie par Google Maps, qui peut déposer des cookies.</p>
      <div className="flex flex-wrap justify-center gap-2">
        <button type="button" onClick={() => setOnce(true)} className="min-h-11 rounded-full bg-gold-400 px-5 text-sm font-semibold text-night-950 hover:bg-gold-300">
          Afficher la carte
        </button>
        <a
          href={site.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center rounded-full border border-white/40 px-5 text-sm font-semibold hover:bg-white/10"
        >
          Ouvrir dans Google Maps
        </a>
      </div>
      <button
        type="button"
        onClick={() => saveConsent({ external: true, analytics: consent.analytics })}
        className="text-xs text-white/70 underline underline-offset-2"
      >
        Toujours autoriser les contenus externes
      </button>
    </div>
  );
}
