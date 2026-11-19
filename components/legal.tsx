import type { ReactNode } from "react";
import { PageHero } from "./ui";

// Valeur légale : affiche « à compléter » surligné tant qu'elle est vide.
export function L({ v, hint }: { v: string; hint: string }) {
  if (v) return <>{v}</>;
  return (
    <mark className="rounded bg-gold-200 px-1.5 py-0.5 text-ink" title={hint}>
      [à compléter : {hint}]
    </mark>
  );
}

export function LegalPage({ eyebrow, lead, accent, updated, children }: { eyebrow: string; lead: string; accent: string; updated: string; children: ReactNode }) {
  return (
    <>
      <PageHero eyebrow={eyebrow} lead={lead} accent={accent} intro={<p className="text-sm text-white/65">Dernière mise à jour : {updated}</p>} />
      <article className="px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-3xl space-y-10 text-[1.05rem] leading-8 text-ink/85 [&_a]:font-semibold [&_a]:text-gold-700 [&_a]:underline [&_a]:underline-offset-2 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_p+p]:mt-4 [&_ul]:mt-3 [&_ul]:space-y-1.5">
          {children}
        </div>
      </article>
    </>
  );
}
