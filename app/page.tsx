import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { Icon, type IconName } from "@/components/icons";
import { Countdown, NextServicePill } from "@/components/live-schedule";
import { CesaSection, DnaSection, FinalCta, LiveSection, PhotoStrip, PrayerSection, WeekSection } from "@/components/sections";
import { Marquee } from "@/components/site-footer";
import { ArrowLink, Button, DisplayTitle, Eyebrow, Lead } from "@/components/ui";
import { announcement, faq, gallery, pastorQuote, site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "AFVN Nantes — Église évangélique à Nantes",
  description: "Église évangélique à Nantes : culte le dimanche à 9h30, enseignement et prière le vendredi à 19h. Une famille où la Parole et l'Esprit s'accordent.",
  path: "/",
});

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const quick: { t: string; d: string; href: string; icon: IconName; external?: boolean }[] = [
  { t: "Suivre le direct", d: "Dimanche · 9h30", href: site.liveUrl, icon: "play", external: true },
  { t: "Demande de prière", d: "Confidentielle", href: "/priere", icon: "spark" },
  { t: "Je suis nouveau", d: "Accueil CESA", href: "/nous-rejoindre", icon: "target" },
  { t: "Itinéraire", d: "Ouvrir la carte", href: site.mapsUrl, icon: "pin", external: true },
];

function Orbit() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[19rem] sm:max-w-[34rem]" aria-hidden>
      <div className="absolute inset-0 rounded-full border border-white/[0.08]" />
      <div className="absolute inset-[14%] rounded-full border border-white/[0.08]" />
      <div className="absolute inset-[30%] rounded-full bg-[radial-gradient(circle_at_40%_35%,#1d5c6b,#061c2b_70%)] shadow-[0_0_120px_rgb(79_209_197/0.18)] ring-1 ring-white/10" />
      <div className="absolute inset-0 animate-orbit">
        <span className="absolute left-1/2 top-0 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-400 shadow-[0_0_20px_#4fd1c5]" />
      </div>
      <div className="absolute inset-[14%] animate-orbit [animation-direction:reverse] [animation-duration:36s]">
        <span className="absolute bottom-0 left-1/2 size-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-gold-400" />
      </div>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="eyebrow !text-[0.7rem] text-white/50">AFVN Nantes</p>
          <p className="font-display text-6xl font-semibold text-white md:text-7xl">VIE</p>
          <p className="text-gold-400">✦</p>
        </div>
      </div>
      <span className="eyebrow absolute left-[22%] top-[6%] text-white/50">Parole</span>
      <span className="eyebrow absolute right-0 top-[44%] text-gold-400">Esprit</span>
      <span className="eyebrow absolute bottom-[8%] left-[10%] text-white/35">Nations</span>
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* ───────── Hero ───────── */}
      <section className="grid-lines relative isolate overflow-hidden bg-night-950 pt-28 text-white md:pt-32">
        <div className="absolute -left-40 top-20 -z-10 size-[40rem] rounded-full bg-teal-700/25 blur-3xl" aria-hidden />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-10 md:px-8 lg:grid-cols-[1.1fr_1fr] lg:pb-0">
          <div className="py-8 lg:py-20">
            <p className="flex items-center gap-4 text-xs font-semibold text-white/60">
              <span className="text-gold-400">01</span>
              <span className="h-3 w-px bg-white/25" />
              <span className="eyebrow">Église évangélique · Nantes</span>
            </p>
            <h1 className="font-display mt-8 text-6xl font-semibold leading-[0.98] sm:text-7xl md:text-8xl">
              La Parole.
              <br />
              <em className="font-medium italic text-gold-400">L&apos;Esprit.</em>
              <br />
              La Vie.
            </h1>
            <p className="mt-8 max-w-md text-lg leading-8 text-white/80">
              Une église où la Parole et l&apos;Esprit s&apos;accordent pour engendrer <strong className="text-white">les porteurs de vie.</strong>
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Button href="/nous-rejoindre">Préparer ma première visite</Button>
              <Link href="/notre-eglise" className="inline-flex min-h-11 items-center text-sm font-semibold underline decoration-gold-400 underline-offset-4 hover:text-gold-300">
                Notre vision
              </Link>
              <Link href="/predications" className="group inline-flex items-center gap-3 text-sm font-semibold">
                <span className="grid size-12 place-items-center rounded-full border border-white/30 transition group-hover:border-gold-400 group-hover:text-gold-300">
                  <Icon name="play" className="ml-0.5 size-4" />
                </span>
                Dernier message
              </Link>
            </div>
          </div>
          <div className="relative pb-6 lg:pb-24">
            <Orbit />
            <figure className="relative z-10 -mt-10 max-w-xs border-l-4 border-gold-400 bg-cream p-6 text-ink shadow-2xl sm:absolute sm:bottom-0 sm:left-0 sm:mt-0 lg:-left-16">
              <p className="eyebrow !text-[0.7rem] text-gold-700">Jean 10:10</p>
              <blockquote className="font-display mt-2 text-lg leading-snug">
                « Je suis venu afin que les brebis aient la vie, et qu&apos;elles soient dans l&apos;abondance. »
              </blockquote>
            </figure>
            <NextServicePill className="mt-6 sm:absolute sm:bottom-6 sm:right-0 sm:mt-0" />
          </div>
        </div>
      </section>

      {/* ───────── Annonce à la une ───────── */}
      {announcement ? (
        <div className="bg-cream px-5 pt-10 md:px-8">
          <Link
            href={announcement.href}
            className="mx-auto flex max-w-7xl flex-col gap-3 bg-gold-400 px-7 py-5 text-night-950 transition hover:bg-gold-300 md:flex-row md:items-center md:justify-between"
          >
            <span>
              <span className="eyebrow block !text-[0.7rem]">Annonce à la une</span>
              <span className="font-display text-xl font-semibold">{announcement.title}</span>
            </span>
            <span className="text-sm md:max-w-md">{announcement.text}</span>
            <span className="text-sm font-semibold underline underline-offset-4">{announcement.cta} →</span>
          </Link>
        </div>
      ) : null}

      {/* ───────── Nous vous attendons ───────── */}
      <section className="px-5 py-14 md:px-8 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[1.7fr_1fr]">
          <div className="relative overflow-hidden bg-night-950 p-8 text-white md:p-12">
            <div className="absolute -right-24 -top-24 size-80 rounded-full border-[40px] border-white/[0.03]" aria-hidden />
            <div className="relative grid items-center gap-8 md:grid-cols-[1fr_1.2fr]">
              <div>
                <h2 className="font-display text-4xl font-semibold leading-tight">Nous vous attendons.</h2>
                <p className="mt-3 text-sm text-white/65">
                  {site.address.street}, {site.address.postalCode} {site.address.city}
                </p>
              </div>
              <Countdown />
            </div>
          </div>
          <Link href="/nous-rejoindre" className="group relative isolate flex min-h-64 flex-col justify-end overflow-hidden bg-night-900 p-7 text-white">
            <Image src="/eglise/IMG_2766.jpg" alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" className="-z-20 object-cover opacity-60 transition duration-700 group-hover:scale-105" />
            <span className="absolute inset-0 -z-10 bg-gradient-to-t from-night-950 via-night-950/40 to-transparent" />
            <span className="eyebrow absolute left-5 top-5 bg-night-950/80 px-3 py-1.5 !text-[0.7rem]">Bienvenue</span>
            <span className="eyebrow !text-[0.7rem] text-gold-400">AFVN Nantes</span>
            <span className="font-display mt-1 text-2xl font-semibold">Bienvenue dans la famille</span>
            <span className="mt-1 text-sm text-white/70">Ce qui vous attend lors de votre première visite →</span>
          </Link>
        </div>
        <ul className="mx-auto mt-4 grid max-w-7xl grid-cols-2 border border-ink/10 bg-white md:grid-cols-4 md:divide-x md:divide-ink/10">
          {quick.map((q) => (
            <li key={q.t} className="border-ink/10 max-md:border-b max-md:odd:border-r">
              <a
                href={q.href}
                {...(q.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="block h-full p-6 transition hover:bg-cream"
              >
                <Icon name={q.icon} className="size-5 text-gold-600" />
                <span className="mt-4 block font-semibold">{q.t}</span>
                <span className="text-xs text-muted">{q.d}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <Marquee />

      <DnaSection />

      {/* ───────── Un fleuve de vie au cœur de Nantes ───────── */}
      <section className="bg-white px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[auto_1.4fr_1fr]">
          <p className="font-display hidden border-r border-ink/10 pr-10 text-7xl leading-[0.85] lg:block" aria-hidden>
            <span className="block text-ink/15 before:content-['20']" />
            <span className="block text-gold-400 before:content-['26']" />
          </p>
          <div>
            <Eyebrow>Notre église</Eyebrow>
            <DisplayTitle className="mt-4" lead="Un fleuve de vie" accent="au cœur de Nantes." />
            <Lead className="mt-6">
              Les Assemblées Fleuve de Vie pour les Nations sont une famille spirituelle où la Parole et l&apos;Esprit
              s&apos;accordent. Notre mission : restaurer, équiper et envoyer des femmes et des hommes qui portent la vie de
              Christ.
            </Lead>
            <ul className="mt-8 flex flex-wrap gap-2">
              {["Jésus au centre", "Une foi vivante", "Les nations en vue"].map((c) => (
                <li key={c} className="rounded-full border border-ink/20 px-4 py-2 text-xs font-semibold">
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <figure className="relative overflow-hidden bg-night-950 p-10 text-white">
            <span className="font-display absolute -right-4 -top-6 text-8xl text-white/[0.04] before:content-['AFVN']" aria-hidden />
            <p className="eyebrow !text-[0.7rem] text-gold-400">Le mot du pasteur</p>
            <blockquote className="font-display mt-5 text-2xl leading-snug">« {pastorQuote} »</blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <Image src="/pasteur-diez.jpg" alt="" width={96} height={96} className="size-12 rounded-full object-cover" />
              <span className="text-sm">
                <span className="block font-semibold">Pasteur Diez Mendez Kambault</span>
                <span className="text-white/60">Pasteur local</span>
              </span>
            </figcaption>
            <div className="mt-6">
              <ArrowLink href="/notre-eglise#equipe" tone="dark">
                Découvrir notre équipe
              </ArrowLink>
            </div>
          </figure>
        </div>
        <div className="mx-auto mt-16 max-w-7xl pb-10">
          <PhotoStrip photos={gallery} />
        </div>
      </section>

      <WeekSection />

      <LiveSection />

      <CesaSection />

      <PrayerSection />

      {/* ───────── FAQ ───────── */}
      <section id="faq" className="bg-white px-5 py-20 md:px-8 md:py-28">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }} />
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <Eyebrow>Questions fréquentes</Eyebrow>
            <DisplayTitle className="mt-4" lead="Tout savoir" accent="avant de venir." />
            <Lead className="mt-6">Une autre question ? Appelez-nous, nous répondons avec plaisir.</Lead>
          </div>
          <div className="divide-y divide-ink/10 border-y border-ink/10">
            {faq.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="font-display flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full border border-ink/15 text-gold-700 transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl leading-7 text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
