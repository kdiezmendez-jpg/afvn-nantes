import type { Metadata } from "next";
import { L, LegalPage } from "@/components/legal";
import { legal } from "@/lib/legal";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Conditions générales d'utilisation · AFVN Nantes",
  description: "Règles d'utilisation du site de l'AFVN Nantes : accès, contenus, liens externes, dons, responsabilité et droit applicable.",
  path: "/conditions",
});

export default function ConditionsPage() {
  return (
    <LegalPage eyebrow="Utilisation du site" lead="Conditions générales" accent="d'utilisation." updated={legal.lastUpdate}>
      <section>
        <h2>Objet</h2>
        <p>
          Ces conditions encadrent l&apos;utilisation du site de l&apos;église AFVN Nantes, édité par{" "}
          <L v={legal.publisherName} hint="nom officiel de l'association" />. En naviguant sur le site, vous les acceptez.
        </p>
      </section>
      <section>
        <h2>Accès au site</h2>
        <p>
          Le site est gratuit et accessible à tous, sans inscription. Nous faisons notre possible pour qu&apos;il soit
          disponible en permanence, sans pouvoir le garantir (maintenance, panne de l&apos;hébergeur, etc.).
        </p>
      </section>
      <section>
        <h2>Contenus</h2>
        <p>
          Les textes, prédications, photos et vidéos sont proposés pour l&apos;édification personnelle. Vous pouvez les
          partager en citant la source ; toute réutilisation commerciale ou modification est interdite sans accord
          écrit. Les horaires et événements sont donnés à titre indicatif et peuvent évoluer.
        </p>
      </section>
      <section>
        <h2>Liens vers d&apos;autres sites</h2>
        <p>
          Le site renvoie vers des services tiers (YouTube, Instagram, Facebook, Google Forms, Google Maps, boutique en
          ligne du livre). Leur contenu et leurs conditions relèvent de leurs éditeurs respectifs.
        </p>
      </section>
      <section>
        <h2>Dons</h2>
        <p>
          Les dons sont libres et volontaires. Lorsqu&apos;ils sont faits en ligne, le paiement est assuré par une
          plateforme spécialisée et sécurisée : vos coordonnées bancaires ne transitent jamais par notre site.{" "}
          <L v="" hint="conditions de remboursement et de reçu fiscal, selon la plateforme de don choisie" />
        </p>
      </section>
      <section>
        <h2>Responsabilité</h2>
        <p>
          L&apos;église ne peut être tenue responsable d&apos;une interruption du site, d&apos;une erreur dans les
          informations publiées ou du contenu des sites tiers. Si vous constatez une erreur, merci de nous la signaler au{" "}
          <a href={site.phone.href}>{site.phone.display}</a>.
        </p>
      </section>
      <section>
        <h2>Droit applicable</h2>
        <p>
          Ces conditions sont soumises au droit français. En cas de litige, une solution amiable sera recherchée avant
          toute action devant les tribunaux compétents de Nantes.
        </p>
      </section>
    </LegalPage>
  );
}
