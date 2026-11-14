import type { Metadata } from "next";
import { Button, ComingSoon, PageHero } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  // Page masquée des moteurs de recherche tant qu'elle n'a pas de contenu.
  robots: { index: false, follow: true },
  title: "Conférences",
  description: "Les conférences AFVN : des temps forts de révélation, d'enseignement et d'activation spirituelle.",
};

export default function ConferencesPage() {
  return (
    <>
      <PageHero
        eyebrow="Impact • Réveil • Transformation"
        title="Conférences"
        image="/medias/eschatos/photo-3.jpg"
        intro="Les conférences AFVN sont des temps forts de révélation, d'enseignement et d'activation spirituelle pour toute l'Église."
      />
      <section className="px-5 py-20 md:px-8">
        <div className="mx-auto max-w-4xl">
          <ComingSoon what="photos et vidéos des conférences" />
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href={site.socials.youtube} external variant="navy">
              Voir sur YouTube
            </Button>
            <Button href="/medias/eschatos" variant="outline-dark">
              Découvrir ESCHATOS 2026
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
