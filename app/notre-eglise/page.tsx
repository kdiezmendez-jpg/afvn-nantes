import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Image from "next/image";
import { DnaSection, FinalCta, MinistriesSection } from "@/components/sections";
import { Button, DisplayTitle, Eyebrow, Gallery, Lead, PageHero } from "@/components/ui";
import { gallery, pastorQuote, site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Notre église : histoire, vision et équipe · AFVN Nantes",
  description: "Les Assemblées Fleuve de Vie pour les Nations à Nantes : une vision née en 1988, le Pasteur Diez Mendez Kambault, nos ministères et notre vie d'église.",
  path: "/notre-eglise",
});

const timeline = [
  { when: "1988", what: "La vision naît dans le cœur de l'Apôtre Pamphile Jean Sylvain MAYINGUIDI." },
  { when: "République du Congo", what: "Premières assemblées et développement de la vision." },
  { when: "RD Congo", what: "La vision se déploie en République Démocratique du Congo." },
  { when: "France", what: "Implantation d'églises de proximité, dont l'église de Nantes." },
];

export default function NotreEglisePage() {
  return (
    <>
      <PageHero
        eyebrow="Notre église"
        lead="Une vision née pour"
        accent="répandre la vie de Dieu."
        intro="Une vision apostolique portée par la Parole, l'Esprit et la Croix, afin de former des porteurs de vie pour les nations."
        image="/eglise/photo-1.jpg"
      >
        <div className="mt-8">
          <Button href="/nous-rejoindre">Préparer ma première visite</Button>
        </div>
      </PageHero>

      {/* Histoire & visionnaires */}
      <section id="histoire" className="px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <figure>
            <Image
              src="/visionnaires-buste.jpg"
              alt="Apôtre Pamphile Jean Sylvain MAYINGUIDI et Ancienne Octavie Estelle MAYINGUIDI"
              width={720}
              height={560}
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="w-full"
            />
            <figcaption className="bg-night-950 p-7 text-white">
              <p className="font-display text-xl font-semibold text-gold-300">Apôtre Pamphile Jean Sylvain MAYINGUIDI</p>
              <p className="mt-1 text-sm text-white/65">Visionnaire des Assemblées Fleuve de Vie pour les Nations</p>
              <div className="my-5 h-px bg-white/10" />
              <p className="font-display text-lg font-semibold text-gold-300">Ancienne Octavie Estelle MAYINGUIDI</p>
              <p className="mt-1 text-sm text-white/65">Son épouse</p>
            </figcaption>
          </figure>
          <div>
            <Eyebrow>Historique & vision</Eyebrow>
            <DisplayTitle className="mt-4" lead="Le fleuve," accent="l'Évangile en mouvement." />
            <div className="mt-8 space-y-6 text-lg leading-8 text-muted">
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
            <ul className="mt-10 grid gap-px bg-ink/10 sm:grid-cols-3">
              {[
                ["La Parole", "La révélation vivante de Dieu, reçue, confessée et transmise."],
                ["L'Esprit", "La puissance de Dieu qui conduit, transforme et équipe."],
                ["La Croix", "Le fondement de la mort à soi et de la vie nouvelle en Christ."],
              ].map(([t, d]) => (
                <li key={t} className="bg-cream p-5">
                  <p className="font-display text-lg font-semibold">{t}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">{d}</p>
                </li>
              ))}
            </ul>
            <ol className="mt-12 border-l border-gold-500/50">
              {timeline.map((t) => (
                <li key={t.when} className="relative pb-7 pl-8 last:pb-0">
                  <span className="absolute -left-[5px] top-1.5 size-2.5 rounded-full bg-gold-400" aria-hidden />
                  <p className="eyebrow text-gold-700">{t.when}</p>
                  <p className="mt-1 text-muted">{t.what}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Pasteur local */}
      <section id="equipe" className="bg-night-950 px-5 py-20 text-white md:px-8 md:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-[340px_1fr]">
          <Image
            src="/pasteur-diez.jpg"
            alt="Pasteur Diez Mendez Kambault"
            width={680}
            height={680}
            sizes="340px"
            className="mx-auto w-64 rounded-full md:w-full"
          />
          <div>
            <Eyebrow tone="dark">Le pasteur local</Eyebrow>
            <DisplayTitle className="mt-4" tone="dark" lead="Pasteur Diez" accent="Mendez Kambault" />
            <blockquote className="font-display mt-6 border-l-2 border-gold-400 pl-5 text-xl leading-snug text-white/90">
              « {pastorQuote} »
            </blockquote>
            <Lead tone="dark" className="mt-6">
              Marié et père d&apos;une fille, il prêche l&apos;Évangile depuis 2013. Son ministère est basé sur la
              formation des disciples, le mentorat transformationnel et l&apos;accompagnement spirituel. Il est
              l&apos;auteur de « La Dernière Génération ».
            </Lead>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href={site.bookShop} external variant="ghost-dark">
                Se procurer le livre
              </Button>
              <Button href={site.phone.href} variant="ghost-dark">
                Contacter le pasteur
              </Button>
            </div>
          </div>
        </div>
      </section>

      <DnaSection />

      <MinistriesSection />

      {/* Galerie */}
      <section id="galerie" className="px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <Eyebrow>Vie de l&apos;église</Eyebrow>
          <DisplayTitle className="mt-4" lead="Nos cultes, notre famille," accent="notre atmosphère." />
          <div className="mt-12">
            <Gallery photos={gallery} />
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
