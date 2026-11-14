import Image from "next/image";
import Link from "next/link";
import { Button, SectionHeading } from "@/components/ui";
import { SocialLinks } from "@/components/social-links";
import { YouTubeLite } from "@/components/youtube-lite";
import { events, featuredVideos, formatTime, schedule, site } from "@/lib/site";

const pillars = [
  { title: "La Parole", text: "La révélation vivante de Dieu, reçue, confessée et transmise." },
  { title: "L'Esprit", text: "La puissance de Dieu qui conduit, transforme et équipe." },
  { title: "La Croix", text: "Le fondement de la mort à soi et de la vie nouvelle en Christ." },
];

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

const life = ["/eglise/photo-4.jpg", "/eglise/IMG_0282.jpg", "/eglise/photo-5.jpg", "/eglise/photo-2.jpg"];

export default function Home() {
  return (
    <>
      {/* ——— Hero ——— */}
      <section className="relative isolate flex min-h-[92svh] items-end overflow-hidden bg-navy-950 pb-16 pt-32 text-white md:items-center md:pb-24">
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
          <p className="eyebrow text-gold-300">Assemblées Fleuve de Vie pour les Nations</p>
          <h1 className="font-display mt-5 max-w-3xl text-5xl font-semibold leading-[1.02] text-balance md:text-7xl">
            Une Église où coule <em className="text-gold-300">la vie de Dieu</em>.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/85 text-pretty">
            À Nantes, nous sommes une famille où la Parole et l&apos;Esprit s&apos;accordent pour engendrer des
            porteurs de vie. Vous êtes le bienvenu, tel que vous êtes.
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
      <section aria-labelledby="horaires" className="relative z-10 -mt-10 px-5 md:px-8">
        <h2 id="horaires" className="sr-only">
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

      {/* ——— Vision ——— */}
      <section className="px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Notre vision"
              title="Former des porteurs de vie pour les nations."
              intro="Le fleuve exprime l'Évangile en mouvement : une vie qui coule, se répand et atteint les nations par des églises de proximité et des disciples capables d'impacter leur génération."
            />
            <ul className="mt-10 grid gap-4 sm:grid-cols-3">
              {pillars.map((p) => (
                <li key={p.title} className="rounded-2xl border border-navy-900/10 bg-white p-5">
                  <p className="font-display text-lg font-semibold text-navy-900">{p.title}</p>
                  <p className="mt-2 text-sm leading-6 text-ink/70">{p.text}</p>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button href="/apropos/les-afvn" variant="outline-dark">
                Découvrir les AFVN
              </Button>
            </div>
          </div>
          <figure className="relative">
            <Image
              src="/theme-2026.jpg"
              alt="Thème 2026 : Gabaon, posséder les sommets des montagnes — Deutéronome 11:24"
              width={1672}
              height={941}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="rounded-3xl shadow-2xl shadow-navy-950/20"
            />
            <figcaption className="mt-4 text-sm text-ink/60">
              <span className="font-semibold text-gold-700">Thème de l&apos;année 2026</span> — Gabaon, posséder les
              sommets des montagnes.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ——— Première visite ——— */}
      <section id="visite" className="bg-white px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Première visite"
            title="Vous venez pour la première fois ?"
            intro="Nous serions heureux de vous accueillir. Voici à quoi vous attendre."
            align="center"
          />
          <ol className="mt-14 grid gap-6 md:grid-cols-3">
            {firstVisit.map((step, i) => (
              <li key={step.title} className="rounded-3xl bg-ivory p-8">
                <span className="font-display text-4xl text-gold-500 tabular-nums">0{i + 1}</span>
                <h3 className="font-display mt-4 text-xl font-semibold text-navy-900">{step.title}</h3>
                <p className="mt-3 leading-7 text-ink/70">{step.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href={site.welcomeForm} external>
              Remplir le formulaire d&apos;accueil
            </Button>
            <Button href={site.phone.href} variant="outline-dark">
              Nous appeler
            </Button>
          </div>
        </div>
      </section>

      {/* ——— Pasteur ——— */}
      <section className="bg-navy-950 px-5 py-24 text-white md:px-8 md:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[320px_1fr]">
          <Image
            src="/pasteur-diez.jpg"
            alt="Pasteur Diez Mendez Kambault"
            width={640}
            height={640}
            sizes="320px"
            className="mx-auto size-64 rounded-full object-cover md:size-80"
          />
          <div>
            <p className="eyebrow text-gold-400">Le pasteur local</p>
            <h2 className="font-display mt-3 text-3xl font-semibold md:text-5xl">Pasteur Diez Mendez Kambault</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">
              Marié et père d&apos;une fille, il prêche l&apos;Évangile depuis 2013. Son ministère est centré sur la
              formation des disciples, le mentorat transformationnel et l&apos;accompagnement spirituel.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/apropos/pasteur-local" variant="outline">
                En savoir plus
              </Button>
              <Button href={site.bookShop} external variant="outline">
                Son livre « La Dernière Génération »
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ——— Enseignements ——— */}
      <section id="enseignements" className="px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Prédications & louange"
              title="Nourrissez votre foi, où que vous soyez."
              intro="Messages, enseignements bibliques et temps d'adoration : retrouvez-les sur notre chaîne YouTube."
            />
            <Button href={site.socials.youtube} external variant="navy" className="shrink-0">
              Toute la chaîne YouTube
            </Button>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {featuredVideos.map((v) => (
              <YouTubeLite key={v.id} id={v.id} title={v.title} />
            ))}
          </div>
        </div>
      </section>

      {/* ——— Événements ——— */}
      <section id="evenements" className="bg-white px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Événements" title="Les temps forts de l'église" />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {events.map((e) => (
              <li key={e.href}>
                <Link
                  href={e.href}
                  className="group relative isolate flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-3xl p-6 text-white"
                >
                  <Image
                    src={e.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
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
          </ul>
        </div>
      </section>

      {/* ——— Vie de l'église ——— */}
      <section className="px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Vie de l'église"
              title="Une famille, plus qu'une assemblée."
              intro="Adoration, enseignement, prière, communion fraternelle : la vie de l'AFVN Nantes en images."
            />
            <Button href="/apropos/vie-eglise-locale" variant="outline-dark" className="shrink-0">
              Voir la galerie
            </Button>
          </div>
          <ul className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {life.map((src, i) => (
              <li key={src} className={`relative overflow-hidden rounded-2xl ${i % 2 ? "md:mt-10" : ""} aspect-[3/4]`}>
                <Image
                  src={src}
                  alt="Moment de vie à l'AFVN Nantes"
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ——— Contact ——— */}
      <section id="contact" className="bg-navy-900 px-5 py-24 text-white md:px-8 md:py-28">
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
              className="size-full min-h-80 grayscale-[30%]"
            />
          </div>
        </div>
      </section>
    </>
  );
}
