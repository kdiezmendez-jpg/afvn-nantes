"use client";

import { useSyncExternalStore } from "react";

const SIZES = ["md", "lg", "xl"] as const;
type Size = (typeof SIZES)[number];
const LABELS: Record<Size, string> = { md: "normale", lg: "grande", xl: "très grande" };
const EVENT = "afvn-text";

// La taille est stockée sur <html data-text="…"> (appliquée avant l'affichage par un petit script)
// et mémorisée sur l'appareil.
const subscribe = (cb: () => void) => {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
};
const read = (): Size => {
  const v = document.documentElement.dataset.text as Size | undefined;
  return v && SIZES.includes(v) ? v : "md";
};

// Bouton « Aa » : agrandit le texte du site (accessibilité).
export function TextSizeToggle({ inline = false }: { inline?: boolean }) {
  const size = useSyncExternalStore(subscribe, read, () => "md" as Size);
  const next = SIZES[(SIZES.indexOf(size) + 1) % SIZES.length];

  const apply = () => {
    document.documentElement.dataset.text = next;
    try {
      localStorage.setItem("afvn-text", next);
    } catch {}
    window.dispatchEvent(new Event(EVENT));
  };

  if (inline) {
    return (
      <button
        type="button"
        onClick={apply}
        className="flex w-full items-center justify-center gap-3 rounded-full border border-white/20 px-6 py-4 font-semibold text-white"
      >
        <span className="font-display text-lg">Aa</span> Taille du texte : {LABELS[size]}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={apply}
      aria-label={`Taille du texte : ${LABELS[size]}. Passer en taille ${LABELS[next]}.`}
      className="fixed bottom-6 left-4 z-40 hidden size-12 place-items-center rounded-full bg-gold-400 font-display text-lg font-bold text-night-950 shadow-xl shadow-night-950/25 transition hover:scale-105 lg:grid"
    >
      Aa
      {size !== "md" ? <span className="absolute -right-0.5 -top-0.5 size-3 rounded-full border-2 border-cream bg-night-900" aria-hidden /> : null}
    </button>
  );
}
