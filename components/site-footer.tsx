import Image from "next/image";
import Link from "next/link";
import { formatTime, nav, schedule, site } from "@/lib/site";
import { SocialLinks } from "./social-links";

const words = ["Grandir ensemble", "Porter la vie", "Jésus au centre", "Une famille pour tous"];

export function Marquee({ className = "" }: { className?: string }) {
  const row = [...words, ...words, ...words];
  return (
    <div className={`overflow-hidden bg-gold-400 py-3.5 text-night-950 ${className}`} aria-hidden>
      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap">
        {[...row, ...row].map((w, i) => (
          <span key={i} className="eyebrow flex items-center gap-8 !text-[0.75rem]">
            {w} <span className="text-night-950/60">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-night-950 text-white/70">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-2 md:px-8 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Image src="/logo-afvn.png" alt="AFVN — Les Assemblées Fleuve de Vie pour les Nations" width={240} height={90} className="h-auto w-56" />
          <p className="mt-5 max-w-xs text-sm leading-6">{site.tagline}</p>
          <SocialLinks className="mt-6" />
        </div>
        <div>
          <h2 className="eyebrow mb-4 text-gold-400">Explorer</h2>
          <ul className="space-y-2.5 text-sm">
            {[...nav, { label: "Je suis nouveau", href: "/nous-rejoindre" }].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-gold-300">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="eyebrow mb-4 text-gold-400">Horaires</h2>
          <ul className="space-y-4 text-sm">
            {schedule.map((s) => (
              <li key={s.day}>
                <span className="block font-semibold text-white">
                  {s.day} · {formatTime(s.start)}
                </span>
                {s.title}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="eyebrow mb-4 text-gold-400">Nous trouver</h2>
          <address className="space-y-1 text-sm not-italic">
            <p>{site.address.street}</p>
            <p>
              {site.address.postalCode} {site.address.city}
            </p>
            <p className="pt-3">
              <a href={site.phone.href} className="font-semibold text-white hover:text-gold-300">
                {site.phone.display}
              </a>
            </p>
            <p className="pt-1">
              <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-gold-300 hover:underline">
                Itinéraire →
              </a>
            </p>
          </address>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-white/45 md:flex-row md:justify-between md:px-8">
          <p>
            © {new Date().getFullYear()} {site.fullName}
          </p>
          <p>Fait avec soin à Nantes · Installez le site comme une appli sur votre téléphone</p>
        </div>
      </div>
    </footer>
  );
}
