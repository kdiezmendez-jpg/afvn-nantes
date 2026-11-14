import type { Metadata } from "next";
import { Button, Gallery, PageHero } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/medias/eschatos" },
  title: "ESCHATOS 2026 — Conférence d'eschatologie",
  description:
    "ESCHATOS, la conférence annuelle des AFVN sur les temps de la fin. Édition 2026 : la bataille de Gog et Magog sur les Montagnes d'Israël.",
};

const photos = [1, 2, 3, 4, 5, 6].map((n) => `/medias/eschatos/photo-${n}.jpg`);

export default function EschatosPage() {
  return (
    <>
      <PageHero
        eyebrow="Conférence annuelle d'eschatologie"
        title="ESCHATOS 2026"
        image="/medias/eschatos/photo-6.jpg"
        intro={
          <>
            <p className="font-display text-2xl text-gold-300">
              La bataille de Gog et Magog sur les Montagnes d&apos;Israël
            </p>
          </>
        }
      />
      <section className="px-5 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-6 text-lg leading-8 text-ink/75">
              <p>
                ESCHATOS est la conférence annuelle des Assemblées Fleuve de Vie pour les Nations consacrée à
                l&apos;étude des temps de la fin, des prophéties bibliques et des événements annonçant le retour glorieux
                de notre Seigneur Jésus-Christ.
              </p>
              <p>
                Cette édition a également marqué la présentation officielle du premier ouvrage du Pasteur Diez Mendez
                Kambault : <strong className="text-navy-900">« La Dernière Génération »</strong>.
              </p>
            </div>
            <aside className="rounded-3xl bg-navy-900 p-8 text-white">
              <p className="eyebrow text-gold-400">Le livre</p>
              <p className="font-display mt-2 text-2xl font-semibold">La Dernière Génération</p>
              <Button href={site.bookShop} external className="mt-6">
                Se procurer le livre
              </Button>
            </aside>
          </div>
          <h2 className="font-display mt-16 mb-8 text-3xl font-semibold text-navy-900">En images</h2>
          <Gallery photos={photos} alt="ESCHATOS 2026" />
        </div>
      </section>
    </>
  );
}
