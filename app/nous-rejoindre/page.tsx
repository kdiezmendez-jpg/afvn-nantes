import type { Metadata } from "next";
import Image from "next/image";
import { Button, PageHero } from "@/components/ui";
import { formatTime, schedule, site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/nous-rejoindre" },
  title: "Nous rejoindre",
  description: "Nouveau à Nantes ou de passage ? Devenez membre de la famille AFVN Nantes : remplissez le formulaire d'accueil.",
};

export default function NousRejoindrePage() {
  return (
    <>
      <PageHero
        eyebrow="Bienvenue à la Maison"
        title="Devenez membre de notre famille spirituelle."
        intro="Vous êtes nouveau, de passage, ou vous souhaitez faire partie de notre communauté ? Nous serions heureux de vous accueillir, de vous accompagner et de marcher avec vous dans votre croissance spirituelle."
      >
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button href={site.welcomeForm} external>
            Remplir le formulaire d&apos;accueil
          </Button>
          <Button href={site.phone.href} variant="outline">
            Appeler l&apos;église
          </Button>
        </div>
      </PageHero>

      <section className="px-5 py-20 md:px-8">
        <div className="mx-auto max-w-6xl">
          <Image
            src="/medias/banniere-afvn.jpg"
            alt="Bienvenue à la Maison ! L'AFVN, une église bienveillante, porteuse de vie."
            width={2400}
            height={600}
            sizes="(min-width: 1152px) 1152px, 100vw"
            className="rounded-3xl shadow-xl shadow-navy-950/15"
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-white p-8">
              <p className="eyebrow text-gold-700">Étape 1</p>
              <p className="font-display mt-2 text-xl font-semibold text-navy-900">Remplissez le formulaire</p>
              <p className="mt-3 text-ink/70">
                Quelques informations pour que notre équipe puisse vous contacter. Le formulaire est hébergé par Google
                Forms.
              </p>
            </div>
            <div className="rounded-3xl bg-white p-8">
              <p className="eyebrow text-gold-700">Étape 2</p>
              <p className="font-display mt-2 text-xl font-semibold text-navy-900">Venez à un culte</p>
              <ul className="mt-3 space-y-1 text-ink/70">
                {schedule.map((s) => (
                  <li key={s.day}>
                    {s.day} · {formatTime(s.start)} – {formatTime(s.end)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-white p-8">
              <p className="eyebrow text-gold-700">Étape 3</p>
              <p className="font-display mt-2 text-xl font-semibold text-navy-900">Grandissez avec nous</p>
              <p className="mt-3 text-ink/70">
                Nous vous accompagnons dans votre intégration à l&apos;église et dans votre croissance spirituelle.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
