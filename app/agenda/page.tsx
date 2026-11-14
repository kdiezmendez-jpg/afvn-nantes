import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { FinalCta, LiveSection } from "@/components/sections";
import { UpcomingList } from "@/components/live-schedule";
import { Button, DisplayTitle, Eyebrow, Lead, PageHero } from "@/components/ui";
import { events, formatTime, schedule } from "@/lib/site";

export const metadata: Metadata = {
  title: "Agenda — Horaires des cultes",
  description:
    "Horaires des cultes de l'AFVN Nantes : culte de célébration le dimanche à 9h30, enseignement et intercession le vendredi à 19h. Prochains rendez-vous et temps forts.",
  alternates: { canonical: "/agenda" },
};

export default function AgendaPage() {
  return (
    <>
      <PageHero
        eyebrow="Cette semaine à l'AFVN"
        lead="Une semaine pour"
        accent="grandir ensemble."
        intro="Retrouvez nos rendez-vous hebdomadaires et les temps forts de la communauté. Ajoutez-les à votre agenda pour ne rien manquer."
      >
        <div className="mt-8">
          <Button href="/rappel-culte.ics" download>
            <Icon name="bell" className="size-4" /> Ajouter les cultes à mon agenda
          </Button>
        </div>
      </PageHero>

      <section className="px-5 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <ul className="grid border-y border-ink/10 md:grid-cols-2 md:divide-x md:divide-ink/10">
            {schedule.map((s) => (
              <li key={s.day} className="p-8 max-md:border-b max-md:border-ink/10 max-md:last:border-b-0 md:p-10">
                <p className="eyebrow text-gold-700">{s.short}</p>
                <p className="font-display mt-4 text-5xl font-semibold tabular-nums">{formatTime(s.start)}</p>
                <p className="mt-3 text-lg font-semibold">{s.title}</p>
                <p className="mt-1 text-sm text-muted">
                  {s.day} · {formatTime(s.start)} — {formatTime(s.end)} · {s.detail}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-20">
            <Eyebrow>Calendrier</Eyebrow>
            <DisplayTitle className="mt-4" lead="Les prochains" accent="rendez-vous." size="md" />
            <div className="mt-10">
              <UpcomingList count={6} />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <Eyebrow>Temps forts</Eyebrow>
          <DisplayTitle className="mt-4" lead="Vivre l'église" accent="au-delà du dimanche." />
          <Lead className="mt-6 max-w-2xl">Conférences, soirées de louange et rencontres : les grands moments de l&apos;année.</Lead>
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {events.map((e) => (
              <li key={e.href}>
                <Link href={e.href} className="group relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden p-7 text-white">
                  <Image src={e.image} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="-z-20 object-cover transition duration-700 group-hover:scale-105" />
                  <span className="absolute inset-0 -z-10 bg-gradient-to-t from-night-950 via-night-950/50 to-transparent" />
                  <span className="eyebrow !text-[0.6rem] text-gold-300">{e.kicker}</span>
                  <span className="font-display mt-2 text-3xl font-semibold">{e.title}</span>
                  <span className="mt-2 text-sm text-white/80">{e.description}</span>
                  <span className="mt-4 text-sm font-semibold text-gold-300">Découvrir →</span>
                </Link>
              </li>
            ))}
            <li>
              <figure className="flex h-full flex-col bg-cream">
                <Image src="/theme-2026.jpg" alt="Thème 2026 : Gabaon, posséder les sommets des montagnes — Deutéronome 11:24" width={1672} height={941} sizes="(min-width: 768px) 33vw, 100vw" className="w-full" />
                <figcaption className="flex flex-1 flex-col justify-center p-7">
                  <span className="eyebrow !text-[0.6rem] text-gold-700">Thème de l&apos;année</span>
                  <span className="font-display mt-2 text-3xl font-semibold">2026 · Gabaon</span>
                  <span className="mt-2 text-sm text-muted">Posséder les sommets des montagnes — Deutéronome 11:24</span>
                </figcaption>
              </figure>
            </li>
          </ul>
        </div>
      </section>

      <LiveSection withVideos={false} />
      <FinalCta />
    </>
  );
}
