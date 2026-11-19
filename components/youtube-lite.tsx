"use client";

import Image from "next/image";
import { useState } from "react";
import { saveConsent, useConsent } from "@/lib/consent";

// Vidéo YouTube « légère » : affiche la miniature (servie par notre site) et ne charge
// le lecteur YouTube qu'au clic, avec l'accord du visiteur pour les contenus externes.
export function YouTubeLite({ id, title }: { id: string; title: string }) {
  const consent = useConsent();
  const [active, setActive] = useState(false);
  const [asking, setAsking] = useState(false);

  const play = () => (consent.external ? setActive(true) : setAsking(true));

  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl bg-night-950 shadow-xl shadow-night-950/20">
      {active ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        <>
          <Image
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt=""
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover opacity-80"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-night-950/85 to-night-950/10" />
          {asking ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-night-950/90 p-5 text-center text-white">
              <p className="max-w-sm text-sm leading-6">
                Cette vidéo est hébergée par YouTube, qui peut déposer des cookies. La charger ?
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setActive(true)}
                  className="min-h-11 rounded-full bg-gold-400 px-5 text-sm font-semibold text-night-950 hover:bg-gold-300"
                >
                  Charger la vidéo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    saveConsent({ external: true, analytics: consent.analytics });
                    setActive(true);
                  }}
                  className="min-h-11 rounded-full border border-white/40 px-5 text-sm font-semibold hover:bg-white/10"
                >
                  Toujours autoriser
                </button>
              </div>
            </div>
          ) : (
            <button type="button" onClick={play} className="group absolute inset-0 size-full" aria-label={`Lire la vidéo : ${title}`}>
              <span className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gold-400 text-night-950 shadow-lg transition group-hover:scale-110">
                <svg viewBox="0 0 24 24" className="ml-1 size-6" fill="currentColor" aria-hidden>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span className="absolute bottom-4 left-5 right-5 text-left text-sm font-medium text-white">{title}</span>
            </button>
          )}
        </>
      )}
    </div>
  );
}
