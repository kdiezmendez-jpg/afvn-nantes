import type { Metadata } from "next";
import { Button, Gallery, PageHero } from "@/components/ui";
import { YouTubeLite } from "@/components/youtube-lite";
import { featuredVideos } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/medias/worship-sessions" },
  title: "Worship Sessions",
  description: "Les Worship Sessions de l'AFVN Nantes : des moments consacrés à la louange, l'adoration et la présence de Dieu.",
};

export default function WorshipSessionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Adoration • Louange • Présence de Dieu"
        title="Worship Sessions"
        image="/medias/worship-sessions/photo-1.jpg"
        intro="Des moments spécialement consacrés à la louange, à l'adoration et à la recherche de la présence de Dieu."
      />
      <section className="px-5 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="max-w-3xl text-lg leading-8 text-ink/75">
            À travers les chants, les prières spontanées et les temps de communion, nous créons un environnement propice
            à la rencontre avec le Saint-Esprit. Retrouvez ici quelques extraits de nos temps d&apos;adoration et de
            célébration.
          </p>
          <h2 className="font-display mt-14 mb-8 text-3xl font-semibold text-navy-900">Vidéos</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {featuredVideos.map((v) => (
              <YouTubeLite key={v.id} id={v.id} title={v.title} />
            ))}
          </div>
          <h2 className="font-display mt-16 mb-8 text-3xl font-semibold text-navy-900">Galerie photos</h2>
          <Gallery
            photos={["/medias/worship-sessions/photo-1.jpg", "/medias/worship-sessions/photo-2.jpg"]}
            alt="Worship Session AFVN Nantes"
          />
          <div className="mt-12 text-center">
            <Button href="/nous-rejoindre">Rejoindre l&apos;église</Button>
          </div>
        </div>
      </section>
    </>
  );
}
