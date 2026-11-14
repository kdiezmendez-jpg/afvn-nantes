import Image from "next/image";
import Link from "next/link";
import { formatTime, nav, schedule, site } from "@/lib/site";
import { SocialLinks } from "./social-links";

export function SiteFooter() {
  const links = nav.flatMap((item) => item.children ?? [item]);
  return (
    <footer className="bg-navy-950 text-white/75">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-8">
        <div>
          <Image src="/logo-afvn.png" alt="AFVN — Les Assemblées Fleuve de Vie pour les Nations" width={240} height={90} className="h-auto w-56" />
          <p className="mt-5 max-w-xs text-sm leading-6">{site.tagline}</p>
          <SocialLinks className="mt-6" />
        </div>

        <div>
          <h2 className="eyebrow mb-4 text-gold-400">Navigation</h2>
          <ul className="space-y-2 text-sm">
            {links.map((l) => (
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
          <ul className="space-y-3 text-sm">
            {schedule.map((s) => (
              <li key={s.day}>
                <span className="block font-semibold text-white">{s.day}</span>
                {s.title} · {formatTime(s.start)} – {formatTime(s.end)}
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
            <p className="pt-2">
              <a href={site.phone.href} className="font-semibold text-white hover:text-gold-300">
                {site.phone.display}
              </a>
            </p>
          </address>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-5 py-6 text-xs text-white/50 md:px-8">
          © {new Date().getFullYear()} {site.fullName}. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
