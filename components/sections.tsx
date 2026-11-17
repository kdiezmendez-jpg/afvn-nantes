import Image from "next/image";
import QRCode from "qrcode";
import { Icon } from "./icons";
import { NextServicePill, UpcomingList } from "./live-schedule";
import { ArrowLink, Button, DisplayTitle, Eyebrow, Lead } from "./ui";
import { YouTubeLite } from "./youtube-lite";
import { dna, featuredVideos, formatTime, ministries, schedule, site } from "@/lib/site";

/* ───────── Notre ADN : Rencontrer · Grandir · Rayonner ───────── */
export function DnaSection() {
  return (
    <section className="px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <div>
            <Eyebrow>Notre ADN</Eyebrow>
            <DisplayTitle className="mt-4" lead="Une église qui ne se contente pas d'exister." accent="Elle porte la vie." />
          </div>
          <div className="lg:pt-10">
            <Lead>
              L&apos;AFVN est une famille spirituelle centrée sur Jésus-Christ. Ici, chacun peut rencontrer Dieu, découvrir
              son appel et grandir au milieu d&apos;une communauté qui l&apos;accompagne.
            </Lead>
            <div className="mt-6">
              <ArrowLink href="/notre-eglise">Qui sommes-nous ?</ArrowLink>
            </div>
          </div>
        </div>
        <ol className="mt-16 grid border-y border-ink/10 md:grid-cols-3 md:divide-x md:divide-ink/10">
          {dna.map((d, i) => (
            <li key={d.title} className="relative border-b border-ink/10 p-8 last:border-b-0 md:border-b-0 md:p-10">
              <span className="absolute right-8 top-8 text-xs font-semibold tabular-nums text-gold-700">0{i + 1}</span>
              <Icon name={d.icon} className="size-6 text-gold-500" />
              <h3 className="font-display mt-8 text-3xl font-semibold">{d.title}</h3>
              <p className="mt-3 text-muted">{d.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ───────── Agenda de la semaine ───────── */
export function WeekSection({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <section className={`px-5 py-20 md:px-8 md:py-28 ${tone === "dark" ? "bg-night-950 text-white" : "bg-white"}`}>
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow tone={tone}>Vivre l&apos;AFVN</Eyebrow>
            <DisplayTitle className="mt-4" tone={tone} lead="Les prochains" accent="rendez-vous." />
          </div>
          <ArrowLink href="/agenda" tone={tone}>
            Tout l&apos;agenda
          </ArrowLink>
        </div>
        <div className="mt-12">
          <UpcomingList count={3} tone={tone} />
        </div>
      </div>
    </section>
  );
}

/* ───────── Le culte en direct + derniers messages ───────── */
export function LiveSection({ withVideos = true }: { withVideos?: boolean }) {
  const sunday = schedule.find((s) => s.live) ?? schedule[0];
  return (
    <section id="direct" className="bg-night-950 text-white">
      <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
        <div className="relative isolate flex min-h-80 items-center justify-center overflow-hidden px-5 py-16 md:px-8">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_40%_45%,rgb(29_92_107/0.55),transparent_60%)]" />
          {[22, 32, 42].map((s) => (
            <span key={s} className="absolute -z-10 rounded-full border border-white/[0.07]" style={{ width: `${s}rem`, height: `${s}rem` }} aria-hidden />
          ))}
          <span className="absolute left-[55%] top-[55%] -z-10 size-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/15 blur-2xl" aria-hidden />
          <a
            href={site.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="grid size-24 place-items-center rounded-full border border-white/40 text-white transition hover:scale-105 hover:border-gold-400 hover:text-gold-300"
            aria-label="Suivre le culte en direct sur YouTube (nouvel onglet)"
          >
            <Icon name="play" className="ml-1 size-8" />
          </a>
          <p className="eyebrow absolute bottom-6 right-6 text-white/45">YouTube · Facebook</p>
          <NextServicePill className="absolute left-5 top-6 md:left-8" />
        </div>
        <div className="flex flex-col justify-center px-5 py-16 md:px-12 lg:py-24">
          <Eyebrow tone="dark">L&apos;église partout avec vous</Eyebrow>
          <DisplayTitle className="mt-4" tone="dark" lead="Vivez le culte." accent="Où que vous soyez." />
          <Lead tone="dark" className="mt-6">
            Rejoignez la célébration chaque dimanche, retrouvez les replays et partagez un message d&apos;espérance autour de
            vous.
          </Lead>
          <div className="mt-8 flex items-center gap-4 border-y border-white/10 py-5">
            <Icon name="clock" className="size-6 text-gold-400" />
            <div>
              <p className="eyebrow !text-[0.7rem] text-white/50">Rendez-vous</p>
              <p className="font-semibold">
                {sunday.day} · {formatTime(sunday.start)} — {formatTime(sunday.end)}
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/rappel-culte.ics" download variant="ghost-dark">
              <Icon name="bell" className="size-4" /> Ajouter les cultes à mon agenda
            </Button>
            <Button href={site.socials.youtube} external variant="ghost-dark">
              S&apos;abonner sur YouTube
            </Button>
          </div>
        </div>
      </div>
      {withVideos ? (
        <div className="mx-auto max-w-7xl px-5 pb-20 md:px-8 md:pb-28">
          <div className="flex items-end justify-between gap-6 border-t border-white/10 pt-14">
            <div>
              <Eyebrow tone="dark">Nourrir sa foi</Eyebrow>
              <h3 className="font-display mt-3 text-3xl font-semibold md:text-4xl">Derniers messages</h3>
            </div>
            <ArrowLink href="/predications" tone="dark">
              Toutes les vidéos
            </ArrowLink>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {featuredVideos.map((v) => (
              <figure key={v.id}>
                <YouTubeLite id={v.id} title={v.title} />
                <figcaption className="mt-4">
                  <span className="eyebrow !text-[0.7rem] text-gold-400">{v.kind}</span>
                  <span className="font-display mt-1 block text-xl">{v.title}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

/* ───────── CESA : accueil des nouveaux venus (QR code) ───────── */
export async function CesaSection({ primary = false }: { primary?: boolean }) {
  const qr = await QRCode.toString(site.welcomeForm, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 0,
    color: { dark: "#03141f", light: "#ffffff" },
  });
  const steps = [
    { t: "Je scanne", d: "Avec l'appareil photo de mon téléphone" },
    { t: "Je me présente", d: "Nom, contact et date de première visite" },
    { t: "Je suis accueilli(e)", d: "L'équipe CESA prend soin de moi" },
  ];
  return (
    <section id="nouveau" className="grid-lines relative overflow-hidden bg-night-900 px-5 py-20 text-white md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-14 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <Eyebrow tone="dark">CESA · Accueil des nouveaux venus</Eyebrow>
            <DisplayTitle className="mt-4" tone="dark" lead="Vous êtes ici" accent="pour la première fois ?" />
            <Lead tone="dark" className="mt-6 max-w-xl">
              Pas besoin de s&apos;inscrire pour venir : nos cultes sont ouverts à tous. Scannez ce QR code ou utilisez le
              bouton : en moins de deux minutes, notre équipe pourra vous accueillir et vous accompagner.
            </Lead>
            <div className="mt-8 flex max-w-xl items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold-400/15 text-gold-400">
                <Icon name="lock" className="size-5" />
              </span>
              <p className="text-sm leading-6 text-white/70">
                <strong className="block text-white">Vos informations restent protégées</strong>
                Elles sont transmises uniquement à l&apos;équipe d&apos;accueil de l&apos;église.
              </p>
            </div>
            <div className="mt-8">
              <Button href={site.welcomeForm} external variant={primary ? "gold" : "ghost-dark"}>
                Remplir le formulaire d&apos;accueil (2 min) →
              </Button>
            </div>
          </div>
          <div className="mx-auto w-full max-w-sm rotate-[-2deg] rounded-[2rem] bg-white p-8 text-center text-ink shadow-2xl shadow-black/30 transition hover:rotate-0">
            <div className="mx-auto w-52 rounded-xl border-[10px] border-cream p-2" role="img" aria-label="QR code du formulaire d'accueil">
              <div className="[&>svg]:h-auto [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: qr }} />
            </div>
            <p className="eyebrow mt-6 !text-[0.7rem] text-gold-700">Scannez pour vous enregistrer</p>
            <p className="font-display mt-2 text-2xl font-semibold">Bienvenue à l&apos;AFVN Nantes</p>
            <a
              href={site.welcomeForm}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-11 items-center rounded-full border border-ink/25 px-6 text-sm font-semibold text-ink hover:border-gold-600 hover:text-gold-700"
            >
              Ouvrir le formulaire
            </a>
          </div>
        </div>
        <ol className="mt-16 grid gap-6 border-t border-white/10 pt-10 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.t} className="flex gap-4">
              <span className="font-display text-3xl text-gold-400">0{i + 1}</span>
              <span>
                <span className="block font-semibold">{s.t}</span>
                <span className="text-sm text-white/60">{s.d}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ───────── Prière ───────── */
export function PrayerSection() {
  const hasForm = Boolean(site.prayerForm);
  return (
    <section id="priere" className="bg-sage px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <Eyebrow>Nous prions avec vous</Eyebrow>
          <DisplayTitle className="mt-4" lead="Vous n'avez pas à" accent="porter cela seul." />
          <Lead className="mt-6 max-w-xl">
            Confiez-nous votre sujet de prière. Votre demande est reçue uniquement par l&apos;équipe pastorale et vous
            pouvez rester anonyme.
          </Lead>
          <p className="mt-6 flex items-center gap-2 text-sm font-semibold text-ink/80">
            <span className="text-gold-600">◆</span> Confidentiel &amp; respectueux de votre vie privée
          </p>
        </div>
        <div className="relative">
          <div className="absolute inset-0 translate-x-4 translate-y-4 bg-gold-400" aria-hidden />
          <div className="relative bg-night-950 p-10 text-white">
            <Icon name="spark" className="size-8 text-gold-400" />
            <p className="font-display mt-6 text-3xl font-semibold leading-tight">Comment pouvons-nous prier pour vous ?</p>
            <p className="mt-3 text-sm text-white/60">Une équipe bienveillante vous accompagne dans la foi.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {hasForm ? (
                <Button href={site.prayerForm} external variant="ghost-dark">
                  Déposer une demande de prière →
                </Button>
              ) : null}
              <Button href={site.phone.href} variant="ghost-dark">
                <Icon name="phone" className="size-4" /> Appeler pour prier ensemble
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── Ministères ───────── */
export function MinistriesSection() {
  return (
    <section id="ministeres" className="bg-sage px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.6fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow>Une place pour chacun</Eyebrow>
          <DisplayTitle className="mt-4" lead="Découvrez nos" accent="ministères." />
          <Lead className="mt-6">Servez, grandissez et créez des liens dans un espace adapté à votre saison de vie.</Lead>
          <div className="mt-8">
            <Button href="/nous-rejoindre" variant="night">
              Je veux servir
            </Button>
          </div>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {ministries.map((m) => (
            <li key={m.title} className="bg-white p-8 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-ink/5">
              <Icon name={m.icon} className="size-6 text-gold-600" />
              <h3 className="font-display mt-8 text-2xl font-semibold">{m.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{m.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────── Donner ───────── */
export function GiveSection({ compact = false }: { compact?: boolean }) {
  const online = Boolean(site.donationUrl);
  const items = [
    { t: "Dîmes & offrandes", d: "Soutenir la vie de l'église" },
    { t: "Actions sociales", d: "Aider les familles et personnes fragiles" },
    { t: "Projets AFVN", d: "Faire grandir les missions de l'église" },
  ];
  return (
    <section id="donner" className="px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        <div>
          <Eyebrow>Soutenir la mission</Eyebrow>
          <DisplayTitle className="mt-4" lead="Donner avec joie." accent="Transformer des vies." size={compact ? "lg" : "lg"} />
          <Lead className="mt-6 max-w-lg">
            Participez aux dîmes, offrandes, actions sociales et projets de l&apos;AFVN.{" "}
            {online
              ? "Le paiement est sécurisé et accompagné d'un reçu."
              : "Le don en ligne sécurisé arrive bientôt ; en attendant, vous pouvez donner lors des cultes."}
          </Lead>
        </div>
        <ul className="grid gap-3">
          {items.map((it) => (
            <li key={it.t}>
              <a
                href={online ? site.donationUrl : "/donner"}
                {...(online ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex items-center gap-5 border border-ink/10 bg-white p-6 transition hover:border-gold-500/50 hover:shadow-lg hover:shadow-ink/5"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-gold-200/60 text-gold-600">
                  <Icon name="spark" className="size-4" />
                </span>
                <span className="flex-1">
                  <span className="block font-semibold">{it.t}</span>
                  <span className="text-sm text-muted">{it.d}</span>
                </span>
                <span className="text-sm font-semibold text-gold-700">{online ? "Donner →" : "Bientôt"}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────── Appel final ───────── */
export function FinalCta() {
  return (
    <section className="relative isolate overflow-hidden bg-gold-400 px-5 py-28 text-center md:py-36">
      {[44, 62, 80].map((s) => (
        <span
          key={s}
          aria-hidden
          className="absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/25"
          style={{ width: `${s}rem`, height: `${s}rem`, opacity: 1 - s / 110 }}
        />
      ))}
      <p className="eyebrow text-night-950/70">Venez comme vous êtes</p>
      <h2 className="font-display mx-auto mt-5 max-w-3xl text-5xl font-semibold leading-[1.02] text-night-950 md:text-7xl">
        Il y a une place <em className="font-medium italic text-night-700">pour vous.</em>
      </h2>
      <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-night-950/75">
        Découvrez une famille, une foi vivante et un lieu où votre histoire peut prendre un nouveau départ.
      </p>
      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <Button href="/nous-rejoindre" variant="night">
          ✦ Préparer ma première visite
        </Button>
        <a
          href={site.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-night-950 px-7 text-sm font-semibold text-night-950 transition hover:bg-night-950 hover:text-gold-300"
        >
          Itinéraire → {site.address.street}
        </a>
      </div>
    </section>
  );
}

/* ───────── Carte des photos ───────── */
export function PhotoStrip({ photos }: { photos: readonly { src: string; alt: string }[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {photos.slice(0, 4).map((p, i) => (
        <li key={p.src} className={`relative aspect-[4/5] overflow-hidden rounded-xl ${i % 2 ? "md:translate-y-10" : ""}`}>
          <Image src={p.src} alt={p.alt} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" />
        </li>
      ))}
    </ul>
  );
}
