import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Image from "next/image";
import { MapEmbed } from "@/components/map-embed";
import { CesaSection } from "@/components/sections";
import { Button, DisplayTitle, Eyebrow, Lead, PageHero } from "@/components/ui";
import { faq, formatTime, schedule, site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Première visite : je suis nouveau · AFVN Nantes",
  description: "Première visite à l'AFVN Nantes ? Horaires, adresse, déroulement du culte et formulaire d'accueil pour faire connaissance avec l'équipe.",
  path: "/nous-rejoindre",
});

const expect = [
  { t: "Un accueil personnel", d: "L'équipe CESA vous reçoit, vous présente l'église et répond à vos questions." },
  { t: "Un culte vivant", d: "Louange, prière et prédication de la Parole : la célébration du dimanche dure environ deux heures." },
  { t: "Une famille", d: "Après le culte, prenez le temps de faire connaissance : vous êtes ici chez vous." },
];

export default function NousRejoindrePage() {
  return (
    <>
      <PageHero
        eyebrow="Venez comme vous êtes"
        lead="Bienvenue"
        accent="à la Maison."
        intro="Vous êtes nouveau, de passage, ou vous souhaitez faire partie de notre communauté ? Nous serions heureux de vous accueillir et de marcher avec vous."
        image="/eglise/IMG_2766.jpg"
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href={site.welcomeForm} external>
            Remplir le formulaire d&apos;accueil (2 min)
          </Button>
          <Button href={site.mapsUrl} external variant="ghost-dark">
            Itinéraire
          </Button>
        </div>
      </PageHero>

      <section className="px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2">
          <div>
            <Eyebrow>Votre première visite</Eyebrow>
            <DisplayTitle className="mt-4" lead="À quoi" accent="vous attendre ?" />
            <ol className="mt-10 space-y-8">
              {expect.map((e, i) => (
                <li key={e.t} className="flex gap-5">
                  <span className="font-display text-4xl text-gold-700">0{i + 1}</span>
                  <span>
                    <span className="font-display block text-2xl font-semibold">{e.t}</span>
                    <span className="mt-1 block text-muted">{e.d}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="bg-night-950 p-8 text-white md:p-10">
            <p className="eyebrow text-gold-400">Infos pratiques</p>
            <dl className="mt-6 space-y-6">
              {schedule.map((s) => (
                <div key={s.day}>
                  <dt className="text-sm text-white/55">{s.day}</dt>
                  <dd className="font-display text-2xl">
                    {s.title} · {formatTime(s.start)}
                  </dd>
                </div>
              ))}
              <div>
                <dt className="text-sm text-white/55">Adresse</dt>
                <dd className="font-display text-2xl">
                  {site.address.street}, {site.address.postalCode} {site.address.city}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-white/55">Téléphone</dt>
                <dd className="font-display text-2xl">
                  <a href={site.phone.href} className="hover:text-gold-300">
                    {site.phone.display}
                  </a>
                </dd>
              </div>
            </dl>
            <div className="mt-8 overflow-hidden rounded-xl">
              <MapEmbed />
            </div>
          </div>
        </div>
      </section>

      <CesaSection primary />

      <section className="bg-white px-5 py-20 md:px-8">
        <div className="mx-auto max-w-6xl">
          <Image
            src="/medias/banniere-afvn.jpg"
            alt="Bienvenue à la Maison ! L'AFVN, une église bienveillante, porteuse de vie."
            width={2400}
            height={600}
            sizes="(min-width: 1152px) 1152px, 100vw"
            className="w-full"
          />
          <Lead className="mx-auto mt-10 max-w-2xl text-center">{faq[2].a}</Lead>
        </div>
      </section>

    </>
  );
}
