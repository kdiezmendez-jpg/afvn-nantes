import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { NextService } from "@/components/next-service";
import { SocialLinks } from "@/components/social-links";
import { Button, SectionHeading } from "@/components/ui";
import { YouTubeLite } from "@/components/youtube-lite";
import { events, faq, featuredVideos, formatTime, schedule, site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const firstVisit = [
  {
    title: "Un accueil personnel",
    text: "Une équipe d'accueil vous reçoit à l'entrée, vous présente l'église et répond à vos questions.",
  },
  {
    title: "Un culte vivant",
    text: "Louange, prière et prédication de la Parole : la célébration du dimanche dure environ deux heures.",
  },
  {
    title: "Faire connaissance",
    text: "Remplissez notre formulaire d'accueil : nous serons heureux de vous recontacter et de marcher avec vous.",
  },
];

const mosaic = [
  { src: "/eglise/photo-4.jpg", alt: "Moment de partage fraternel après le culte" },
  { src: "/eglise/IMG_0282.jpg", alt: "Une fidèle attentive pendant la prédication" },
  { src: "/eglise/photo-5.jpg", alt: "Temps d'adoration pendant le culte" },
  { src: "/eglise/photo-2.jpg", alt: "Une fidèle en prière" },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function Home() {
  return (
    <>
      {/* ——— Hero ——— */}
      <section className="relative isolate flex min-h-[88svh] items-end overflow-hidden bg-navy-950 pb-20 pt-32 text-white md:items-center md:pb-28">
        <Image
          src="/eglise/photo-1.jpg"
          alt="Baptême par immersion à l'AFVN Nantes"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-[60%_center] opacity-70"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950 via-navy-950/60 to-navy-950/40 md:bg-gradient-to-r md:from-navy-950 md:via-navy-950/70 md:to-transparent" />
        <div className="mx-auto w-full max-w-7xl px-5 md:px-8">
          <NextService />
          <h1 className="font-display mt-6 max-w-3xl text-5xl font-semibold leading-[1.02] text-balance md:text-7xl">
            Une Église où coule <em className="text-gold-300">la vie de Dieu</em>.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/85 text-pretty">
            Église évangélique à Nantes, nous sommes une famille où la Parole et l&apos;Esprit s&apos;accordent pour
            engendrer des porteurs de vie. Vous êtes le bienvenu, tel que vous êtes.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href="#visite">Préparer ma visite</Button>
            <Button href="#enseignements" variant="outline">
              Voir les prédications
            </Button>
          </div>
        </div>
      </section>

      {/* ——— Horaires ——— */}
      <section id="horaires" aria-labelledby="horaires-titre" className="relative z-10 -mt-10 px-5 md:px-8">
        <h2 id="horaires-titre" className="sr-only">
          Horaires des cultes
        </h2>
        <div className="mx-auto grid max-w-6xl gap-px overflow-hidden rounded-3xl bg-navy-900/10 shadow-2xl shadow-navy-950/15 md:grid-cols-3">
          {schedule.map((s) => (
            <div key={s.day} className="bg-white p-7 md:p-8">
              <p className="eyebrow text-gold-700">{s.day}</p>
              <p className="font-display mt-2 text-2xl font-semibold text-navy-900">{s.title}</p>
              <p className="mt-1 text-lg tabular-nums text-ink/70">
                {formatTime(s.start)} – {formatTime(s.end)}
              </p>
            </div>
          ))}
          <div className="flex flex-col justify-between gap-4 bg-navy-900 p-7 text-white md:p-8">
            <div>
              <p className="eyebrow text-gold-400">Adresse</p>
              <p className="mt-2 text-lg leading-7">
                {site.address.street}
                <br />
                {site.address.postalCode} {site.address.city}
              </p>
            </div>
            <a
              href={site.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-gold-300 underline-offset-4 hover:underline"
            >
              Calculer l&apos;itinéraire →
            </a>
          </div>
        </div>
      </section>

      {/* ——— Première visite ——— */}
      <section id="visite" className="px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Première visite"
            title="Vous venez pour la première fois ?"
            intro="Pas besoin de s'inscrire : nos cultes sont ouverts à tous. Voici à quoi vous attendre."
            align="center"
          />
          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            {firstVisit.map((step, i) => (
              <li key={step.title} className="rounded-3xl bg-white p-6 shadow-sm shadow-navy-950/5 md:p-8">
                <span className="font-display text-4xl text-gold-500 tabular-nums">0{i + 1}</span>
                <h3 className="font-display mt-4 text-xl font-semibold text-navy-900">{step.title}</h3>
                <p className="mt-3 leading-7 text-ink/70">{step.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href={site.welcomeForm} external>
              Remplir le formulaire d&apos;accueil
            </Button>
            <Button href={site.phone.href} variant="outline-dark">
              Nous appeler
            </Button>
          </div>
        </div>
      </section>

      {/* ——— Enseignements ——— */}
      <section id="enseignements" className="bg-navy-950 px-5 py-20 text-white md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              tone="dark"
              eyebrow="Prédications & louange"
              title="Nourrissez votre foi, où que vous soyez."
              intro="Messages, enseignements bibliques et temps d'adoration sur notre chaîne YouTube."
            />
            <Button href={site.socials.youtube} external className="shrink-0">
              S&apos;abonner à la chaîne
            </Button>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {featuredVideos.map((v) => (
              <YouTubeLite key={v.id} id={v.id} title={v.title} />
            ))}
          </div>
        </div>
      </section>

      {/* ——— Notre église : vision + vie ——— */}
      <section className="px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Notre église"
              title="Former des porteurs de vie pour les nations."
              intro="Le fleuve exprime l'Évangile en mouvement : une vie qui coule, se répand et transforme. Adoration, enseignement, prière et communion fraternelle font battre le cœur de notre famille."
            />
            <ul className="mt-8 flex flex-wrap gap-2">
              {["La Parole", "L'Esprit", "La Croix"].map((p) => (
                <li key={p} className="rounded-full border border-gold-600/30 bg-white px-4 py-1.5 text-sm font-medium text-navy-900">
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/apropos/les-afvn" variant="navy">
                Notre histoire & vision
              </Button>
              <Button href="/apropos/vie-eglise-locale" variant="outline-dark">
                Voir la galerie
              </Button>
            </div>
          </div>
          <ul className="grid grid-cols-2 gap-4">
            {mosaic.map((m, i) => (
              <li key={m.src} className={`relative aspect-[4/5] overflow-hidden rounded-2xl ${i % 2 ? "translate-y-8" : ""}`}>
                <Image src={m.src} alt={m.alt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ——— Événements ——— */}
      <section id="evenements" className="bg-white px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Temps forts" title="Vivre l'église au-delà du dimanche" />
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {events.map((e) => (
              <li key={e.href}>
                <Link
                  href={e.href}
                  className="group relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-3xl p-6 text-white"
                >
                  <Image
                    src={e.image}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="-z-20 object-cover transition duration-700 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950 via-navy-950/50 to-transparent" />
                  <span className="eyebrow text-gold-300">{e.kicker}</span>
                  <span className="font-display mt-2 text-2xl font-semibold">{e.title}</span>
                  <span className="mt-2 text-sm leading-6 text-white/80">{e.description}</span>
                  <span className="mt-4 text-sm font-semibold text-gold-300">Découvrir →</span>
                </Link>
              </li>
            ))}
            <li>
              <figure className="flex h-full flex-col overflow-hidden rounded-3xl bg-ivory">
                <Image
                  src="/theme-2026.jpg"
                  alt="Thème 2026 : Gabaon, posséder les sommets des montagnes — Deutéronome 11:24"
                  width={1672}
                  height={941}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="w-full"
                />
                <figcaption className="flex flex-1 flex-col justify-center p-6">
                  <span className="eyebrow text-gold-700">Thème de l&apos;année</span>
                  <span className="font-display mt-2 text-2xl font-semibold text-navy-900">2026 · Gabaon</span>
                  <span className="mt-2 text-sm leading-6 text-ink/70">
                    « L&apos;Éternel, ton Dieu, sera avec toi. » — Deutéronome 11:24
                  </span>
                </figcaption>
              </figure>
            </li>
          </ul>
        </div>
      </section>

      {/* ——— Pasteur ——— */}
      <section className="px-5 py-20 md:px-8 md:py-24">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 rounded-[2rem] bg-navy-900 p-8 text-white md:flex-row md:p-12">
          <Image
            src="/pasteur-diez.jpg"
            alt="Pasteur Diez Mendez Kambault"
            width={480}
            height={480}
            sizes="224px"
            className="size-48 shrink-0 rounded-full object-cover md:size-56"
          />
          <div>
            <p className="eyebrow text-gold-400">Le pasteur local</p>
            <h2 className="font-display mt-3 text-3xl font-semibold md:text-4xl">Pasteur Diez Mendez Kambault</h2>
            <p className="mt-4 leading-7 text-white/75">
              Il prêche l&apos;Évangile depuis 2013. Son ministère est centré sur la formation des disciples, le
              mentorat transformationnel et l&apos;accompagnement spirituel. Auteur de « La Dernière Génération ».
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button href="/apropos/pasteur-local" variant="outline">
                Le connaître
              </Button>
              <Button href={site.bookShop} external variant="outline">
                Découvrir son livre
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ——— FAQ ——— */}
      <section id="faq" className="bg-white px-5 py-20 md:px-8 md:py-28">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
        />
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeading
            eyebrow="Questions fréquentes"
            title="Tout ce qu'il faut savoir avant de venir."
            intro="Une autre question ? Appelez-nous, nous répondons avec plaisir."
          />
          <div className="divide-y divide-navy-900/10 border-y border-navy-900/10">
            {faq.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-lg font-semibold text-navy-900 [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span
                    aria-hidden
                    className="grid size-8 shrink-0 place-items-center rounded-full border border-navy-900/15 text-gold-700 transition group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl leading-7 text-ink/70">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Contact ——— */}
      <section id="contact" className="bg-navy-900 px-5 py-20 text-white md:px-8 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              tone="dark"
              eyebrow="Contact"
              title="Venez nous rendre visite."
              intro="Une question, un besoin de prière, l'envie de découvrir l'église ? Appelez-nous ou passez nous voir."
            />
            <dl className="mt-10 space-y-6">
              <div>
                <dt className="eyebrow text-gold-400">Adresse</dt>
                <dd className="mt-1 text-lg">
                  {site.address.street}, {site.address.postalCode} {site.address.city}
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-gold-400">Téléphone</dt>
                <dd className="mt-1 text-lg">
                  <a href={site.phone.href} className="hover:text-gold-300">
                    {site.phone.display}
                  </a>
                </dd>
              </div>
            </dl>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button href={site.phone.href}>Appeler</Button>
              <Button href={site.mapsUrl} external variant="outline">
                Itinéraire
              </Button>
            </div>
            <SocialLinks className="mt-8" />
          </div>
          <div className="min-h-80 overflow-hidden rounded-3xl bg-navy-800">
            <iframe
              src={site.mapsEmbed}
              title="Plan d'accès à l'AFVN Nantes"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="size-full min-h-80"
            />
          </div>
        </div>
      </section>
    </>
  );
}
