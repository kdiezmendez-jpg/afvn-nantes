"use client";

import Image from "next/image";
import { useState } from "react";

// Vidéo YouTube "légère" : affiche la miniature et ne charge le lecteur
// (et les cookies YouTube) qu'au clic. Plus rapide et respectueux de la vie privée.
export function YouTubeLite({ id, title }: { id: string; title: string }) {
  const [active, setActive] = useState(false);

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
        <button
          type="button"
          onClick={() => setActive(true)}
          className="group absolute inset-0 size-full"
          aria-label={`Lire la vidéo : ${title}`}
        >
          <Image
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt=""
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover opacity-80 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-100"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-night-950/80 to-transparent" />
          <span className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gold-400 text-night-950 shadow-lg transition group-hover:scale-110">
            <svg viewBox="0 0 24 24" className="ml-1 size-6" fill="currentColor" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="absolute bottom-4 left-5 right-5 text-left text-sm font-medium text-white">{title}</span>
        </button>
      )}
    </div>
  );
}
