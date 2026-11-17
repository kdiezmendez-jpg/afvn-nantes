import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { Icon, type IconName } from "@/components/icons";
import { PrayerSection } from "@/components/sections";
import { Button, DisplayTitle, Eyebrow, Lead, PageHero } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Demande de prière et accompagnement · AFVN Nantes",
  description: "Besoin de prière ou d'écoute ? L'équipe pastorale de l'AFVN Nantes prie avec vous et vous accompagne, en toute confidentialité.",
  path: "/priere",
});

const support: { t: string; d: string; icon: IconName }[] = [
  { t: "Accompagnement pastoral", d: "Un temps d'écoute et de prière avec le pasteur ou un responsable.", icon: "hands" },
  { t: "Baptême & intégration", d: "Faire le pas du baptême et trouver sa place dans la famille de l'église.", icon: "spark" },
  { t: "Visite et soutien", d: "Être visité et soutenu dans les moments difficiles.", icon: "heart" },
];

export default function PrierePage() {
  return (
    <>
      <PageHero
        eyebrow="Besoin d'aide ?"
        lead="Vous n'êtes"
        accent="pas seul(e)."
        intro="Notre équipe est disponible pour vous écouter, prier avec vous et vous orienter, avec confidentialité."
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href={site.phone.href}>
            <Icon name="phone" className="size-4" /> Appeler l&apos;équipe de prière
          </Button>
          <Button href="/nous-rejoindre" variant="ghost-dark">
            Être accompagné(e)
          </Button>
        </div>
      </PageHero>

      <PrayerSection />

      <section className="px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <Eyebrow>Nous marchons avec vous</Eyebrow>
          <DisplayTitle className="mt-4" lead="Un accompagnement" accent="à chaque saison." />
          <Lead className="mt-6 max-w-2xl">Que vous traversiez une épreuve ou que vous fassiez un nouveau pas dans la foi, vous n&apos;avancez pas seul.</Lead>
          <ul className="mt-12 grid gap-px bg-ink/10 md:grid-cols-3">
            {support.map((s) => (
              <li key={s.t} className="bg-cream p-8">
                <Icon name={s.icon} className="size-6 text-gold-600" />
                <h2 className="font-display mt-8 text-2xl font-semibold">{s.t}</h2>
                <p className="mt-2 text-muted">{s.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

    </>
  );
}
