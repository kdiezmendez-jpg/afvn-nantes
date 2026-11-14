import type { Metadata } from "next";
import Image from "next/image";
import { Button, PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Les AFVN — Historique & vision",
  alternates: { canonical: "/apropos/les-afvn" },
  description:
    "Les Assemblées Fleuve de Vie pour les Nations : une vision apostolique née en 1988, portée par la Parole, l'Esprit et la Croix.",
};

const pillars = [
  { title: "La Parole", text: "La révélation vivante de Dieu, reçue, confessée et transmise." },
  { title: "L'Esprit", text: "La puissance de Dieu qui conduit, transforme et équipe." },
  { title: "La Croix", text: "Le fondement de la mort à soi et de la vie nouvelle en Christ." },
];

const timeline = [
  { when: "1988", what: "La vision naît dans le cœur de l'Apôtre Pamphile Jean Sylvain MAYINGUIDI." },
  { when: "République du Congo", what: "Premières assemblées et développement de la vision." },
  { when: "RD Congo", what: "La vision se déploie en République Démocratique du Congo." },
  { when: "France", what: "Implantation d'églises de proximité, dont l'église de Nantes." },
];

export default function LesAfvnPage() {
  return (
    <>
      <PageHero
        eyebrow="Les AFVN"
        title="Assemblées Fleuve de Vie pour les Nations"
        intro="Une vision apostolique portée par la Parole, l'Esprit et la Croix, afin de former des porteurs de vie pour les nations."
      />

      <section className="px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <figure>
            <Image
              src="/visionnaires-buste.jpg"
              alt="Apôtre Pamphile Jean Sylvain MAYINGUIDI et Ancienne Octavie Estelle MAYINGUIDI"
              width={720}
              height={560}
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="rounded-3xl shadow-2xl shadow-navy-950/15"
            />
            <figcaption className="mt-6 rounded-3xl bg-navy-900 p-7 text-white">
              <p className="font-display text-xl font-semibold text-gold-300">Apôtre Pamphile Jean Sylvain MAYINGUIDI</p>
              <p className="mt-1 text-sm text-white/70">Visionnaire des Assemblées Fleuve de Vie pour les Nations</p>
              <div className="my-5 h-px bg-white/10" />
              <p className="font-display text-lg font-semibold text-gold-300">Ancienne Octavie Estelle MAYINGUIDI</p>
              <p className="mt-1 text-sm text-white/70">Son épouse</p>
            </figcaption>
          </figure>

          <div>
            <p className="eyebrow text-gold-700">Historique & vision</p>
            <h2 className="font-display mt-3 text-3xl font-semibold leading-tight text-navy-900 md:text-5xl">
              Une vision née pour répandre la vie de Dieu.
            </h2>
            <div className="mt-8 space-y-6 text-lg leading-8 text-ink/75">
              <p>
                Née dans le cœur de son leader, l&apos;Apôtre Pamphile Jean Sylvain MAYINGUIDI, depuis la fin de
                l&apos;année 1988, la vision des Assemblées Fleuve de Vie pour les Nations a commencé à se développer en
                République du Congo avant de se déployer en République Démocratique du Congo, puis en France.
              </p>
              <p>
                Les AFVN portent une vision centrée sur la communication de la vie de Dieu à travers la prédication de
                l&apos;Évangile. Cette vie est transmise par des hommes et des femmes enseignés, transformés et appelés à
                devenir de véritables porteurs de vie.
              </p>
            </div>

            <ul className="mt-10 grid gap-4 sm:grid-cols-3">
              {pillars.map((p) => (
                <li key={p.title} className="rounded-2xl border border-navy-900/10 bg-white p-5">
                  <p className="font-display text-lg font-semibold text-navy-900">{p.title}</p>
                  <p className="mt-2 text-sm leading-6 text-ink/70">{p.text}</p>
                </li>
              ))}
            </ul>

            <ol className="mt-12 border-l border-gold-500/40">
              {timeline.map((t) => (
                <li key={t.when} className="relative pb-8 pl-8 last:pb-0">
                  <span className="absolute -left-[5px] top-2 size-2.5 rounded-full bg-gold-500" aria-hidden />
                  <p className="eyebrow text-gold-700">{t.when}</p>
                  <p className="mt-1 text-ink/75">{t.what}</p>
                </li>
              ))}
            </ol>

            <p className="mt-10 text-lg leading-8 text-ink/75">
              Le symbole du fleuve exprime l&apos;Évangile en mouvement : une vie qui coule, se répand et atteint les
              nations par l&apos;implantation d&apos;églises de proximité et par la formation de disciples capables
              d&apos;impacter leur génération.
            </p>
            <div className="mt-8">
              <Button href="/nous-rejoindre">Nous rejoindre</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
