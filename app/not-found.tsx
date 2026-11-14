import { Button, PageHero } from "@/components/ui";

export default function NotFound() {
  return (
    <PageHero eyebrow="Erreur 404" title="Cette page est introuvable." intro="Elle a peut-être été déplacée. Revenez à l'accueil pour continuer.">
      <div className="mt-8">
        <Button href="/">Retour à l&apos;accueil</Button>
      </div>
    </PageHero>
  );
}
