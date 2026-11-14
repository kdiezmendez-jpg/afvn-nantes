import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { GiveSection } from "@/components/sections";
import { DisplayTitle, Eyebrow, Lead, PageHero } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Donner — Dîmes, offrandes et projets",
  description: "Soutenir la mission de l'AFVN Nantes : dîmes, offrandes, actions sociales et projets de l'église.",
  alternates: { canonical: "/donner" },
};

export default function DonnerPage() {
  const online = Boolean(site.donationUrl);
  return (
    <>
      <PageHero
        eyebrow="Soutenir la mission"
        lead="Chaque don"
        accent="porte la vie."
        intro="Vos dons permettent à l'église d'accueillir, d'enseigner, d'aider les familles et de faire grandir les missions de l'AFVN."
      />
      <GiveSection />
      <section className="bg-white px-5 py-20 md:px-8">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[auto_1fr] md:items-start">
          <span className="grid size-14 place-items-center rounded-full bg-gold-200/60 text-gold-600">
            <Icon name="lock" className="size-6" />
          </span>
          <div>
            <Eyebrow>Transparence & sécurité</Eyebrow>
            <DisplayTitle className="mt-3" lead="Comment" accent="donner ?" size="md" />
            <Lead className="mt-4">
              {online
                ? "Les dons en ligne passent par une plateforme de paiement sécurisée : vos coordonnées bancaires ne transitent jamais par notre site, et un reçu vous est envoyé."
                : "Pendant les cultes, au moment des offrandes. Le don en ligne sécurisé (avec reçu) arrive très bientôt : vos coordonnées bancaires ne transiteront jamais par notre site."}
            </Lead>
            <p className="mt-4 text-muted">
              Une question sur les dons ? Appelez-nous au{" "}
              <a href={site.phone.href} className="font-semibold text-ink underline underline-offset-4">
                {site.phone.display}
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
