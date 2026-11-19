import Link from "next/link";
import { Button, PageHero } from "@/components/ui";

const links = [
  { href: "/nous-rejoindre", label: "Je suis nouveau" },
  { href: "/agenda", label: "Horaires et agenda" },
  { href: "/predications", label: "Prédications et live" },
  { href: "/notre-eglise", label: "Notre église" },
  { href: "/priere", label: "Demande de prière" },
];

export default function NotFound() {
  return (
    <PageHero
      eyebrow="Erreur 404"
      lead="Cette page"
      accent="est introuvable."
      intro="L'adresse a peut-être changé ou contient une faute de frappe. Voici où vous pouvez aller :"
    >
      <div className="mt-8">
        <Button href="/">Retour à l&apos;accueil</Button>
      </div>
      <ul className="mt-10 flex flex-wrap gap-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="inline-flex min-h-11 items-center rounded-full border border-white/25 px-5 text-sm text-white hover:border-gold-400 hover:text-gold-300">
              {l.label} →
            </Link>
          </li>
        ))}
      </ul>
    </PageHero>
  );
}
