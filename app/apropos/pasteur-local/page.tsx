import type { Metadata } from "next";
import Image from "next/image";
import { Button, PageHero } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Le Pasteur local",
  description:
    "Pasteur Diez Mendez Kambault, pasteur de l'AFVN Nantes : formation de disciples, mentorat et accompagnement spirituel.",
};

const focus = [
  { title: "Formation des disciples", text: "Enseigner la Parole pour faire grandir des croyants matures et enracinés." },
  { title: "Mentorat transformationnel", text: "Accompagner chacun dans son appel et sa croissance personnelle." },
  { title: "Accompagnement spirituel", text: "Marcher avec les familles et les personnes dans chaque saison de leur vie." },
];

export default function PasteurLocalPage() {
  return (
    <>
      <PageHero eyebrow="Le pasteur local" title="Pasteur Diez Mendez Kambault" />

      <section className="px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-6xl items-start gap-14 md:grid-cols-[360px_1fr]">
          <Image
            src="/pasteur-diez.jpg"
            alt="Pasteur Diez Mendez Kambault"
            width={720}
            height={720}
            sizes="360px"
            priority
            className="mx-auto w-72 rounded-full shadow-2xl shadow-navy-950/30 md:w-full"
          />
          <div>
            <p className="text-xl leading-9 text-ink/80">
              Marié et père d&apos;une fille, le Pasteur Diez Mendez Kambault prêche l&apos;Évangile depuis 2013. Son
              ministère est basé sur la formation des disciples, le mentorat transformationnel et l&apos;accompagnement
              spirituel.
            </p>
            <ul className="mt-10 grid gap-4 sm:grid-cols-3">
              {focus.map((f) => (
                <li key={f.title} className="rounded-2xl border border-navy-900/10 bg-white p-5">
                  <p className="font-display text-lg font-semibold text-navy-900">{f.title}</p>
                  <p className="mt-2 text-sm leading-6 text-ink/70">{f.text}</p>
                </li>
              ))}
            </ul>

            <div className="mt-12 rounded-3xl bg-navy-900 p-8 text-white">
              <p className="eyebrow text-gold-400">Livre</p>
              <p className="font-display mt-2 text-2xl font-semibold">« La Dernière Génération »</p>
              <p className="mt-3 text-white/75">
                Le premier ouvrage du Pasteur Diez Mendez Kambault, présenté lors de la conférence ESCHATOS.
              </p>
              <Button href={site.bookShop} external className="mt-6">
                Se procurer le livre
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
