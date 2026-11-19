import type { Metadata } from "next";
import { Button, PageHero } from "@/components/ui";
import { formatTime, schedule, site } from "@/lib/site";

export const metadata: Metadata = { title: "Hors ligne", robots: { index: false } };

export default function HorsLignePage() {
  return (
    <PageHero
      eyebrow="Pas de connexion"
      lead="Vous êtes"
      accent="hors ligne."
      intro={
        <>
          <p>Reconnectez-vous pour voir cette page. En attendant, voici l&apos;essentiel :</p>
          <ul className="mt-4 space-y-1">
            {schedule.map((s) => (
              <li key={s.day}>
                {s.day} · {s.title} · {formatTime(s.start)} – {formatTime(s.end)}
              </li>
            ))}
            <li>
              {site.address.street}, {site.address.postalCode} {site.address.city}
            </li>
          </ul>
        </>
      }
    >
      <div className="mt-8">
        <Button href={site.phone.href}>Appeler {site.phone.display}</Button>
      </div>
    </PageHero>
  );
}
