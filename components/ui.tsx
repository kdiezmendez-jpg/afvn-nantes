import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  imageAlt = "",
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  image?: string;
  imageAlt?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-950 pb-16 pt-36 text-white md:pb-24 md:pt-44">
      {image ? (
        <>
          <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="-z-20 object-cover opacity-40" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950 via-navy-950/70 to-navy-950/30" />
        </>
      ) : (
        <div className="absolute -right-32 -top-32 -z-10 size-[32rem] rounded-full bg-gold-500/15 blur-3xl" />
      )}
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="eyebrow text-gold-400">{eyebrow}</p>
        <h1 className="font-display mt-4 max-w-4xl text-4xl font-semibold leading-[1.08] text-balance md:text-6xl">
          {title}
        </h1>
        {intro ? <div className="mt-6 max-w-2xl text-lg leading-8 text-white/80 text-pretty">{intro}</div> : null}
        {children}
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  tone = "light",
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className={`eyebrow ${tone === "dark" ? "text-gold-400" : "text-gold-700"}`}>{eyebrow}</p>
      <h2
        className={`font-display mt-3 text-3xl font-semibold leading-tight text-balance md:text-5xl ${
          tone === "dark" ? "text-white" : "text-navy-900"
        }`}
      >
        {title}
      </h2>
      {intro ? (
        <p className={`mt-5 text-lg leading-8 text-pretty ${tone === "dark" ? "text-white/75" : "text-ink/70"}`}>{intro}</p>
      ) : null}
    </div>
  );
}

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "gold" | "outline" | "outline-dark" | "navy";
  external?: boolean;
  className?: string;
};

const variants = {
  gold: "bg-gold-400 text-navy-950 hover:bg-gold-300",
  navy: "bg-navy-900 text-white hover:bg-navy-800",
  outline: "border border-white/30 text-white hover:border-gold-300 hover:text-gold-300",
  "outline-dark": "border border-navy-900/20 text-navy-900 hover:border-gold-600 hover:text-gold-700",
};

export function Button({ href, children, variant = "gold", external, className = "" }: ButtonProps) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition active:scale-[0.97] ${variants[variant]} ${className}`;
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
        <span className="sr-only"> (nouvel onglet)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export function Gallery({ photos, alt }: { photos: readonly string[]; alt: string }) {
  return (
    <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4">
      {photos.map((src, i) => (
        <li key={src} className="break-inside-avoid overflow-hidden rounded-2xl bg-navy-900/5 outline outline-1 -outline-offset-1 outline-black/5">
          <Image
            src={src}
            alt={`${alt} — photo ${i + 1}`}
            width={1200}
            height={900}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="h-auto w-full transition duration-500 hover:scale-[1.02]"
          />
        </li>
      ))}
    </ul>
  );
}

export function ComingSoon({ what }: { what: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-navy-900/20 bg-white p-10 text-center">
      <p className="font-display text-2xl text-navy-900">Les {what} arrivent bientôt</p>
      <p className="mx-auto mt-3 max-w-md text-ink/70">
        En attendant, retrouvez nos dernières vidéos sur YouTube et nos actualités sur Instagram.
      </p>
    </div>
  );
}
