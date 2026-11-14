import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type Tone = "light" | "dark";

export function Eyebrow({ children, tone = "light", className = "" }: { children: ReactNode; tone?: Tone; className?: string }) {
  return <p className={`eyebrow ${tone === "dark" ? "text-gold-400" : "text-gold-700"} ${className}`}>{children}</p>;
}

// Titre en Playfair avec une partie en italique dorée, comme « Vous êtes ici / pour la première fois ? »
export function DisplayTitle({
  lead,
  accent,
  as: Tag = "h2",
  tone = "light",
  size = "lg",
  className = "",
}: {
  lead: ReactNode;
  accent?: ReactNode;
  as?: "h1" | "h2" | "h3";
  tone?: Tone;
  size?: "md" | "lg" | "xl";
  className?: string;
}) {
  const sizes = {
    md: "text-3xl md:text-4xl",
    lg: "text-4xl md:text-6xl",
    xl: "text-5xl sm:text-6xl md:text-8xl",
  };
  return (
    <Tag
      className={`font-display font-semibold leading-[1.04] text-balance ${sizes[size]} ${
        tone === "dark" ? "text-white" : "text-ink"
      } ${className}`}
    >
      {lead}
      {accent ? (
        <>
          {" "}
          <em className={`font-medium italic ${tone === "dark" ? "text-gold-400" : "text-gold-600"}`}>{accent}</em>
        </>
      ) : null}
    </Tag>
  );
}

export function Lead({ children, tone = "light", className = "" }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <p className={`text-lg leading-8 text-pretty ${tone === "dark" ? "text-white/75" : "text-muted"} ${className}`}>
      {children}
    </p>
  );
}

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "gold" | "night" | "ghost-dark" | "ghost-light";
  external?: boolean;
  className?: string;
  download?: boolean;
};

const variants = {
  gold: "bg-gold-400 text-night-950 hover:bg-gold-300 shadow-lg shadow-gold-500/20",
  night: "bg-night-900 text-white hover:bg-night-800",
  "ghost-dark": "border border-white/25 text-white hover:border-gold-400 hover:text-gold-300",
  "ghost-light": "border border-ink/25 text-ink hover:border-gold-600 hover:text-gold-700",
};

export function Button({ href, children, variant = "gold", external, className = "", download }: ButtonProps) {
  const cls = `inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-semibold transition duration-200 active:scale-[0.97] ${variants[variant]} ${className}`;
  if (external || download || href.startsWith("tel:") || href.startsWith("http")) {
    return (
      <a
        href={href}
        className={cls}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...(download ? { download: true } : {})}
      >
        {children}
        {external ? <span className="sr-only"> (nouvel onglet)</span> : null}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export function ArrowLink({ href, children, tone = "light", external }: { href: string; children: ReactNode; tone?: Tone; external?: boolean }) {
  const cls = `group inline-flex items-center gap-2 border-b pb-1 text-sm font-semibold transition-colors ${
    tone === "dark" ? "border-gold-400/50 text-gold-300 hover:text-gold-200" : "border-gold-600/40 text-ink hover:text-gold-700"
  }`;
  const inner = (
    <>
      {children}
      <span aria-hidden className="transition-transform group-hover:translate-x-1">
        →
      </span>
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

export function PageHero({
  eyebrow,
  lead,
  accent,
  intro,
  image,
  children,
}: {
  eyebrow: string;
  lead: ReactNode;
  accent?: ReactNode;
  intro?: ReactNode;
  image?: string;
  children?: ReactNode;
}) {
  return (
    <section className="grid-lines relative isolate overflow-hidden bg-night-950 pb-16 pt-36 text-white md:pb-24 md:pt-44">
      {image ? (
        <>
          <Image src={image} alt="" fill priority sizes="100vw" className="-z-20 object-cover opacity-30" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-night-950 via-night-950/75 to-night-950/40" />
        </>
      ) : (
        <div className="absolute -right-40 -top-40 -z-10 size-[36rem] rounded-full bg-teal-700/30 blur-3xl" />
      )}
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Eyebrow tone="dark">{eyebrow}</Eyebrow>
        <DisplayTitle as="h1" tone="dark" lead={lead} accent={accent} className="mt-5 max-w-4xl" />
        {intro ? <div className="mt-6 max-w-2xl text-lg leading-8 text-white/75 text-pretty">{intro}</div> : null}
        {children}
      </div>
    </section>
  );
}

export function Gallery({ photos }: { photos: readonly { src: string; alt: string }[] }) {
  return (
    <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4">
      {photos.map((p) => (
        <li key={p.src} className="break-inside-avoid overflow-hidden rounded-2xl bg-night-900/5">
          <Image
            src={p.src}
            alt={p.alt}
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
