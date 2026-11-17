import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { FinalCta } from "@/components/sections";
import { DisplayTitle, Eyebrow, Gallery, Lead, PageHero } from "@/components/ui";
import { YouTubeLite } from "@/components/youtube-lite";
import { featuredVideos } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Worship Sessions : louange et adoration · AFVN Nantes",
  description: "Les Worship Sessions de l'AFVN Nantes : des soirées consacrées à la louange, à l'adoration et à la recherche de la présence de Dieu.",
  path: "/medias/worship-sessions",
});

export default function WorshipSessionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Adoration · Louange · Présence de Dieu"
        lead="Worship"
        accent="Sessions"
        image="/medias/worship-sessions/photo-1.jpg"
        intro="Des moments spécialement consacrés à la louange, à l'adoration et à la recherche de la présence de Dieu."
      />
      <section className="px-5 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <Lead className="max-w-3xl">
            À travers les chants, les prières spontanées et les temps de communion, nous créons un environnement propice à
            la rencontre avec le Saint-Esprit.
          </Lead>
          <Eyebrow className="mt-16">Vidéos</Eyebrow>
          <DisplayTitle className="mt-3" lead="Revivez la" accent="louange." size="md" />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {featuredVideos.map((v) => (
              <YouTubeLite key={v.id} id={v.id} title={v.title} />
            ))}
          </div>
          <Eyebrow className="mt-20">Galerie</Eyebrow>
          <div className="mt-8">
            <Gallery
              photos={[
                { src: "/medias/worship-sessions/photo-1.jpg", alt: "Worship Session — louange" },
                { src: "/medias/worship-sessions/photo-2.jpg", alt: "Worship Session — chantre" },
              ]}
            />
          </div>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
