import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { LiveSection } from "@/components/sections";
import { Button, DisplayTitle, Eyebrow, Gallery, Lead, PageHero } from "@/components/ui";
import { gallery, site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Prédications, live et vidéos · AFVN Nantes",
  description: "Suivez le culte de l'AFVN Nantes en direct le dimanche à 9h30 et retrouvez prédications, enseignements et temps de louange en vidéo.",
  path: "/predications",
});

export default function PredicationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Nourrir sa foi"
        lead="Prédications"
        accent="& enseignements."
        intro="Messages, enseignements bibliques et temps d'adoration : vivez le culte en direct ou en replay, où que vous soyez."
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href={site.liveUrl} external>
            ● Regarder le direct sur YouTube
          </Button>
          <Button href={site.socials.youtube} external variant="ghost-dark">
            Toute la chaîne YouTube
          </Button>
        </div>
      </PageHero>

      <LiveSection />

      <section className="px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <Eyebrow>À la une</Eyebrow>
              <DisplayTitle className="mt-4" lead="Photos" accent="de l'AFVN." />
              <Lead className="mt-5 max-w-xl">Quelques instants de communion, d&apos;adoration et de joie partagée.</Lead>
            </div>
            <Button href={site.socials.instagram} external variant="ghost-light">
              Suivre sur Instagram
            </Button>
          </div>
          <div className="mt-12">
            <Gallery photos={gallery} />
          </div>
        </div>
      </section>
    </>
  );
}
