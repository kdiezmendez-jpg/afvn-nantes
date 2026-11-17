import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { Button, DisplayTitle, Eyebrow, Gallery, Lead, PageHero } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "ESCHATOS 2026 : conférence d'eschatologie · AFVN Nantes",
  description: "ESCHATOS, la conférence annuelle des AFVN sur les temps de la fin. Édition 2026 : la bataille de Gog et Magog sur les Montagnes d'Israël.",
  path: "/medias/eschatos",
});

const photos = [1, 2, 3, 4, 5, 6].map((n) => ({ src: `/medias/eschatos/photo-${n}.jpg`, alt: `ESCHATOS 2026 — photo ${n}` }));

export default function EschatosPage() {
  return (
    <>
      <PageHero
        eyebrow="Conférence annuelle d'eschatologie"
        lead="ESCHATOS"
        accent="2026"
        image="/medias/eschatos/photo-6.jpg"
        intro={<p className="font-display text-2xl text-gold-300">La bataille de Gog et Magog sur les Montagnes d&apos;Israël</p>}
      />
      <section className="px-5 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-6 text-lg leading-8 text-muted">
              <p>
                ESCHATOS est la conférence annuelle des Assemblées Fleuve de Vie pour les Nations consacrée à l&apos;étude
                des temps de la fin, des prophéties bibliques et des événements annonçant le retour glorieux de notre
                Seigneur Jésus-Christ.
              </p>
              <p>
                Cette édition a également marqué la présentation officielle du premier ouvrage du Pasteur Diez Mendez
                Kambault : <strong className="text-ink">« La Dernière Génération »</strong>.
              </p>
            </div>
            <aside className="bg-night-950 p-8 text-white">
              <Eyebrow tone="dark">Le livre</Eyebrow>
              <p className="font-display mt-3 text-3xl">
                La Dernière <em className="text-gold-400">Génération</em>
              </p>
              <Button href={site.bookShop} external className="mt-6">
                Se procurer le livre
              </Button>
            </aside>
          </div>
          <div className="mt-20">
            <Eyebrow>En images</Eyebrow>
            <DisplayTitle className="mt-3" lead="Retour sur" accent="ESCHATOS." size="md" />
            <Lead className="mt-3">Revivez les temps forts de la conférence.</Lead>
            <div className="mt-10">
              <Gallery photos={photos} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
